import { readDB, writeDB } from './simpleStorage';

interface GameRecord {
  id: number;
  user_id: number;
  scenario: string;
  final_score: number;
  result: 'win' | 'lose';
  played_at: string;
}

export async function createGameRecord(record: Omit<GameRecord, 'id'>): Promise<GameRecord> {
  const db = readDB();
  
  const newRecord: GameRecord = {
    ...record,
    id: db.game_records.length + 1,
  };
  
  db.game_records.push(newRecord);
  writeDB(db);
  
  return newRecord;
}

export async function getUserGameRecords(userId: number): Promise<GameRecord[]> {
  const db = readDB();
  const records = [];
  for (let i = 0; i < db.game_records.length; i = i + 1) {
    if (db.game_records[i].user_id === userId) {
      records.push(db.game_records[i]);
    }
  }
  records.sort(function(a, b) {
    return new Date(b.played_at).getTime() - new Date(a.played_at).getTime();
  });
  return records;
}

export async function getRecentGameRecords(limit: number = 10): Promise<GameRecord[]> {
  const db = readDB();
  const records = db.game_records.slice();
  records.sort(function(a, b) {
    return new Date(b.played_at).getTime() - new Date(a.played_at).getTime();
  });
  return records.slice(0, limit);
}
