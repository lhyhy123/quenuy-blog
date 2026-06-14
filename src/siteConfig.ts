// siteConfig.ts —— 却nuy博客全站控制中心

export const siteConfig = {
  // 网站标题与博主信息
  title: "却nuy",
  url: "https://quenuy.top",
  authorName: "却nuy",
  bio: "读西塞罗，写代码。没有赋能和闭环，只有一个人慢慢想清楚的东西。",

  // 导航栏
  navTitle: "却nuy",

  // 头像
  avatarUrl: "/images/avatar.jpg",

  // 背景设置
  useGradient: false,
  themeColors: ["#6366f1", "#818cf8", "#a5b4fc", "#c7d2fe"],
  bgImages: [
    "/images/bg/bg0.jpg",
    "/images/bg/bg1.jpg",
    "/images/bg/bg2.jpg",
    "/images/bg/bg3.jpg",
    "/images/bg/bg4.jpg",
    "/images/bg/bg5.jpg",
    "/images/bg/bg6.jpg",
    "/images/bg/bg7.jpg",
    "/images/bg/bg8.jpg",
    "/images/bg/bg9.jpg",
    "/images/bg/bg10.jpg",
    "/images/bg/bg11.jpg",
    "/images/bg/bg12.jpg",
    "/images/bg/bg13.jpg",
    "/images/bg/bg14.jpg",
    "/images/bg/bg15.jpg",
    "/images/bg/bg16.jpg",
    "/images/bg/bg17.jpg",
    "/images/bg/bg18.jpg",
    "/images/bg/bg19.jpg",
    "/images/bg/bg25.jpg",
    "/images/bg/bg26.jpg",
    "/images/bg/bg27.jpg",
    "/images/bg/bg28.jpg",
    "/images/bg/bg29.jpg",
    "/images/bg/bg30.jpg",
    "/images/bg/bg31.jpg",
    "/images/bg/bg32.jpg",
    "/images/bg/bg33.jpg",
    "/images/bg/bg34.jpg",
  ],

  // 默认封面图
  defaultPostCover: "/images/bg/bg0.jpg",

  // 照片墙预览图
  photoWallImage: "/images/bg/bg1.jpg",

  // 音乐（网易云歌单 ID，填 0 则用内置播放器）
  cloudMusicPlaylistId: "",
  cloudMusicIds: [],

  // 社交链接
  social: {
    github: "https://github.com/lhyhy123",
    email: "lhy@qq.com",
    bilibili: "",
    qq: "",
    wechat: "",
  },

  // 站点信息
  buildDate: "2025-01-01T00:00:00",
  footerBadges: [
    { name: "Next.js 16", color: "text-sky-500" },
    { name: "React 19", color: "text-cyan-400" },
    { name: "Tailwind 4", color: "text-teal-400" },
  ],

  // ICP备案
  icpConfig: null as { name: string; link: string } | null,

  // 分类标题
  chatterTitle: "杂谈",
  chatterDescription: "代码、哲学、生活的碎片记录",

  // 友链
  friends: [] as { name: string; url: string; desc: string }[],
};
