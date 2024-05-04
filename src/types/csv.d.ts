declare module "*/languages.csv" {
  type LanguageCsvInfo = {
    /**
     * 标识一个语言, 项目中全局唯一, 以 ISO 639-3 为主体, 其中 qaa-qtz 可供自定义使用
     * 大部分情况只起到标识符的作用, 使用 franc 检测语言时例外, franc 的结果为 639-3
     * @see https://iso639-3.sil.org/code_tables/639/data
     */
    key: string
    /**
     * i: individual: 单一语言
     * c: collections: 语言集合
     * m: macrolanguages: 宏语言
     */
    scope: string
    /**
     * a: ancient: 古代语言(自古代以来灭绝)
     * h: historical: 历史语言(与现代形式不同)
     * e: extinct: 近代灭绝的语言
     * c: constructed: 人造语言
     */
    type: string
    /**
     * 语言中文名称
     */
    chinese: string
    /**
     * 语言英文名称
     */
    english: string
    /**
     * 服务(service)及其对应的编码(code, 不同于 key, 是平台定义的语言编码, 例如 简体中文 key=cmn, 有道 code=zh-CHS)
     * 一般情况下, 服务对于存在编码(即服务列与语言行相交的单元格存在编码)的语言, 全部可作为原文语言及目标语言
     * 如果某个语言作为原文语言时, 仅支持部分语言为目标语言, 则编码以竖线隔开, 左侧为平台 code, 右侧为支持的语言 key (不是 code)
     * (例如腾讯翻译, 中文, code: zh|eng,jpn,kor,fra,spa,ita,deu,tur,rus,spa,vie,ind,tha,msa)
     */
    [service: string]: string
  }
  const value: Array<LanguageCsvInfo>

  export default value
}
