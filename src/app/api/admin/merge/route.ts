import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { primaryPlayerId, duplicatePlayerId } = await request.json();

    if (!primaryPlayerId || !duplicatePlayerId) {
      return NextResponse.json({ error: 'Missing primaryPlayerId or duplicatePlayerId' }, { status: 400 });
    }

    const primaryPlayer = await prisma.player.findUnique({ where: { id: primaryPlayerId } });
    const duplicatePlayer = await prisma.player.findUnique({ where: { id: duplicatePlayerId } });

    if (!primaryPlayer || !duplicatePlayer) {
      return NextResponse.json({ error: 'Player record not found' }, { status: 404 });
    }

    // 1. Move aliases from duplicate to primary
    await prisma.playerAlias.updateMany({
      where: { playerId: duplicatePlayerId },
      data: { playerId: primaryPlayerId },
    });

    // 2. Add duplicate's displayName as a new alias on primary
    await prisma.playerAlias.create({
      data: {
        playerId: primaryPlayerId,
        alias: duplicatePlayer.displayName,
        type: 'MERGED_RECORD',
      },
    });

    // 3. Move external identifiers
    await prisma.playerIdentifier.updateMany({
      where: { playerId: duplicatePlayerId },
      data: { playerId: primaryPlayerId },
    });

    // 4. Record Audit Log
    await prisma.auditLog.create({
      data: {
        action: 'PLAYER_MERGE',
        entityType: 'PLAYER',
        entityId: primaryPlayerId,
        details: `Merged duplicate player ${duplicatePlayer.displayName} (${duplicatePlayerId}) into ${primaryPlayer.displayName} (${primaryPlayerId})`,
        performedBy: 'ADMIN',
      },
    });

    // 5. Delete duplicate record safely
    await prisma.player.delete({ where: { id: duplicatePlayerId } });

    return NextResponse.json({
      success: true,
      message: `Successfully merged '${duplicatePlayer.displayName}' into '${primaryPlayer.displayName}'`,
    });
  } catch (error) {
    console.error('API Error /api/admin/merge:', error);
    return NextResponse.json({ error: 'Merge operation failed' }, { status: 500 });
  }
}
