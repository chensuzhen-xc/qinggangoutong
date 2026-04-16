import { NextRequest, NextResponse } from 'next/server';
import { ChatRequest, ChatResponse, RuleTrigger } from '@/types';
import { analyzeUserMessage } from '@/lib/rules';
import { buildSystemPrompt, buildChatHistory } from '@/lib/prompts';
import { LLMClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { role, scenario, messages, affection, step, userMessage } = body;

    // 验证必要参数
    if (!role || !scenario) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // 分析用户消息，获取分数变化
    const { scoreChange, triggeredRules } = analyzeUserMessage(userMessage);

    // 构建系统提示词
    const systemPrompt = buildSystemPrompt(role, scenario, affection);

    // 构建对话历史
    const chatHistory = buildChatHistory(messages);

    // 初始化 LLM 客户端
    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);
    const config = new Config();
    const client = new LLMClient(config, customHeaders);

    // 调用 LLM 生成回复
    let partnerMessage: string;

    try {
      const response = await client.invoke([
        { role: 'system', content: systemPrompt },
        ...chatHistory,
        { role: 'user', content: userMessage },
      ], {
        model: 'doubao-seed-1-6-250415',
        temperature: 0.8,
      });

      partnerMessage = response.content || getDefaultResponse(affection, role);
    } catch (error) {
      console.error('LLM 调用失败:', error);
      partnerMessage = getDefaultResponse(affection, role);
    }

    // 构建响应
    const chatResponse: ChatResponse = {
      partnerMessage,
      scoreChange,
      triggeredRules,
      emotionState: getEmotionLabel(affection + scoreChange),
    };

    return NextResponse.json(chatResponse);
  } catch (error) {
    console.error('Chat API 错误:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}

// 获取情绪标签
function getEmotionLabel(affection: number): string {
  if (affection <= 0) return '非常生气';
  if (affection <= 30) return '还在生气';
  if (affection <= 60) return '开始软化';
  if (affection < 80) return '快被哄好';
  return '原谅你了';
}

// 获取默认回复（LLM 失败时使用）
function getDefaultResponse(affection: number, role: { name: string; personalityTags: string[] }): string {
  const responses = {
    veryAngry: [
      '哼。',
      '不想理你。',
      '你走开。',
      '(沉默不语)',
      '别跟我说话。',
    ],
    angry: [
      '...你说。',
      '然后呢？',
      '所以呢？',
      '(看你一眼)',
      '继续说。',
    ],
    softening: [
      '...好吧。',
      '(叹气)',
      '你说的倒是挺真诚的。',
      '我听着呢。',
      '(表情稍微缓和)',
    ],
    almostThere: [
      '哼...你说的倒是好听。',
      '(小声) 真的假的...',
      '你保证？',
      '(抿嘴) 算你还有点良心。',
      '下不为例啊...',
    ],
  };

  let pool: string[];
  if (affection <= 0) {
    pool = responses.veryAngry;
  } else if (affection <= 30) {
    pool = responses.angry;
  } else if (affection <= 60) {
    pool = responses.softening;
  } else {
    pool = responses.almostThere;
  }

  return pool[Math.floor(Math.random() * pool.length)];
}
