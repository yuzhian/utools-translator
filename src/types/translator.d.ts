type Service = {
  /**
   * key
   */
  key: string
  /**
   * 账号
   */
  appid?: string
  /**
   * 秘钥
   */
  secret?: string
  /**
   * 令牌
   */
  token?: string
  /**
   * 是否启用
   */
  enable: boolean = true
}

type TranslateEntity = {
  /**
   * 翻译结果
   */
  value?: string
  /**
   * 检测源语言
   */
  from?: string
  /**
   * 检测目标语言
   */
  to?: string
}

type LanguageType = [code: string, serviceCode: string, supportCodes: Array<string>]

type Translator = {
  /**
   * 名称
   */
  name: string
  /**
   * 图标路径
   */
  icon: string
  /**
   * 翻译服务类型 free: 免费服务 secret: 需账号密钥
   */
  type: 'free' | 'secret' | 'token' = 'free'
  /**
   * 服务频率限制, 单位: 毫秒
   */
  interval: number
  /**
   * 语种列表 { label: 名称, value: 编码 }
   */
  languages: Array<LanguageType>
  /**
   * 翻译函数 { value: 翻译文本, from: 源语言, to: 目标语言 } => 翻译处理函数
   */
  translate: (value: string, from?: string, to?: string) => Promise<TranslateEntity>
}

type Hotkey = {
  /**
   * 快捷键
   */
  hotkey?: string
  /**
   * command
   */
  command?: string
}

type Command = {
  /**
   * 命令名称
   */
  label: string
  /**
   * 执行函数
   */
  exec: (params: any, last: any) => any
}
