const mongoose = require('mongoose');

const designSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
      index: true,
    },
    prompt: {
      type: String,
      required: [true, 'Prompt is required'],
      trim: true,
      maxlength: [1000, 'Prompt cannot exceed 1000 characters'],
    },
    structuredAIResponse: {
      microservices: [
        {
          name: { type: String, required: true },
          description: { type: String },
          responsibilities: [String],
          dependencies: [String],
          techStack: [String],
        },
      ],
      databaseSchema: [
        {
          name: { type: String, required: true },
          type: { type: String, enum: ['SQL', 'NoSQL', 'Graph', 'TimeSeries', 'Cache'] },
          tables: [
            {
              name: { type: String },
              fields: [
                {
                  name: { type: String },
                  type: { type: String },
                  constraints: { type: String },
                },
              ],
            },
          ],
        },
      ],
      apiEndpoints: [
        {
          service: { type: String },
          endpoints: [
            {
              method: { type: String, enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] },
              path: { type: String },
              description: { type: String },
              auth: { type: Boolean, default: true },
            },
          ],
        },
      ],
      cachingStrategy: {
        approach: { type: String },
        tools: [String],
        layers: [
          {
            name: { type: String },
            description: { type: String },
            ttl: { type: String },
          },
        ],
      },
      loadBalancing: {
        approach: { type: String },
        algorithm: { type: String },
        tools: [String],
        details: { type: String },
      },
      scalingStrategy: {
        horizontal: {
          description: { type: String },
          services: [String],
          autoScalingRules: [String],
        },
        vertical: {
          description: { type: String },
          services: [String],
        },
      },
      infrastructure: {
        cloudProvider: { type: String },
        services: [
          {
            name: { type: String },
            purpose: { type: String },
          },
        ],
        regions: [String],
        estimatedCost: { type: String },
      },
      systemFlow: {
        description: { type: String },
        steps: [
          {
            step: { type: Number },
            action: { type: String },
            from: { type: String },
            to: { type: String },
            description: { type: String },
          },
        ],
      },
    },
    status: {
      type: String,
      enum: ['generating', 'completed', 'failed'],
      default: 'completed',
    },
    generationTimeMs: {
      type: Number,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

designSchema.index({ createdAt: -1 });
designSchema.index({ title: 'text', prompt: 'text' });

const Design = mongoose.model('Design', designSchema);

module.exports = Design;
