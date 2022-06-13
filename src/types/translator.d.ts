interface Translator {
  // 名称
  name: string
  // 图标路径
  icon: string
  // 语种列表 { label: 名称, value: 编码 }
  languages: { label: string; value: string }[]
  // 翻译函数 { text: 翻译文本, from: 源语言, to: 目标语言 } => 翻译处理函数
  translate: (text: string, from?: string, to?: string) => Promise<string>
}
