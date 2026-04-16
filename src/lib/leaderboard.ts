import { readDB, writeDB } from './simpleStorage';

interface LeaderboardEntry {
  id: number;
  user_id: number;
  username: string;
  best_score: number;
  achieved_at: string;
  updated_at: string;
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const db = readDB();
  const leaderboard = db.leaderboard.slice();
  leaderboard.sort(function(a, b) {
    return b.best_score - a.best_score;
  });
  return leaderboard;
}

export async function updateLeaderboard(
  userId: number,
  username: string,
  score: number
): Promise<LeaderboardEntry> {
  const db = readDB();
  const now = new Date().toISOString();
  
  let existingEntry: LeaderboardEntry | null = null;
  for (let i = 0; i < db.leaderboard.length; i = i + 1) {
    if (db.leaderboard[i].user_id === userId) {
      existingEntry = db.leaderboard[i];
      break;
    }
  }
  
  if (existingEntry) {
    if (score > existingEntry.best_score) {
      existingEntry.best_score = score;
      existingEntry.achieved_at = now;
      existingEntry.updated_at = now;
    } else {
      existingEntry.updated_at = now;
    }
    writeDB(db);
    return existingEntry;
  } else {
    const newEntry: LeaderboardEntry = {
      id: db.leaderboard.length + 1,
      user_id: userId,
      username: username,
      best_score: score,
      achieved_at: now,
      updated_at: now,
    };
    
    db.leaderboard.push(newEntry);
    writeDB(db);
    return newEntry;
  }
}

export async function getUserRank(userId: number): Promise<number | null> {
  const db = readDB();
  const sortedLeaderboard = db.leaderboard.slice();
  sortedLeaderboard.sort(function(a, b) {
    return b.best_score - a.best_score;
  });
  
  for (let i = 0; i < sortedLeaderboard.length; i = i + 1) {
    if (sortedLeaderboard[i].user_id === userId) {
      return i + 1;
    }
  }
  
  return null;
}
