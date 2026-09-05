import { NextRequest, NextResponse } from 'next/server';
import { questionHistoryStore } from '@/lib/question-history-store';
import { DynamicQuestionGenerator } from '@/lib/dynamic-question-generator';

export async function GET(req: NextRequest) {
  try {
    const records = questionHistoryStore.getAllRecords();
    return NextResponse.json({
      success: true,
      records,
      totalCount: records.length,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch question records' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, questionId, isValidated, aiEnabled, qualityThreshold } = body;

    if (action === 'TOGGLE_AI') {
      DynamicQuestionGenerator.setAIEnabled(!!aiEnabled);
      if (qualityThreshold) DynamicQuestionGenerator.setQualityThreshold(qualityThreshold);
      return NextResponse.json({ success: true, message: `AI Question Generation set to ${aiEnabled ? 'ENABLED' : 'DISABLED'}` });
    }

    if (action === 'UPDATE_STATUS' && questionId) {
      questionHistoryStore.updateRecordStatus(questionId, !!isValidated);
      return NextResponse.json({ success: true, message: `Question ${questionId} status updated` });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Admin operation failed' }, { status: 500 });
  }
}
