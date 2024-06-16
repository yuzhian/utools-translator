export const allActions = [
  {
    key: "service",
    text: "服务",
    actions: [
      { key: "translate", text: "执行翻译", preset: "Control+Enter" },
      { key: "serviceNext", text: "下一个服务", preset: "Tab" },
      { key: "servicePrev", text: "上一个服务", preset: "Shift+Tab" }
    ]
  },
  {
    key: "srcLang",
    text: "当前语种",
    actions: [
      { key: "srcLangPrev", text: "上一个语种", preset: "Control+ArrowLeft" },
      { key: "srcLangNext", text: "下一个语种", preset: "Control+ArrowRight" }
    ]
  },
  {
    key: "dstLang",
    text: "目标语种",
    actions: [
      { key: "dstLangPrev", text: "上一个语种", preset: "Alt+ArrowLeft" },
      { key: "dstLangNext", text: "下一个语种", preset: "Alt+ArrowRight" },
    ]
  },
  {
    key: "srcText",
    text: "原文",
    actions: [
      { key: "srcInputFocus", text: "将光标置于输入框", preset: "Control+Shift+G" },
      { key: "srcTextFromClipboard", text: "将剪贴板内容粘贴到输入框", preset: "Control+Shift+V" },
      { key: "srcTextSentenceCase", text: "拆解变量文本并组成句子", preset: "Control+Shift+S" },
      { key: "srcTextExtractComment", text: "提取注释中的文本并翻译", preset: "Control+Shift+E" }
    ]
  },
  {
    key: "dstText",
    text: "译文",
    actions: [
      { key: "dstTextCamelCaseCopy", text: "以驼峰形式复制", preset: "Control+Shift+1" },
      { key: "dstTextPascalCaseCopy", text: "以大驼峰形式复制", preset: "Control+Shift+2" },
      { key: "dstTextSnakeCaseCopy", text: "以蛇形复制", preset: "Control+Shift+3" },
      { key: "dstTextScreamingSnakeCaseCopy", text: "以大蛇形复制", preset: "Control+Shift+4" },
      { key: "dstTextKebabCaseCopy", text: "以连字符形式复制", preset: "Control+Shift+5" }
    ]
  }
]
