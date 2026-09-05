import { NextRequest, NextResponse } from 'next/server';
import { questionHistoryStore } from '@/lib/question-history-store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId') || `session-${Date.now()}`;
    const roundNumber = parseInt(searchParams.get('roundNumber') || '1', 10);
    const timerSeconds = parseInt(searchParams.get('timerSeconds') || '60', 10);

    const { record, payload } = await questionHistoryStore.popNextQuestion(
      sessionId,
      roundNumber,
      timerSeconds
    );

    // Return sanitized client payload ONLY (no correct answer leak per Req #5, #18, #40)
    return NextResponse.json({
      success: true,
      question: payload,
      qualityScore: record.qualityScore,
      isFallback: record.isFallback,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Question generation error' },
      { status: 500 }
    );
  }
}
