'use client';

import React, { createContext, useContext, useReducer, useCallback, useRef } from 'react';
import {
  GameState,
  GamePhase,
  Role,
  Scenario,
  Message,
  RuleTrigger,
  generateId,
  checkGameEnd,
  calculateAffection,
  INITIAL_AFFECTION,
  MAX_HELP_PER_GAME,
} from '@/types';

// 初始状态
const initialState: GameState = {
  phase: 'idle',
  role: null,
  scenario: null,
  isNewGame: true,
  step: 0,
  affection: INITIAL_AFFECTION,
  messages: [],
  ruleTriggers: [],
  gameOver: false,
  won: false,
  helpUsedCount: 0,
  isLoading: false,
  error: null,
};

// Action 类型
type GameAction =
  | { type: 'SET_PHASE'; payload: GamePhase }
  | { type: 'SET_ROLE'; payload: Role }
  | { type: 'SET_SCENARIO'; payload: Scenario }
  | { type: 'SET_NEW_GAME'; payload: boolean }
  | { type: 'START_GAME' }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'UPDATE_AFFECTION'; payload: number }
  | { type: 'ADD_RULE_TRIGGER'; payload: RuleTrigger[] }
  | { type: 'INCREMENT_STEP' }
  | { type: 'SET_GAME_OVER'; payload: { won: boolean } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'INCREMENT_HELP' }
  | { type: 'RESET_GAME' }
  | { type: 'LOAD_HISTORY'; payload: { messages: Message[]; affection: number; step: number; ruleTriggers: RuleTrigger[] } };

// Reducer
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_PHASE':
      return { ...state, phase: action.payload };
    
    case 'SET_ROLE':
      return { ...state, role: action.payload };
    
    case 'SET_SCENARIO':
      return { ...state, scenario: action.payload };
    
    case 'SET_NEW_GAME':
      return { ...state, isNewGame: action.payload };
    
    case 'START_GAME':
      return {
        ...state,
        phase: 'playing',
        step: 1,
        affection: INITIAL_AFFECTION,
        messages: [],
        ruleTriggers: [],
        gameOver: false,
        won: false,
        helpUsedCount: 0,
        error: null,
      };
    
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    
    case 'UPDATE_AFFECTION':
      return {
        ...state,
        affection: calculateAffection(state.affection, action.payload),
      };
    
    case 'ADD_RULE_TRIGGER':
      return {
        ...state,
        ruleTriggers: [...state.ruleTriggers, ...action.payload],
      };
    
    case 'INCREMENT_STEP':
      return { ...state, step: state.step + 1 };
    
    case 'SET_GAME_OVER':
      return {
        ...state,
        gameOver: true,
        won: action.payload.won,
        phase: 'result',
      };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'INCREMENT_HELP':
      return { ...state, helpUsedCount: state.helpUsedCount + 1 };
    
    case 'RESET_GAME':
      return {
        ...initialState,
        phase: 'select-role',
      };
    
    case 'LOAD_HISTORY':
      return {
        ...state,
        messages: action.payload.messages,
        affection: action.payload.affection,
        step: action.payload.step,
        ruleTriggers: action.payload.ruleTriggers,
      };
    
    default:
      return state;
  }
}

// Context 类型
interface GameContextType {
  state: GameState;
  
  // 游戏流程控制
  setPhase: (phase: GamePhase) => void;
  setRole: (role: Role) => void;
  setScenario: (scenario: Scenario) => void;
  setIsNewGame: (isNewGame: boolean) => void;
  startGame: () => void;
  resetGame: () => void;
  
  // 对话相关
  sendMessage: (content: string) => Promise<void>;
  addPartnerMessage: (content: string, scoreChange: number, triggeredRules: RuleTrigger[]) => void;
  
  // 帮助相关
  useHelp: () => Promise<string>;
  canUseHelp: () => boolean;
  
  // 加载历史
  loadHistory: (messages: Message[], affection: number, step: number, ruleTriggers: RuleTrigger[]) => void;
}

