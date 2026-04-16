import { RuleTrigger } from '@/types';

// 加分规则
export const positiveRules = [
  {
    name: '真诚道歉',
    keywords: ['对不起', '抱歉', '我错了', '是我的错', '怪我', '我不该'],
    scoreRange: [5, 15] as [number, number],
    explanation: '真诚道歉能让对方感受到你的诚意',
  },
  {
    name: '具体弥补方案',
    keywords: ['我给你买', '我补偿你', '下次我一定', '我会改', '我保证'],
    scoreRange: [8, 20] as [number, number],
    explanation: '提出具体的弥补方案比空口承诺更有说服力',
  },
  {
    name: '提起共同回忆',
    keywords: ['还记得我们', '记得那次', '我们曾经', '一起的时候'],
    scoreRange: [6, 12] as [number, number],
    explanation: '提起共同回忆能唤起对方美好的记忆',
  },
  {
    name: '表达理解',
    keywords: ['我理解你', '我知道你', '换做是我', '你一定很', '你的感受'],
    scoreRange: [5, 10] as [number, number],
    explanation: '表达理解能让对方感受到被接纳',
  },
  {
    name: '承担责任',
    keywords: ['都是我', '完全是我的问题', '我不应该', '是我不对'],
    scoreRange: [5, 10] as [number, number],
    explanation: '主动承担责任展现成熟态度',
  },
  {
    name: '情感表达',
    keywords: ['我很在乎你', '我爱你', '你很重要', '舍不得你', '不想失去你'],
    scoreRange: [5, 8] as [number, number],
    explanation: '真诚的情感表达能打动人心',
  },
  {
    name: '耐心解释',
    keywords: ['让我解释', '其实是这样', '事情是这样的', '听我说'],
    scoreRange: [3, 8] as [number, number],
    explanation: '耐心解释有助于消除误会',
  },
  {
    name: '主动示弱',
    keywords: ['我错了', '我不对', '是我不好', '都是我的错'],
    scoreRange: [5, 10] as [number, number],
    explanation: '适当的示弱能让对方心软',
  },
];

// 减分规则
export const negativeRules = [
  {
    name: '敷衍应付',
    keywords: ['行行行', '好好好', '知道了', '随便', '嗯嗯', '哦'],
    scoreRange: [-15, -8] as [number, number],
    explanation: '敷衍的态度会让对方更加生气',
  },
  {
    name: '推卸责任',
    keywords: ['是你自己', '又怪我', '关我什么事', '又不是我', '凭什么怪我'],
    scoreRange: [-25, -15] as [number, number],
    explanation: '推卸责任只会激化矛盾',
  },
  {
    name: '转移话题',
    keywords: ['那你还记得', '上次你', '你以前不也', '说到这个'],
    scoreRange: [-18, -10] as [number, number],
    explanation: '转移话题是在逃避问题',
  },
  {
    name: '找借口',
    keywords: ['我当时在忙', '我没看到', '我不知道', '又没人告诉我'],
    scoreRange: [-12, -8] as [number, number],
    explanation: '找借口比承认错误更让人反感',
  },
  {
    name: '冷漠回应',
    keywords: ['随便吧', '无所谓', '你想怎样', '你爱怎么想怎么想', '懒得说'],
    scoreRange: [-30, -20] as [number, number],
    explanation: '冷漠回应会严重伤害对方感情',
  },
  {
    name: '反过来指责',
    keywords: ['你自己不也', '你有问题', '你凭什么', '你有什么资格'],
    scoreRange: [-25, -18] as [number, number],
    explanation: '反过来指责会让情况更糟',
  },
  {
    name: '不耐烦',
    keywords: ['烦不烦', '够了没有', '有完没完', '别说了', '行了'],
    scoreRange: [-20, -12] as [number, number],
    explanation: '不耐烦的态度会火上浇油',
  },
  {
    name: '质疑对方',
    keywords: ['你是不是', '你怎么这样', '你有病吧', '你神经病'],
    scoreRange: [-25, -18] as [number, number],
    explanation: '质疑和攻击对方是不可接受的',
  },
];

// 分析用户消息，返回规则触发结果
export const analyzeUserMessage = (message: string): { 
  scoreChange: number; 
  triggeredRules: RuleTrigger[];
} => {
  const triggeredRules: RuleTrigger[] = [];
  let totalScore = 0;

  // 检查加分规则
  for (const rule of positiveRules) {
    for (const keyword of rule.keywords) {
      if (message.includes(keyword)) {
        const score = Math.floor(
          Math.random() * (rule.scoreRange[1] - rule.scoreRange[0] + 1) + rule.scoreRange[0]
        );
        totalScore += score;
        triggeredRules.push({
          ruleName: rule.name,
          ruleType: 'positive',
          scoreChange: score,
          userMessage: message,
          explanation: rule.explanation,
        });
        break; // 每个规则只触发一次
      }
    }
  }

  // 检查减分规则
  for (const rule of negativeRules) {
    for (const keyword of rule.keywords) {
      if (message.includes(keyword)) {
        const score = Math.floor(
          Math.random() * (rule.scoreRange[1] - rule.scoreRange[0] + 1) + rule.scoreRange[0]
        );
        totalScore += score;
        triggeredRules.push({
          ruleName: rule.name,
          ruleType: 'negative',
          scoreChange: score,
          userMessage: message,
          explanation: rule.explanation,
        });
        break; // 每个规则只触发一次
      }
    }
  }

  // 如果没有触发任何规则，给一个基础分
  if (triggeredRules.length === 0) {
    const baseScore = Math.floor(Math.random() * 7) - 3; // -3 到 +3
    totalScore = baseScore;
  }

  return { scoreChange: totalScore, triggeredRules };
};

// 获取所有规则（用于"哄人技巧"页面）
export const getAllRules = () => {
  return {
    positive: positiveRules.map(r => ({
      name: r.name,
      scoreRange: r.scoreRange,
      explanation: r.explanation,
      examples: r.keywords.slice(0, 3),
    })),
    negative: negativeRules.map(r => ({
      name: r.name,
      scoreRange: r.scoreRange,
      explanation: r.explanation,
      examples: r.keywords.slice(0, 3),
    })),
  };
};
