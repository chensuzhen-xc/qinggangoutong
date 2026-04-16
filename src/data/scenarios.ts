import { Scenario } from '@/types';

// 预设场景数据
export const presetScenarios: Scenario[] = [
  // 女朋友场景
  {
    id: 'gf-anniversary',
    roleId: 'girlfriend',
    title: '忘记纪念日',
    description: '今天是你们在一起三周年，你完全忘了，她等了一整天都没等到你的表示。晚上她终于忍不住给你发了消息："今天是什么日子，你记得吗？"',
  },
  {
    id: 'gf-late-night',
    roleId: 'girlfriend',
    title: '深夜不回消息',
    description: '你昨晚和朋友打游戏到凌晨三点，她发了十几条消息你都没回。第二天醒来，你看到她最后一条消息："算了，你不用回了。"',
  },
  {
    id: 'gf-ex-photo',
    roleId: 'girlfriend',
    title: '被发现前任照片',
    description: '她在整理你房间时，发现了你藏在抽屉里的前任照片。她拿着照片站在你面前，眼眶红红的："你还留着这个？"',
  },
  {
    id: 'gf-forgot-date',
    roleId: 'girlfriend',
    title: '爽约',
    description: '你们约好周末去看电影，你却因为睡过头忘了。她在电影院门口等了两小时，打你电话也没人接。等你终于赶到，她已经一个人走了。',
  },
  {
    id: 'gf-compare',
    roleId: 'girlfriend',
    title: '拿她和别人比较',
    description: '你在朋友聚会上说她"要是像XX女朋友那么会做饭就好了"。回家后她一直沉默，最后说："那你去找她啊。"',
  },

  // 男朋友场景
  {
    id: 'bf-game',
    roleId: 'boyfriend',
    title: '游戏比女朋友重要',
    description: '他正在打游戏，你打电话说有急事，他说"等一下，这局马上结束"。结果等了半小时他还没回电话。',
  },
  {
    id: 'bf-forgot-anniversary',
    roleId: 'boyfriend',
    title: '忘记纪念日',
    description: '你们在一起一周年，他不仅没准备礼物，还问"今天是什么日子？"你气得直接把蛋糕扔了。',
  },
  {
    id: 'bf-hangout',
    roleId: 'boyfriend',
    title: '偷偷出去玩',
    description: '他说加班，结果被你发现其实是和朋友去打球了。你质问他，他还说"不是怕你生气吗"',
  },
  {
    id: 'bf-reply',
    roleId: 'boyfriend',
    title: '不回消息',
    description: '你发了一长串消息分享今天的事，他只回了一个"嗯"。你觉得自己的热情被泼了冷水。',
  },

  // 闺蜜场景
  {
    id: 'bestie-gossip',
    roleId: 'bestie',
    title: '背后说坏话',
    description: '她从别人那里听说，你在背后吐槽她"太作"。她直接来质问你："我真把你当闺蜜，你居然这么说我？"',
  },
  {
    id: 'bestie-cancel',
    roleId: 'bestie',
    title: '放鸽子',
    description: '你们约好一起逛街，你临时说要陪男朋友，放了她鸽子。她在商场门口等了一小时，发消息说"算了，我懂了"。',
  },
  {
    id: 'bestie-secret',
    roleId: 'bestie',
    title: '泄露秘密',
    description: '你答应帮她保守秘密，结果不小心说出去了。她知道后直接把你拉黑了："我那么信任你。"',
  },

  // 兄弟场景
  {
    id: 'brother-borrow',
    roleId: 'brother',
    title: '借钱不还',
    description: '你借了他一笔钱，说好一周还，结果一个月了还没动静。他发消息说："兄弟，当初那钱……"',
  },
  {
    id: 'brother-betray',
    roleId: 'brother',
    title: '兄弟女人',
    description: '他听说你和他喜欢的女生走得很近，直接来找你："我当你兄弟，你却这样？"',
  },
  {
    id: 'brother-lie',
    roleId: 'brother',
    title: '撒谎被抓',
    description: '你说帮他办的事办好了，结果他发现你根本没办。他拍桌子说："你就不能说实话？"',
  },

  // 老板场景
  {
    id: 'boss-deadline',
    roleId: 'boss',
    title: '项目延期',
    description: '你负责的项目本该今天交付，却延期了三天还没完成。老板把你叫进办公室："你知道这给公司造成多大损失吗？"',
  },
  {
    id: 'boss-mistake',
    roleId: 'boss',
    title: '工作失误',
    description: '你发的邮件抄送给了错误的客户，造成公司尴尬。老板发来消息："来我办公室一趟。"',
  },
  {
    id: 'boss-absence',
    roleId: 'boss',
    title: '无故缺勤',
    description: '你昨天没请假就没来上班，手机还关机了。今天一进公司，老板就说："你以为公司是你家开的？"',
  },

  // 父母场景
  {
    id: 'parent-phone',
    roleId: 'parent',
    title: '不接电话',
    description: '妈妈打了十几个电话你没接，她担心坏了。最后发消息说："你到底出什么事了？妈妈快急死了。"',
  },
  {
    id: 'parent-lie',
    roleId: 'parent',
    title: '欺骗父母',
    description: '你说在公司加班，结果被他们发现其实在外面玩。爸爸很失望："我们不是教育过你要诚实吗？"',
  },
  {
    id: 'parent-money',
    roleId: 'parent',
    title: '乱花钱',
    description: '你刚工作就刷信用卡买了很多奢侈品，被爸妈发现了。妈妈说："你知道赚钱多不容易吗？"',
  },

  // 子女场景
  {
    id: 'child-grade',
    roleId: 'child',
    title: '成绩下滑',
    description: '孩子这次考试退步了很多，还瞒着不让你知道。你发现成绩单后，孩子低着头不说话。',
  },
  {
    id: 'child-phone',
    roleId: 'child',
    title: '沉迷手机',
    description: '你发现孩子每天玩手机到深夜，作业也不写。你没收了手机，孩子生气地跑进房间摔门。',
  },
  {
    id: 'child-lie',
    roleId: 'child',
    title: '撒谎',
    description: '孩子说要钱买学习资料，其实是拿去买游戏了。你知道后很生气，孩子却还说"同学都买"。',
  },
];

// 根据角色ID获取场景
export const getScenariosByRoleId = (roleId: string): Scenario[] => {
  return presetScenarios.filter(scenario => scenario.roleId === roleId);
};

// 根据ID获取场景
export const getScenarioById = (id: string): Scenario | undefined => {
  return presetScenarios.find(scenario => scenario.id === id);
};

// 获取随机场景
export const getRandomScenario = (roleId: string): Scenario | undefined => {
  const scenarios = getScenariosByRoleId(roleId);
  if (scenarios.length === 0) return undefined;
  return scenarios[Math.floor(Math.random() * scenarios.length)];
};
