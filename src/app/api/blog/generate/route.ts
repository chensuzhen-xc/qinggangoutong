import { NextRequest, NextResponse } from 'next/server';
import { LLMClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';
import { createPost } from '@/lib/blog';

// 文章主题列表（轮流使用）
const articleTopics = [
  {
    title: '如何度过恋爱冷淡期',
    summary: '热恋期过后，感情变得平淡怎么办？这篇文章教你如何重新点燃激情！',
    prompt: `请为"如何度过恋爱冷淡期"这个主题写一篇300-500字的恋爱攻略文章。

要求：
1. 风格轻松幽默，像朋友聊天
2. 解释为什么会有冷淡期
3. 给出具体的应对方法
4. 可以用emoji增加趣味性
5. 结尾可以加一句鼓励的话

请直接输出文章内容，格式如下：
【标题】文章标题
【摘要】一句话摘要
---
正文内容（300-500字）`,
  },
  {
    title: '吵架后如何和好',
    summary: '情侣吵架在所难免，但和好的方式决定了感情的走向。快来学习正确的和好姿势！',
    prompt: `请为"吵架后如何和好"这个主题写一篇300-500字的恋爱攻略文章。

要求：
1. 风格轻松幽默，像朋友聊天
2. 先冷静还是先道歉？如何判断
3. 给出具体的和好话术
4. 避免哪些和好雷区
5. 可以用emoji增加趣味性

请直接输出文章内容，格式如下：
【标题】文章标题
【摘要】一句话摘要
---
正文内容（300-500字）`,
  },
  {
    title: '异地恋如何维护感情',
    summary: '距离不是问题，心在一起才是关键。异地恋保鲜秘籍都在这里！',
    prompt: `请为"异地恋如何维护感情"这个主题写一篇300-500字的恋爱攻略文章。

要求：
1. 风格轻松幽默，像朋友聊天
2. 给出实用的异地恋沟通技巧
3. 如何建立信任和安全感
4. 见面时可以做哪些事增加仪式感
5. 可以用emoji增加趣味性

请直接输出文章内容，格式如下：
【标题】文章标题
【摘要】一句话摘要
---
正文内容（300-500字）`,
  },
  {
    title: '如何判断TA是否真的喜欢你',
    summary: '暧昧期最纠结的问题：他到底是喜欢你还是只是礼貌？这几个信号告诉你答案！',
    prompt: `请为"如何判断TA是否真的喜欢你"这个主题写一篇300-500字的恋爱攻略文章。

要求：
1. 风格轻松幽默，像朋友聊天
2. 列举几个关键判断信号
3. 避免只看表面的行为
4. 鼓励读者勇敢但不卑微
5. 可以用emoji增加趣味性

请直接输出文章内容，格式如下：
【标题】文章标题
【摘要】一句话摘要
---
正文内容（300-500字）`,
  },
  {
    title: '情人节礼物清单',
    summary: '还在为送什么礼物发愁？根据不同类型另一半准备的礼物清单来啦！',
    prompt: `请为"情人节礼物清单"这个主题写一篇300-500字的恋爱攻略文章。

要求：
1. 风格轻松幽默，像朋友聊天
2. 按不同类型分类（实用型、浪漫型、创意型等）
3. 给出具体礼物建议
4. 提醒一些送礼雷区
5. 可以用emoji增加趣味性

请直接输出文章内容，格式如下：
【标题】文章标题
【摘要】一句话摘要
---
正文内容（300-500字）`,
  },
];

export async function POST(request: NextRequest) {
  try {
    // 随机选择一个主题
    const topic = articleTopics[Math.floor(Math.random() * articleTopics.length)];

    // 初始化 LLM 客户端（使用正确的 header 提取）
    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);
    const config = new Config();
    const client = new LLMClient(config, customHeaders);

    // 调用 LLM 生成文章（使用 doubao-seed-2-0-lite）
    const response = await client.invoke([
      { role: 'user', content: topic.prompt },
    ], {
      model: 'doubao-seed-2-0-lite-260215',
      temperature: 0.8,
    });

    const content = response.content || '';

    // 解析 LLM 返回的内容
    let title = topic.title;
    let summary = topic.summary;
    let articleContent = content;

    // 尝试从内容中提取标题和摘要
    const titleMatch = content.match(/【标题】(.+)/);
    const summaryMatch = content.match(/【摘要】(.+)/);
    const separatorIndex = content.indexOf('---');

    if (titleMatch) {
      title = titleMatch[1].trim();
    }
    if (summaryMatch) {
      summary = summaryMatch[1].trim();
    }
    if (separatorIndex > 0) {
      articleContent = content.substring(separatorIndex + 3).trim();
    }

    // ✅ 修复：添加了 author_id，部署必备！
    const post = await createPost({
      title,
      summary,
      content: articleContent,
      author_id: "system",
    });

    return NextResponse.json({
      success: true,
      message: '文章生成成功',
      article: {
        id: post.id,
        title: post.title,
        summary: post.summary,
      },
    });
  } catch (error) {
    console.error('生成文章失败:', error);
    return NextResponse.json(
      { error: '生成文章失败' },
      { status: 500 }
    );
  }
}
