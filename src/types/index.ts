// ==================== 基础类型 ====================

// 性别
export type Gender = 'female' | 'male';

// 角色类型
export type RoleType = 
  | 'girlfriend' 
  | 'boyfriend' 
  | 'bestie' 
  | 'brother' 
  | 'boss' 
  | 'parent' 
  | 'child'
  | 'custom';

// 性格标签
export type PersonalityTag = 
  | '温柔' | '傲娇' | '粘人' | '敏感' 
  | '沉稳' | '直男' | '霸道' 
  | '毒舌' | '护短' | '直率' 
  | '豪爽' | '义气' | '闷骚' | '幽默'
  | '严厉' | '挑剔' | '公正' 
  | '唠叨' | '操心' | '传统' | '开明'
  | '叛逆' | '乖巧' | '任性' | '懂事';

// ==================== 角色相关 ====================

// 角色
export interface Role {
  id: string;
  type: RoleType;
  name: string;
  gender: Gender;
  personalityTags: PersonalityTag[];
  description?: string;        // 用户自定义描述
  avatarEmoji: string;         // 头像 emoji
  isPreset: boolean;           // 是否预设角色
}

// 场景
export interface Scenario {
  id: string;
  roleId: string;
  title: string;
  description: string;
}

// ==================== 对话相关 ====================

// 消息
export interface Message {
  id: string;
  role: 'user' | 'partner';
  content: string;
  timestamp: number;
  scoreChange?: number;        // 好感度变化值
  triggeredRules?: string[];   // 触发的规则
}

// 规则触发记录
export interface RuleTrigger {
  ruleName: string;
  ruleType: 'positive' | 'negative';
  scoreChange: number;
  userMessage: string;
  explanation: string;
}

// ==================== 游戏状态 ====================

// 游戏阶段
export type GamePhase = 
  | 'idle'           // 空闲状态
  | 'select-role'    // 选择角色
  | 'select-scenario'// 选择场景
  | 'playing'        // 游戏中
  | 'result';        // 结果页面

// 游戏状态
export interface GameState {
  // 游戏阶段
  phase: GamePhase;
  
  // 游戏配置
  role: Role | null;
  scenario: Scenario | null;
  isNewGame: boolean;          // 是否新游戏（vs 继续上次）
  
  // 游戏进度
  step: number;                // 当前轮次 (1-10)
  affection: number;           // 好感度 (-50 到 100)
  
  // 对话数据
  messages: Message[];         // 对话历史
  ruleTriggers: RuleTrigger[]; // 规则触发记录
  
  // 游戏状态
  gameOver: boolean;           // 游戏是否结束
  won: boolean;                // 是否获胜
  
  // 帮助使用
  helpUsedCount: number;       // 已使用求助次数
  
  // 加载状态
  isLoading: boolean;          // 是否加载中
  error: string | null;        // 错误信息
}

// ==================== 用户相关 ====================

// 用户
export interface User {
  id: string;
  phone: string;
  nickname?: string;
  avatarUrl?: string;
  createdAt: number;
  lastLoginAt: number;
}

// 用户统计数据
export interface UserStats {
  totalGames: number;          // 总对话次数
  totalWins: number;           // 总成功次数
  fastestWin: number;          // 最快成功轮数
  totalHelpUsed: number;       // 总求助次数
  
  // 各角色战绩
  roleStats: Record<string, {
    games: number;
    wins: number;
    fastestWin: number;
  }>;
  
  // 徽章
  badges: string[];
}

// 历史对话记录
export interface GameHistory {
  id: string;
  userId: string;
  role: Role;
  scenario: Scenario;
  messages: Message[];
  ruleTriggers: RuleTrigger[];
  won: boolean;
  finalAffection: number;
  steps: number;
  createdAt: number;
}

// ==================== API 相关 ====================

// 对话请求
export interface ChatRequest {
  role: Role;
  scenario: Scenario;
  messages: Message[];
  affection: number;
  step: number;
  userMessage: string;
}

// 对话响应
export interface ChatResponse {
  partnerMessage: string;
  scoreChange: number;
  triggeredRules: RuleTrigger[];
  emotionState: string;
}

// 求助请求
export interface HelpRequest {
  role: Role;
  scenario: Scenario;
  messages: Message[];
  affection: number;
}

// 求助响应
export interface HelpResponse {
  suggestion: string;
  explanation: string;
}

// ==================== 常量 ====================

export const INITIAL_AFFECTION = 20;
export const MAX_AFFECTION = 100;
export const MIN_AFFECTION = -50;
export const WIN_AFFECTION = 80;
export const MAX_ROUNDS = 10;
export const MAX_HELP_PER_GAME = 3;

// ==================== 工具函数 ====================

// 生成唯一ID
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// 检查游戏结束
export const checkGameEnd = (affection: number, step: number): { gameOver: boolean; won: boolean } => {
  if (affection >= WIN_AFFECTION) {
    return { gameOver: true, won: true };
  }
  if (affection <= MIN_AFFECTION || step > MAX_ROUNDS) {
    return { gameOver: true, won: false };
  }
  return { gameOver: false, won: false };
};

// 计算好感度（带边界）
export const calculateAffection = (current: number, change: number): number => {
  return Math.max(MIN_AFFECTION, Math.min(MAX_AFFECTION, current + change));
};

// 获取情绪状态
export const getEmotionState = (affection: number): { label: string; color: string } => {
  if (affection <= 0) {
    return { label: '非常生气', color: 'red' };
  }
  if (affection <= 30) {
    return { label: '还在生气', color: 'orange' };
  }
  if (affection <= 60) {
    return { label: '开始软化', color: 'yellow' };
  }
  if (affection < 80) {
    return { label: '快被哄好', color: 'blue' };
  }
  return { label: '原谅你了', color: 'green' };
};
