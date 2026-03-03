import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Design from '@/lib/models/Design';
import { generateSystemDesign, AppError } from '@/lib/services/groqService';

// --------------- Error helper ---------------
function errorResponse(error: unknown) {
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        status: error.status,
        message: error.message,
        ...(error.details && { details: error.details }),
      },
      { status: error.statusCode }
    );
  }

  const err = error as any;

  // Mongoose CastError
  if (err?.name === 'CastError') {
    return NextResponse.json(
      { success: false, message: `Invalid ${err.path}: ${err.value}` },
      { status: 400 }
    );
  }

  // Mongoose validation
  if (err?.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e: any) => e.message);
    return NextResponse.json(
      { success: false, message: 'Validation Error', details: messages },
      { status: 400 }
    );
  }

  console.error('[API /designs] Error:', err?.message || err);
  return NextResponse.json(
    { success: false, message: err?.message || 'Internal Server Error' },
    { status: 500 }
  );
}

// --------------- GET /api/designs ---------------
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12')));
    const skip = (page - 1) * limit;
    const search = searchParams.get('search')?.trim();

    let filter: Record<string, any> = {};
    if (search) {
      filter = { $text: { $search: search } };
    }

    const [designs, total] = await Promise.all([
      Design.find(filter)
        .select('title prompt status createdAt generationTimeMs')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Design.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: designs,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}

// --------------- POST /api/designs ---------------
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { prompt, title } = body;

    // Validation
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 5) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation error',
          details: ['Prompt must be between 5 and 1000 characters'],
        },
        { status: 400 }
      );
    }

    if (prompt.length > 1000) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation error',
          details: ['Prompt cannot exceed 1000 characters'],
        },
        { status: 400 }
      );
    }

    const designTitle =
      title || (prompt.length > 100 ? prompt.substring(0, 100) + '...' : prompt);

    // Create initial record
    const design = await Design.create({
      title: designTitle,
      prompt: prompt.trim(),
      status: 'generating',
      structuredAIResponse: {
        microservices: [],
        databaseSchema: [],
        apiEndpoints: [],
        cachingStrategy: { approach: '', tools: [], layers: [] },
        loadBalancing: { approach: '', algorithm: '', tools: [], details: '' },
        scalingStrategy: {
          horizontal: { description: '', services: [], autoScalingRules: [] },
          vertical: { description: '', services: [] },
        },
        infrastructure: { cloudProvider: '', services: [], regions: [], estimatedCost: '' },
        systemFlow: { description: '', steps: [] },
      },
    });

    // Generate AI response
    const { data, generationTimeMs } = await generateSystemDesign(prompt.trim());

    // Update with actual response
    design.structuredAIResponse = data;
    design.status = 'completed';
    design.generationTimeMs = generationTimeMs;
    await design.save();

    return NextResponse.json(
      {
        success: true,
        data: design,
        meta: { generationTimeMs },
      },
      { status: 201 }
    );
  } catch (error) {
    return errorResponse(error);
  }
}
