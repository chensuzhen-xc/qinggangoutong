import { NextRequest, NextResponse } from 'next/server';
import { LLMClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';

// 文章生成提示词
const articlePrompts: Record<string, string> = {
  'first-date-communication': `请为"第一次约会如何沟通"这个主题写一篇300-500字的恋爱攻略文章。

要求：
1. 风格轻松幽默，像朋友聊天
2. 内容实用，给出具体建议
3. 可以用emoji增加趣味性
4. 包含几个小技巧或注意事项
5. 结尾可以加一句鼓励的话

请直接输出文章内容，不要加标题（标题已经生成好了），直接写正文内容即可。`,

  'relationship-taboos': `请为"谈恋爱时禁忌有哪些"这个主题写一篇300-500字的恋爱攻略文章。

要求：
1. 风格轻松幽默，像朋友聊天
2. 列举几个常见的禁忌行为
3. 解释为什么这些行为会伤害感情
4. 给出正确的做法建议
5. 可以用emoji增加趣味性

请直接输出文章内容，不要加标题（标题已经生成好了），直接写正文内容即可。`,

  'how-to-apologize': `请为"道歉的正确打开方式"这个主题写一篇300-500字的恋爱攻略文章。

要求：
1. 风格轻松幽默，像朋友聊天
2. 区分什么是正确/错误的道歉方式
3. 给出具体的话术示例
4. 解释道歉的心理学原理
5. 可以用emoji增加趣味性

请直接输出文章内容，不要加标题（标题已经生成好了），直接写正文内容即可。`,
};

export async function POST(request: NextRequest) {
  try {
    const { slug } = await request.json();

    if (!slug || !articlePrompts[slug]) {
      return NextResponse.json(
        { error: '文章不存在' },
        { status: 404 }
      );
    }

    // 初始化 LLM 客户端
    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);
    const config = new Config();
    const client = new LLMClient(config, customHeaders);

    // 生成文章
    const content = await client.invoke([
      { role: 'user', content: articlePrompts[slug] },
    ], {
      model: 'doubao-seed-1-6-250415',
      temperature: 0.8,
    });

    return NextResponse.json({
      content: content.content || '文章生成失败，请稍后重试。',
    });
  } catch (error) {
    console.error('文章生成失败:', error);
    return NextResponse.json(
      { error: '生成失败' },
      { status: 500 }
    );
  }
}
