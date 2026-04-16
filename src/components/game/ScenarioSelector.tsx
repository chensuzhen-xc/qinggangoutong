'use client';

import { useState } from 'react';
import { Scenario } from '@/types';
import { getScenariosByRoleId } from '@/data/scenarios';
import { useGame } from '@/context/GameContext';
import { cn } from '@/lib/utils';
import { ChevronLeft, Shuffle } from 'lucide-react';

export function ScenarioSelector() {
  const { state, setScenario, startGame, setPhase, sendMessage } = useGame();
  const [customScenario, setCustomScenario] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const scenarios = state.role ? getScenariosByRoleId(state.role.id) : [];

  const handleSelectScenario = async (scenario: Scenario) => {
    setScenario(scenario);
    setIsLoading(true);
    
    try {
      // 获取开场白
      const response = await fetch('/api/opening', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: state.role, scenario }),
      });
      
      const data = await response.json();
      
      // 开始游戏
      startGame();
      
      // 添加开场消息（通过 context 的方法）
      // 这里需要先开始游戏，然后添加消息
    } catch (error) {
      console.error('获取开场白失败:', error);
      startGame();
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomScenario = async () => {
    if (!customScenario.trim() || !state.role) return;

    const custom: Scenario = {
      id: 'custom',
      roleId: state.role.id,
      title: '自定义场景',
      description: customScenario,
    };

    await handleSelectScenario(custom);
  };

  const handleRandomScenario = async () => {
    if (scenarios.length > 0) {
      const randomIndex = Math.floor(Math.random() * scenarios.length);
      await handleSelectScenario(scenarios[randomIndex]);
    }
  };

  const handleBack = () => {
    setPhase('select-role');
  };

  return (
    <div className="w-full max-w-md mx-auto px-4">
      {/* 返回按钮 */}
      <button
        onClick={handleBack}
        className="flex items-center text-muted-foreground hover:text-foreground mb-4"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>返回选择角色</span>
      </button>

      <h2 className="text-xl font-bold text-center mb-2">
        {state.role?.avatarEmoji} 选择场景
      </h2>
      <p className="text-sm text-muted-foreground text-center mb-6">
        {state.role?.name}为什么生气？
      </p>

      {/* 随机按钮 */}
      <button
        onClick={handleRandomScenario}
        disabled={isLoading}
        className={cn(
          "w-full mb-4 flex items-center justify-center gap-2",
          "py-3 px-4 rounded-xl border-2 border-dashed border-pink-200",
          "text-pink-600 hover:border-pink-400 hover:bg-pink-50 transition-all",
          "disabled:opacity-50"
        )}
      >
        <Shuffle className="w-4 h-4" />
        <span>随机选择场景</span>
      </button>

      {/* 预设场景列表 */}
      <div className="space-y-2 mb-4">
        {scenarios.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => handleSelectScenario(scenario)}
            disabled={isLoading}
            className={cn(
              "w-full text-left p-4 rounded-xl",
              "bg-white hover:bg-gray-50 border border-gray-100",
              "transition-all active:scale-98",
              "disabled:opacity-50"
            )}
          >
            <div className="font-medium text-gray-800">{scenario.title}</div>
            <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {scenario.description}
            </div>
          </button>
        ))}
      </div>

      {/* 自定义场景 */}
      <div className="border-t pt-4">
        <p className="text-sm font-medium text-gray-700 mb-2">或者描述你的情况：</p>
        <textarea
          value={customScenario}
          onChange={(e) => setCustomScenario(e.target.value)}
          placeholder="例如：我忘了她的生日，她很生气..."
          className={cn(
            "w-full p-3 rounded-xl border border-gray-200 resize-none",
            "focus:outline-none focus:ring-2 focus:ring-pink-300",
            "placeholder:text-gray-400"
          )}
          rows={3}
        />
        <button
          onClick={handleCustomScenario}
          disabled={!customScenario.trim() || isLoading}
          className={cn(
            "w-full mt-2 py-2 px-4 rounded-xl",
            "bg-pink-500 text-white hover:bg-pink-600",
            "disabled:bg-gray-200 disabled:text-gray-400",
            "transition-all"
          )}
        >
          {isLoading ? '加载中...' : '开始哄人'}
        </button>
      </div>
    </div>
  );
}
