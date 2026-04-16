import { Role, PersonalityTag } from '@/types';

// 预设角色数据
export const presetRoles: Role[] = [
  {
    id: 'girlfriend',
    type: 'girlfriend',
    name: '女朋友',
    gender: 'female',
    personalityTags: ['温柔', '傲娇', '粘人', '敏感'],
    avatarEmoji: '👩',
    isPreset: true,
  },
  {
    id: 'boyfriend',
    type: 'boyfriend',
    name: '男朋友',
    gender: 'male',
    personalityTags: ['沉稳', '直男', '霸道', '温柔'],
    avatarEmoji: '👨',
    isPreset: true,
  },
  {
    id: 'bestie',
    type: 'bestie',
    name: '闺蜜',
    gender: 'female',
    personalityTags: ['毒舌', '护短', '直率', '温柔'],
    avatarEmoji: '👩‍🤝‍👩',
    isPreset: true,
  },
  {
    id: 'brother',
    type: 'brother',
    name: '兄弟',
    gender: 'male',
    personalityTags: ['豪爽', '义气', '闷骚', '幽默'],
    avatarEmoji: '🤝',
    isPreset: true,
  },
  {
    id: 'boss',
    type: 'boss',
    name: '老板',
    gender: 'male',
    personalityTags: ['严厉', '挑剔', '公正'],
    avatarEmoji: '👔',
    isPreset: true,
  },
  {
    id: 'parent',
    type: 'parent',
    name: '父母',
    gender: 'female',
    personalityTags: ['唠叨', '操心', '传统', '开明'],
    avatarEmoji: '👨‍👩‍👧',
    isPreset: true,
  },
  {
    id: 'child',
    type: 'child',
    name: '子女',
    gender: 'female',
    personalityTags: ['叛逆', '乖巧', '任性', '懂事'],
    avatarEmoji: '👧',
    isPreset: true,
  },
];

// 根据ID获取角色
export const getRoleById = (id: string): Role | undefined => {
  return presetRoles.find(role => role.id === id);
};

// 可选的性格标签列表
export const availablePersonalityTags: PersonalityTag[] = [
  '温柔', '傲娇', '粘人', '敏感',
  '沉稳', '直男', '霸道',
  '毒舌', '护短', '直率',
  '豪爽', '义气', '闷骚', '幽默',
  '严厉', '挑剔', '公正',
  '唠叨', '操心', '传统', '开明',
  '叛逆', '乖巧', '任性', '懂事',
];
