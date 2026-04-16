import { NextRequest, NextResponse } from 'next/server';
import { Role, Scenario } from '@/types';
import { buildOpeningPrompt } from '@/lib/prompts';
import { LLMClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { role, scenario } = body as { role: Role; scenario: Scenario };

    // 验证必要参数
    if (!role || !scenario) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // 构建开场白提示词
    const openingPrompt = buildOpeningPrompt(role, scenario);

    // 初始化 LLM 客户端
    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);
    const config = new Config();
    const client = new LLMClient(config, customHeaders);

    // 调用 LLM 生成开场白
    let openingMessage: string;

    try {
      const response = await client.invoke([
        { role: 'user', content: openingPrompt },
      ], {
        model: 'doubao-seed-1-6-250415',
        temperature: 0.9,
      });

      openingMessage = response.content || getDefaultOpening(role);
    } catch (error) {
      console.error('LLM 调用失败:', error);
      openingMessage = getDefaultOpening(role);
    }

    return NextResponse.json({ openingMessage });
  } catch (error) {
    console.error('Opening API 错误:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}

// 获取默认开场白
function getDefaultOpening(role: { name: string; personalityTags: string[] }): string {
  const openings: Record<string, string[]> = {
    girlfriend: [
      '(生气地看着你) 你知道今天是什么日子吗？',
      '(冷着脸) 你终于想起来回消息了？',
      '(眼眶红红的) 你还留着这个干嘛？',
    ],
    boyfriend: [
      '(没抬头) 打完了？',
      '(皱眉) 你问这个干嘛？',
      '(冷淡) 嗯。',
    ],
    bestie: [
      '(摔东西) 你居然这么说我！',
      '(拉黑你) 我们没什么好说的。',
      '(冷笑) 谢谢你的"帮忙"。',
    ],
    brother: [
      '(拍桌子) 兄弟，你是不是忘了什么？',
      '(冷脸) 说好的事呢？',
      '(失望) 我真看错你了。',
    ],
    boss: [
      '(严肃) 这就是你的工作态度？',
      '(皱眉) 你知道这造成多大损失吗？',
      '(冷淡) 我在等你解释。',
    ],
    parent: [
      '(担心) 你到底去哪了？知道我们多担心吗？',
      '(失望) 我们不是教过你要诚实吗？',
      '(叹气) 你知道赚钱多不容易吗？',
    ],
    child: [
      '(低头不说话) ...',
      '(摔门进房间) 别管我！',
      '(委屈) 别人都买...',
    ],
  };

  const pool = openings[role.name] || openings.girlfriend;
  return pool[Math.floor(Math.random() * pool.length)];
}
