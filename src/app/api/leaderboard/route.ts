import { NextRequest, NextResponse } from 'next/server';
import { getLeaderboard, getUserRank } from '@/lib/leaderboard';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    // 获取排行榜
    const entries = await getLeaderboard();

    // 如果提供了 user_id，获取用户的排名
    let userRanking: number | null = null;
    if (userId) {
      userRanking = await getUserRank(parseInt(userId, 10));
    }

    return NextResponse.json({
      entries,
      userRanking,
    });
  } catch (error) {
    console.error('获取排行榜失败:', error);
    return NextResponse.json(
      { error: '获取排行榜失败' },
      { status: 500 }
    );
  }
}
