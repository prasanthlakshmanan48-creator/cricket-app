import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { evaluateGuess, generateCluesForAttempt } from '@/lib/game-engine';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, guessedPlayerId } = await request.json();

    if (!sessionId || !guessedPlayerId) {
      return NextResponse.json({ error: 'Missing sessionId or guessedPlayerId' }, { status: 400 });
    }

    const session = await prisma.gameSession.findUnique({
      where: { id: sessionId },
      include: { targetPlayer: { include: { competitions: true, statistics: true } } },
    });

    if (!session || session.isCompleted) {
      return NextResponse.json({ error: 'Invalid or completed session' }, { status: 400 });
    }

    const guessedPlayer = await prisma.player.findUnique({
      where: { id: guessedPlayerId },
      include: { competitions: true },
    });

    if (!guessedPlayer) {
      return NextResponse.json({ error: 'Guessed player not found' }, { status: 404 });
    }

    const attemptNumber = session.attemptsCount + 1;
    const feedback = evaluateGuess(guessedPlayer, session.targetPlayer, attemptNumber);

    const isCorrect = feedback.isCorrect;
    const isCompleted = isCorrect || attemptNumber >= session.maxAttempts;

    // Record guess in database
    await prisma.gameGuess.create({
      data: {
        sessionId: session.id,
        attemptNumber,
        guessedPlayerId,
        targetPlayerId: session.targetPlayerId,
        isCorrect,
        guessFeedbackJson: JSON.stringify(feedback),
      },
    });

    // Update Session
    await prisma.gameSession.update({
      where: { id: session.id },
      data: {
        attemptsCount: attemptNumber,
        isCompleted,
        isWon: isCorrect,
        score: isCorrect ? (session.maxAttempts - attemptNumber + 1) * 100 : 0,
      },
    });

    // Generate unlocked clues
    const unlockedClues = generateCluesForAttempt(session.targetPlayer, attemptNumber);

    return NextResponse.json({
      feedback,
      attemptsCount: attemptNumber,
      isCompleted,
      isWon: isCorrect,
      unlockedClues,
      // Target player details are only returned when completed
      targetPlayer: isCompleted
        ? {
            id: session.targetPlayer.id,
            displayName: session.targetPlayer.displayName,
            fullName: session.targetPlayer.fullName,
            countryCode: session.targetPlayer.countryCode,
            nationality: session.targetPlayer.nationality,
            role: session.targetPlayer.role,
            playingEra: session.targetPlayer.playingEra,
            careerSpan: session.targetPlayer.careerSpan,
            profileImage: session.targetPlayer.profileImage,
          }
        : undefined,
    });
  } catch (error) {
    console.error('API Error /api/games/guess:', error);
    return NextResponse.json({ error: 'Guess evaluation failed' }, { status: 500 });
  }
}