// 创建 Context
const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider 组件
export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const isGeneratingRef = useRef(false);

  // 设置游戏阶段
  const setPhase = useCallback((phase: GamePhase) => {
    dispatch({ type: 'SET_PHASE', payload: phase });
  }, []);

  // 设置角色
  const setRole = useCallback((role: Role) => {
    dispatch({ type: 'SET_ROLE', payload: role });
    dispatch({ type: 'SET_PHASE', payload: 'select-scenario' });
  }, []);

  // 设置场景
  const setScenario = useCallback((scenario: Scenario) => {
    dispatch({ type: 'SET_SCENARIO', payload: scenario });
  }, []);

  // 设置是否新游戏
  const setIsNewGame = useCallback((isNewGame: boolean) => {
    dispatch({ type: 'SET_NEW_GAME', payload: isNewGame });
  }, []);

  // 开始游戏
  const startGame = useCallback(() => {
    dispatch({ type: 'START_GAME' });
  }, []);

  // 重置游戏
  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, []);

  // 发送消息
  const sendMessage = useCallback(async (content: string) => {
    // 防止重复请求
    if (isGeneratingRef.current || state.isLoading || state.gameOver) {
      return;
    }

    isGeneratingRef.current = true;
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      // 添加用户消息
      const userMessage: Message = {
        id: generateId(),
        role: 'user',
        content,
        timestamp: Date.now(),
      };
      dispatch({ type: 'ADD_MESSAGE', payload: userMessage });

      // 调用 API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: state.role,
          scenario: state.scenario,
          messages: [...state.messages, userMessage],
          affection: state.affection,
          step: state.step,
          userMessage: content,
        }),
      });

      if (!response.ok) {
        throw new Error('网络请求失败');
      }

      const data = await response.json();

      // 添加角色回复
      const partnerMessage: Message = {
        id: generateId(),
        role: 'partner',
        content: data.partnerMessage,
        timestamp: Date.now(),
        scoreChange: data.scoreChange,
        triggeredRules: data.triggeredRules?.map((r: RuleTrigger) => r.ruleName),
      };
      dispatch({ type: 'ADD_MESSAGE', payload: partnerMessage });

      // 更新好感度
      dispatch({ type: 'UPDATE_AFFECTION', payload: data.scoreChange });

      // 添加规则触发记录
      if (data.triggeredRules?.length > 0) {
        dispatch({ type: 'ADD_RULE_TRIGGER', payload: data.triggeredRules });
      }

      // 增加轮次
      dispatch({ type: 'INCREMENT_STEP' });

      // 检查游戏结束
      const newAffection = calculateAffection(state.affection, data.scoreChange);
      const newStep = state.step + 1;
      const { gameOver, won } = checkGameEnd(newAffection, newStep);
      
      if (gameOver) {
        dispatch({ type: 'SET_GAME_OVER', payload: { won } });
      }

    } catch (error) {
      console.error('发送消息失败:', error);
      dispatch({ type: 'SET_ERROR', payload: '发送失败，请重试' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
      isGeneratingRef.current = false;
    }
  }, [state]);

  // 添加角色消息（由外部调用）
  const addPartnerMessage = useCallback((
    content: string,
    scoreChange: number,
    triggeredRules: RuleTrigger[]
  ) => {
    const message: Message = {
      id: generateId(),
      role: 'partner',
      content,
      timestamp: Date.now(),
      scoreChange,
      triggeredRules: triggeredRules.map(r => r.ruleName),
    };
    dispatch({ type: 'ADD_MESSAGE', payload: message });
    dispatch({ type: 'UPDATE_AFFECTION', payload: scoreChange });
    if (triggeredRules.length > 0) {
      dispatch({ type: 'ADD_RULE_TRIGGER', payload: triggeredRules });
    }
  }, []);

  // 使用帮助
  const useHelp = useCallback(async (): Promise<string> => {
    if (state.helpUsedCount >= MAX_HELP_PER_GAME) {
      return '本局求助次数已用完';
    }

    try {
      const response = await fetch('/api/help', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: state.role,
          scenario: state.scenario,
          messages: state.messages,
          affection: state.affection,
        }),
      });

      if (!response.ok) {
        throw new Error('获取帮助失败');
      }

      const data = await response.json();
      dispatch({ type: 'INCREMENT_HELP' });
      return `💡 ${data.suggestion}\n\n📝 ${data.explanation}`;
    } catch (error) {
      console.error('获取帮助失败:', error);
      return '获取帮助失败，请重试';
    }
  }, [state]);

  // 是否可以使用帮助
  const canUseHelp = useCallback(() => {
    return state.helpUsedCount < MAX_HELP_PER_GAME;
  }, [state.helpUsedCount]);

  // 加载历史
  const loadHistory = useCallback((
    messages: Message[],
    affection: number,
    step: number,
    ruleTriggers: RuleTrigger[]
  ) => {
    dispatch({ type: 'LOAD_HISTORY', payload: { messages, affection, step, ruleTriggers } });
  }, []);

  const value: GameContextType = {
    state,
    setPhase,
    setRole,
    setScenario,
    setIsNewGame,
    startGame,
    resetGame,
    sendMessage,
    addPartnerMessage,
    useHelp,
    canUseHelp,
    loadHistory,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

// Hook
export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
