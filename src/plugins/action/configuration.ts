export const allActions = [
  {
    key: "service",
    text: "服务",
    actions: [
      { key: "serviceNext", text: "下一个服务", preset: "Tab" },
      { key: "servicePrev", text: "上一个服务", preset: "Shift+Tab" }
    ]
  },
  {
    key: "srcLang",
    text: "当前语种",
    actions: [
      { key: "srcLangPrev", text: "上一个语种", preset: "Alt+q" },
      { key: "srcLangNext", text: "下一个语种", preset: "Alt+e" }
    ]
  },
  {
    key: "dstLang",
    text: "目标语种",
    actions: [
      { key: "dstLangPrev", text: "上一个语种", preset: "Control+q" },
      { key: "dstLangNext", text: "下一个语种", preset: "Control+e" },
    ]
  },
  {
    key: "srcText",
    text: "原文",
    actions: [
      { key: "srcInputFocus", text: "定位输入框", preset: "Control+Space" },
      { key: "srcTextFromClipboard", text: "读取剪切板到输入框", preset: "Control+Shift+v" },
      { key: "srcTextSentenceCase", text: "转为语句形式并翻译", preset: "Alt+1" },
      { key: "srcTextExtractComment", text: "提取注释并翻译", preset: "Alt+2" }
    ]
  },
  {
    key: "dstText",
    text: "译文",
    actions: [
      { key: "dstTextCamelCaseCopy", text: "以驼峰形式复制", preset: "Control+1" },
      { key: "dstTextPascalCaseCopy", text: "以大驼峰形式复制", preset: "Control+2" },
      { key: "dstTextSnakeCaseCopy", text: "以蛇形复制", preset: "Control+3" },
      { key: "dstTextScreamingSnakeCaseCopy", text: "以大蛇形复制", preset: "Control+4" },
      { key: "dstTextKebabCaseCopy", text: "以连字符形式复制", preset: "Control+5" }
    ]
  }
]
