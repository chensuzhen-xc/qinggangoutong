import { NextRequest, NextResponse } from 'next/server';
import { createGameRecord } from '@/lib/gameRecord';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, scenario, final_score, result } = body;

    // 验证参数
    if (!user_id || !scenario || final_score === undefined || !result) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // 验证 result 值
    if (!['win', 'lose'].includes(result)) {
      return NextResponse.json(
        { error: '结果只能是 win 或 lose' },
        { status: 400 }
      );
    }

    // 创建游戏记录
    const record = await createGameRecord({
      user_id,
      scenario,
      final_score,
      result,
    });

    return NextResponse.json({
      success: true,
      message: '游戏记录保存成功',
      record: {
        id: record.id,
        scenario: record.scenario,
        result: record.result,
      },
    });
  } catch (error) {
    console.error('保存游戏记录失败:', error);
    return NextResponse.json(
      { error: '保存游戏记录失败' },
      { status: 500 }
    );
  }
}
