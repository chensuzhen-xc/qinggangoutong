import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/user';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // 验证参数
    if (!username || !password) {
      return NextResponse.json(
        { error: '用户名和密码不能为空' },
        { status: 400 }
      );
    }

    // 验证用户名长度
    if (username.length < 3 || username.length > 20) {
      return NextResponse.json(
        { error: '用户名长度需要在3-20个字符之间' },
        { status: 400 }
      );
    }

    // 验证密码长度
    if (password.length < 6 || password.length > 20) {
      return NextResponse.json(
        { error: '密码长度需要在6-20个字符之间' },
        { status: 400 }
      );
    }

    // 创建用户
    const user = await createUser(username, password);

    return NextResponse.json({
      success: true,
      message: '注册成功',
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '注册失败';
    console.error('注册失败:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    );
  }
}
