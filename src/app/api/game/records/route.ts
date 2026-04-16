import { NextRequest, NextResponse } from 'next/server';
import { getUserGameRecords, getUserGameStats } from '@/lib/gameRecord';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json(
        { error: '缺少 user_id 参数' },
        { status: 400 }
      );
    }

    const id = parseInt(userId, 10);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: '无效的 user_id' },
        { status: 400 }
      );
    }

    // 并行获取记录和统计
    const [records, stats] = await Promise.all([
      getUserGameRecords(id),
      getUserGameStats(id),
    ]);

    return NextResponse.json({
      records,
      stats,
    });
  } catch (error) {
    console.error('获取游戏记录失败:', error);
    return NextResponse.json(
      { error: '获取游戏记录失败' },
      { status: 500 }
    );
  }
}
