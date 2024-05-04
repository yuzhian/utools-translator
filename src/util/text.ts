/**
 * 提取注释内容
 */
export const extractComment = (text: string) => {
  return text
    // 去除多行注释头
    .replace(/\/\*+/g, "")
    // 去除多行注释尾
    .replace(/\*\//g, "")
    // 当前行 @ 开头, 则换行
    .replace(/\n[ \t]*\*[ \t]*(@)/g, "\n$1")
    // 上一行末尾是文本, 则拼接
    .replace(/([\u4e00-\u9fa5a-zA-Z0-9])[ \t]*\n[ \t]*\*[ \t]*/g, "$1 ")
    // 上一行末尾是符号, 则换行
    .replace(/([^\u4e00-\u9fa5a-zA-Z0-9])[ \t]*\n[ \t]*\*[ \t]*/g, "$1\n")
    // 去除行首 *
    .replace(/\n[ \t]*\*[ \t]*/g, "\n")
    // 去除标签
    .replace(/<[^>]+>/g, "")
    // 去除多余的空白符号
    .replace(/[ \t]+/g, " ")
}