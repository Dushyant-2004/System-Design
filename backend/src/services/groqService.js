const Groq = require('groq-sdk');
const { AppError } = require('../middleware/errorHandler');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `You are an expert system design architect. When given a system design problem, you MUST respond with ONLY valid JSON (no markdown, no code fences, no explanation outside JSON).

The JSON must follow this exact structure:
{
  "microservices": [
    {
      "name": "Service Name",
      "description": "What this service does",
      "responsibilities": ["resp1", "resp2"],
      "dependencies": ["other-service-name"],
      "techStack": ["Node.js", "Redis"]
    }
  ],
  "databaseSchema": [
    {
      "name": "Database Name",
      "type": "SQL|NoSQL|Graph|TimeSeries|Cache",
      "tables": [
        {
          "name": "table_name",
          "fields": [
            { "name": "field_name", "type": "data_type", "constraints": "PRIMARY KEY|NOT NULL|INDEXED|etc" }
          ]
        }
      ]
    }
  ],
  "apiEndpoints": [
    {
      "service": "Service Name",
      "endpoints": [
        { "method": "GET|POST|PUT|PATCH|DELETE", "path": "/api/v1/resource", "description": "What it does", "auth": true }
      ]
    }
  ],
  "cachingStrategy": {
    "approach": "Multi-layer caching description",
    "tools": ["Redis", "CDN"],
    "layers": [
      { "name": "Layer Name", "description": "What is cached here", "ttl": "duration" }
    ]
  },
  "loadBalancing": {
    "approach": "Description of approach",
    "algorithm": "Round Robin|Least Connections|IP Hash|etc",
    "tools": ["Nginx", "AWS ALB"],
    "details": "Detailed explanation"
  },
  "scalingStrategy": {
    "horizontal": {
      "description": "How horizontal scaling works",
      "services": ["services that scale horizontally"],
      "autoScalingRules": ["CPU > 70% triggers new instance", "etc"]
    },
    "vertical": {
      "description": "How vertical scaling works",
      "services": ["services that scale vertically"]
    }
  },
  "infrastructure": {
    "cloudProvider": "AWS|GCP|Azure",
    "services": [
      { "name": "Service name", "purpose": "What it's used for" }
    ],
    "regions": ["us-east-1", "eu-west-1"],
    "estimatedCost": "Rough monthly estimate"
  },
  "systemFlow": {
    "description": "High-level description of how the system works end-to-end",
    "steps": [
      { "step": 1, "action": "Action name", "from": "Source", "to": "Destination", "description": "What happens" }
    ]
  }
}

Rules:
- Provide 5-10 microservices with realistic dependencies
- Include at least 2 different database types
- Each service should have 3-6 API endpoints
- Provide detailed caching with 2-4 layers
- Include 5-8 system flow steps
- Be specific with tech stacks, tools, and cloud services
- Make sure the JSON is VALID and COMPLETE
- Do NOT include any text outside the JSON object`;

const generateSystemDesign = async (prompt) => {
  const startTime = Date.now();

  try {
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_groq_api_key_here') {
      throw new AppError('Groq API key is not configured. Set GROQ_API_KEY in .env', 500);
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: `Design a complete system architecture for: "${prompt}". Provide a comprehensive, production-ready system design as structured JSON.`,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 8000,
      top_p: 0.9,
      response_format: { type: 'json_object' },
    });

    const responseText = chatCompletion.choices[0]?.message?.content;

    if (!responseText) {
      throw new AppError('Empty response received from AI service', 502);
    }

    let parsed;
    try {
      parsed = JSON.parse(responseText);
    } catch (parseError) {
      // Try to extract JSON from response if wrapped in markdown
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[0]);
        } catch {
          console.error('Failed to parse AI response:', responseText.substring(0, 500));
          throw new AppError('Failed to parse AI response into structured format', 502);
        }
      } else {
        throw new AppError('AI response was not in expected JSON format', 502);
      }
    }

    // Validate required fields
    const requiredFields = [
      'microservices',
      'databaseSchema',
      'apiEndpoints',
      'cachingStrategy',
      'loadBalancing',
      'scalingStrategy',
      'infrastructure',
      'systemFlow',
    ];

    const missingFields = requiredFields.filter((field) => !parsed[field]);
    if (missingFields.length > 0) {
      console.warn('AI response missing fields:', missingFields);
      // Fill in defaults for missing fields
      missingFields.forEach((field) => {
        parsed[field] = getDefaultField(field);
      });
    }

    const generationTimeMs = Date.now() - startTime;
    return { data: parsed, generationTimeMs };
  } catch (error) {
    if (error instanceof AppError) throw error;

    if (error.status === 429) {
      throw new AppError('AI service rate limit reached. Please wait a moment and try again.', 429);
    }

    if (error.status === 401) {
      throw new AppError('Invalid Groq API key. Please check your configuration.', 401);
    }

    console.error('Groq API Error:', error.message);
    throw new AppError(`AI service error: ${error.message}`, 502);
  }
};

function getDefaultField(field) {
  const defaults = {
    microservices: [],
    databaseSchema: [],
    apiEndpoints: [],
    cachingStrategy: { approach: 'Not specified', tools: [], layers: [] },
    loadBalancing: { approach: 'Not specified', algorithm: 'Round Robin', tools: [], details: '' },
    scalingStrategy: {
      horizontal: { description: 'Not specified', services: [], autoScalingRules: [] },
      vertical: { description: 'Not specified', services: [] },
    },
    infrastructure: { cloudProvider: 'AWS', services: [], regions: [], estimatedCost: 'N/A' },
    systemFlow: { description: 'Not specified', steps: [] },
  };
  return defaults[field] || {};
}

module.exports = { generateSystemDesign };
