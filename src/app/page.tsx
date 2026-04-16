'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { GameProvider, useGame } from '@/context/GameContext';
import { RoleSelector } from '@/components/game/RoleSelector';
import { ScenarioSelector } from '@/components/game/ScenarioSelector';
import { AffectionBar } from '@/components/game/AffectionBar';
import { ChatWindow } from '@/components/game/ChatWindow';
import { InputArea } from '@/components/game/InputArea';
import { ResultAnalysis } from '@/components/game/ResultAnalysis';
import { HeaderNav } from '@/components/ui/HeaderNav';
import { cn } from '@/lib/utils';
import { Sparkles, BookOpen, RotateCcw, Heart, Trophy } from 'lucide-react';

// 游戏主界面
function GameScreen() {
  const { state, resetGame } = useGame();
  const [showOpening, setShowOpening] = useState(true);
  const [openingMessage, setOpeningMessage] = useState('');

  // 获取开场白
  useEffect(() => {
    if (state.phase === 'playing' && state.messages.length === 0 && state.role && state.scenario) {
      // 调用 API 获取开场白
      fetch('/api/opening', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: state.role, scenario: state.scenario }),
      })
        .then(res => res.json())
        .then(data => {
          setOpeningMessage(data.openingMessage);
        })
        .catch(() => {
          setOpeningMessage('(生气地看着你) 你来了？');
        });
    }
  }, [state.phase, state.role, state.scenario, state.messages.length]);

  // 添加开场消息到对话
  useEffect(() => {
    if (state.phase === 'playing' && showOpening && openingMessage && state.messages.length === 0) {
      // 等待一下再显示
      const timer = setTimeout(() => {
        setShowOpening(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state.phase, openingMessage, state.messages.length, showOpening]);

  if (state.gameOver) {
    return <ResultAnalysis onRestart={resetGame} />;
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50">
      {/* 顶部好感度条 */}
      <AffectionBar />

      {/* 对话窗口 */}
      <ChatWindow
        messages={state.messages}
        partnerAvatar={state.role?.avatarEmoji}
        partnerName={state.role?.name}
        isLoading={state.isLoading}
      />

      {/* 开场白动画 */}
      {showOpening && openingMessage && state.messages.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
          <div className="bg-white rounded-2xl p-6 mx-4 max-w-sm shadow-xl animate-fade-in">
            <div className="flex items-start gap-3">
              <span className="text-3xl">{state.role?.avatarEmoji}</span>
              <div>
                <p className="text-sm text-gray-600">{state.scenario?.title}</p>
                <p className="text-gray-800 mt-2 leading-relaxed">{openingMessage}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 底部输入区 */}
      <InputArea />
    </div>
  );
}

// 开始界面
function StartScreen() {
  const { setPhase } = useGame();

  const handleStart = () => {
    setPhase('select-role');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-pink-100 via-purple-50 to-blue-100 p-6">
      {/* 顶部导航 */}
      <HeaderNav />

      {/* Logo */}
      <div className="text-6xl mb-4 animate-bounce">💕</div>
      
      {/* 标题 */}
      <h1 className="text-3xl font-bold text-gray-800 mb-2">哄哄模拟器</h1>
      <p className="text-gray-500 mb-8 text-center">
        练习哄人的艺术，成为沟通高手
      </p>

      {/* 主按钮区域 */}
      <div className="flex flex-col items-center gap-4 w-full max-w-xs">
        {/* 开始哄人按钮 */}
        <button
          onClick={handleStart}
          className={cn(
            "w-full flex items-center justify-center gap-2 px-8 py-4 rounded-2xl",
            "bg-gradient-to-r from-pink-500 to-purple-500",
            "text-white font-medium text-lg",
            "hover:from-pink-600 hover:to-purple-600",
            "transform hover:scale-105 transition-all",
            "shadow-lg hover:shadow-xl"
          )}
        >
          <Sparkles className="w-5 h-5" />
          开始哄人
        </button>

        {/* 恋爱攻略入口 */}
        <Link
          href="/blog"
          className={cn(
            "w-full flex items-center justify-center gap-2 px-8 py-4 rounded-2xl",
            "bg-white border-2 border-pink-200",
            "text-pink-600 font-medium text-base",
            "hover:bg-pink-50 hover:border-pink-300",
            "transition-all"
          )}
        >
          <Heart className="w-5 h-5" />
          恋爱攻略
        </Link>

        {/* 排行榜入口 */}
        <Link
          href="/ranking"
          className={cn(
            "w-full flex items-center justify-center gap-2 px-8 py-4 rounded-2xl",
            "bg-white border-2 border-yellow-200",
            "text-yellow-600 font-medium text-base",
            "hover:bg-yellow-50 hover:border-yellow-300",
            "transition-all"
          )}
        >
          <Trophy className="w-5 h-5" />
          排行榜
        </Link>

        {/* 登录/注册入口 */}
        <div className="flex gap-3 w-full max-w-xs">
          <Link
            href="/login"
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl",
              "bg-white border-2 border-purple-200",
              "text-purple-600 font-medium",
              "hover:bg-purple-50 hover:border-purple-300",
              "transition-all"
            )}
          >
            登录
          </Link>
          <Link
            href="/register"
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl",
              "bg-purple-500 text-white font-medium",
              "hover:bg-purple-600",
              "transition-all"
            )}
          >
            注册
          </Link>
        </div>
      </div>

      {/* 底部信息 */}
      <div className="absolute bottom-8 text-center text-sm text-gray-400">
        <p>选择角色 → 选择场景 → 开始对话</p>
        <p className="mt-1">在10轮内把好感度哄到80以上</p>
      </div>
    </div>
  );
}

// 选择角色界面
function RoleSelectScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 py-8">
      <RoleSelector />
    </div>
  );
}

// 选择场景界面
function ScenarioSelectScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 py-8">
      <ScenarioSelector />
    </div>
  );
}

// 主游戏控制器
function GameController() {
  const { state, resetGame, startGame } = useGame();
  const [initialized, setInitialized] = useState(false);

  // 初始化开场白
  useEffect(() => {
    if (state.phase === 'playing' && state.role && state.scenario && !initialized) {
      // 调用 API 获取开场白
      fetch('/api/opening', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: state.role, scenario: state.scenario }),
      })
        .then(res => res.json())
        .then(data => {
          // 添加开场消息
          if (data.openingMessage) {
            // 这里需要通过 context 添加消息
            // 但为了避免重复，我们用 initialized 标记
          }
          setInitialized(true);
        })
        .catch(() => {
          setInitialized(true);
        });
    }
  }, [state.phase, state.role, state.scenario, initialized]);

  // 根据阶段渲染不同界面
  switch (state.phase) {
    case 'idle':
      return <StartScreen />;
    case 'select-role':
      return <RoleSelectScreen />;
    case 'select-scenario':
      return <ScenarioSelectScreen />;
    case 'playing':
    case 'result':
      return <GameScreen />;
    default:
      return <StartScreen />;
  }
}

// 主页面
export default function Home() {
  return (
    <GameProvider>
      <main className="min-h-screen">
        <GameController />
      </main>
    </GameProvider>
  );
}
