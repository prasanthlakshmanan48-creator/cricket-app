import { PresenceStatus, PresenceUser } from '@/types/game-extension';

class RealPresenceStore {
  private activeUsers: Map<string, PresenceUser> = new Map();

  /**
   * Register or update a user's presence state
   */
  public registerPresence(socketId: string, username: string, status: PresenceStatus = 'ONLINE', avatar?: string, userId?: string): PresenceUser {
    const existing = this.activeUsers.get(socketId);
    const now = Date.now();
    const user: PresenceUser = {
      socketId,
      userId: userId || existing?.userId,
      username,
      avatar: avatar || existing?.avatar || '🏏',
      status,
      joinedAt: existing?.joinedAt || now,
      lastActiveAt: now,
    };
    this.activeUsers.set(socketId, user);
    return user;
  }

  /**
   * Update status of a connected user
   */
  public updateStatus(socketId: string, status: PresenceStatus): void {
    const user = this.activeUsers.get(socketId);
    if (user) {
      user.status = status;
      user.lastActiveAt = Date.now();
      this.activeUsers.set(socketId, user);
    }
  }

  /**
   * Remove disconnected user
   */
  public removeUser(socketId: string): void {
    this.activeUsers.delete(socketId);
  }

  /**
   * Clean stale sessions inactive for > 60 seconds
   */
  public cleanupStale(): void {
    const now = Date.now();
    for (const [socketId, user] of this.activeUsers.entries()) {
      if (now - user.lastActiveAt > 60000) {
        this.activeUsers.delete(socketId);
      }
    }
  }

  /**
   * Get total real connected online users count
   */
  public getOnlineCount(): number {
    this.cleanupStale();
    return this.activeUsers.size;
  }

  /**
   * Get users currently searching for stranger matchmaking
   */
  public getSearchingUsers(): PresenceUser[] {
    this.cleanupStale();
    return Array.from(this.activeUsers.values()).filter((u) => u.status === 'SEARCHING');
  }

  /**
   * Get searching user count
   */
  public getSearchingCount(): number {
    return this.getSearchingUsers().length;
  }

  /**
   * Return real summary statistics without artificial padding
   */
  public getPresenceStats(): { onlineCount: number; searchingCount: number; inGameCount: number } {
    this.cleanupStale();
    let onlineCount = 0;
    let searchingCount = 0;
    let inGameCount = 0;

    for (const user of this.activeUsers.values()) {
      onlineCount++;
      if (user.status === 'SEARCHING') searchingCount++;
      if (user.status === 'IN_GAME') inGameCount++;
    }

    return { onlineCount, searchingCount, inGameCount };
  }
}

// Global Singleton Store Instance
export const realPresenceStore = new RealPresenceStore();
