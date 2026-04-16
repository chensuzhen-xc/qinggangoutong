import { NextRequest, NextResponse } from 'next/server';
import { updateLeaderboard } from '@/lib/leaderboard';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, username, score } = body;

    // 验证参数
    if (!user_id || !username || score === undefined) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // 更新排行榜
    const result = await updateLeaderboard(user_id, username, score);

    return NextResponse.json({
      success: true,
      entry: result,
    });
  } catch (error) {
    console.error('更新排行榜失败:', error);
    return NextResponse.json(
      { error: '更新排行榜失败' },
      { status: 500 }
    );
  }
}
