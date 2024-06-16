const COMMENT_HANDLERS = [
  // ------------ 文档注释 ------------------------
  // /** */: C/C++/C#/Java/JavaScript
  {
    regex: /\/\*\*[\s\S]*?\*\//g,
    handler: (comment: string) => mergeLinesWithoutPunctuation(comment.replace(/^\/\*\*|\*\/$/g, '').replace(/^\s*\*\s?/gm, '').trim()),
  },
  // ------------ 多行注释 ------------------------
  // /* */: C/C++/C#/Java/JavaScript
  {
    regex: /\/\*[\s\S]*?\*\//g,
    handler: (comment: string) => mergeLinesWithoutPunctuation(comment.replace(/^\/\*|\*\/$/g, '').replace(/^\s*\*\s?/gm, '').trim()),
  },
  // """ """: Python
  {
    regex: /""".*?"""/gs,
    handler: (comment: string) => mergeLinesWithoutPunctuation(comment.replace(/^"""/gm, '').replace(/"""\s*$/gm, '').trim()),
  },
  // {- -}: Haskell
  {
    regex: /{-[\s\S]*?-}/g,
    handler: (comment: string) => mergeLinesWithoutPunctuation(comment.replace(/{-\s*/g, '').replace(/\s*-}/g, '').trim()),
  },
  // =begin =end: Ruby
  {
    regex: /=begin[\s\S]*?=end/g,
    handler: (comment: string) => mergeLinesWithoutPunctuation(comment.replace(/^=begin/gm, '').replace(/=end\s*$/gm, '').trim()),
  },
  // ------------ 单行注释 ------------------------
  // //: C/C++/C#/Java/JavaScript
  {
    regex: /\/\/.*$/gm,
    handler: (comment: string) => comment.replace(/^\/\/\s?/gm, '').trim(),
  },
  // --: SQL
  {
    regex: /--.*$/gm,
    handler: (comment: string) => comment.replace(/^--\s?/gm, '').trim(),
  },
  // #: Bash/Shell/Python/Ruby
  {
    regex: /#.*$/gm,
    handler: (comment: string) => comment.replace(/^#\s?/gm, '').trim(),
  },
  // %: MATLAB
  {
    regex: /%.*$/gm,
    handler: (comment: string) => comment.replace(/^%\s?/gm, '').trim(),
  },
]

/**
 * 合并无符号的换行
 */
const mergeLinesWithoutPunctuation = (text: string) => {
  const lines = text.trim().split('\n')
  for (let i = 0; i < lines.length - 1;) {
    const currentLine = lines[i].trim()
    const nextLine = lines[i + 1].trim()
    if (/[.,;:!?，。；：！？、（）【】《》“”‘’]/.test(currentLine.slice(-1))) {
      i++
      continue
    }
    lines[i] = currentLine + ' ' + nextLine
    lines.splice(i + 1, 1)
  }
  return lines.join('\n')
}

/**
 * 提取注释内容
 * @param {string} text 文本
 */
export const extractComment = (text: string) =>
  COMMENT_HANDLERS.reduce((processedText, { regex, handler }) =>
      processedText.replace(regex, handler)
    , text
  )
