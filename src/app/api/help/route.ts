import { NextRequest, NextResponse } from 'next/server';
import { HelpRequest, HelpResponse } from '@/types';
import { buildHelpPrompt, parseHelpResponse } from '@/lib/prompts';
import { LLMClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const body: HelpRequest = await request.json();
    const { role, scenario, messages, affection } = body;

    // 验证必要参数
    if (!role || !scenario) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // 构建帮助提示词
    const helpPrompt = buildHelpPrompt(role, scenario, messages, affection);

    // 初始化 LLM 客户端
    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);
    const config = new Config();
    const client = new LLMClient(config, customHeaders);

    // 调用 LLM 获取建议
    let response: HelpResponse;

    try {
      const llmResponse = await client.invoke([
        { role: 'user', content: helpPrompt },
      ], {
        model: 'doubao-seed-1-6-250415',
        temperature: 0.7,
      });

      const content = llmResponse.content || '';
      response = parseHelpResponse(content);
    } catch (error) {
      console.error('LLM 调用失败:', error);
      // 返回默认建议
      response = {
        suggestion: '试着真诚地道歉，表达你理解对方的感受，并提出具体的弥补方案。',
        explanation: '真诚的态度和具体的行动比空口承诺更有说服力。',
      };
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Help API 错误:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
