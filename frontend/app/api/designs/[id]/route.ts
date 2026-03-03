import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Design from '@/lib/models/Design';
import mongoose from 'mongoose';

// --------------- Error helper ---------------
function errorResponse(error: unknown) {
  const err = error as any;

  if (err?.name === 'CastError') {
    return NextResponse.json(
      { success: false, message: `Invalid ${err.path}: ${err.value}` },
      { status: 400 }
    );
  }

  console.error('[API /designs/[id]] Error:', err?.message || err);
  return NextResponse.json(
    { success: false, message: err?.message || 'Internal Server Error' },
    { status: 500 }
  );
}

// --------------- GET /api/designs/[id] ---------------
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid design ID format' },
        { status: 400 }
      );
    }

    const design = await Design.findById(id).lean();

    if (!design) {
      return NextResponse.json(
        { success: false, message: 'Design not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: design });
  } catch (error) {
    return errorResponse(error);
  }
}

// --------------- DELETE /api/designs/[id] ---------------
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid design ID format' },
        { status: 400 }
      );
    }

    const design = await Design.findByIdAndDelete(id);

    if (!design) {
      return NextResponse.json(
        { success: false, message: 'Design not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Design deleted successfully',
    });
  } catch (error) {
    return errorResponse(error);
  }
}
