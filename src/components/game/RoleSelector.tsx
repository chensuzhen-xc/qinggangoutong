'use client';

import { Role } from '@/types';
import { presetRoles } from '@/data/roles';
import { useGame } from '@/context/GameContext';
import { cn } from '@/lib/utils';

export function RoleSelector() {
  const { setRole } = useGame();

  const handleSelectRole = (role: Role) => {
    setRole(role);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <h2 className="text-xl font-bold text-center mb-2">选择你要哄的人</h2>
      <p className="text-sm text-muted-foreground text-center mb-6">
        不同角色有不同的性格和场景
      </p>
      
      <div className="grid grid-cols-2 gap-3">
        {presetRoles.map((role) => (
          <button
            key={role.id}
            onClick={() => handleSelectRole(role)}
            className={cn(
              "flex flex-col items-center p-4 rounded-xl border-2 border-transparent",
              "bg-white hover:border-pink-300 hover:shadow-md transition-all duration-200",
              "active:scale-95"
            )}
          >
            <span className="text-4xl mb-2">{role.avatarEmoji}</span>
            <span className="font-medium text-gray-800">{role.name}</span>
            <div className="flex flex-wrap justify-center gap-1 mt-2">
              {role.personalityTags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 bg-pink-50 text-pink-600 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
