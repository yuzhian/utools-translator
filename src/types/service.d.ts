import { HTMLInputTypeAttribute } from "react";

declare global {
  type EndpointType = "src" | "dst"

  type SrcLang = {
    srcLang: string
  }

  type DstLang = {
    dstLang: string
  }

  type DetLang = {
    detLang: string
  }

  type SrcText = {
    srcText: string
  }

  type DstText = {
    dstText: string
  }

  type ErrText = {
    errText: string | false
  }

  type AuthProp = [
    field: string,
    label: string,
    type: HTMLInputTypeAttribute
  ]

  type AuthData = Record<string, string>

  type LanguageProps = SrcLang & DstLang

  type TranslateProps = SrcText & LanguageProps

  type TranslateResult = DstText & DetLang & Partial<ErrText>

  // 配置文件, 存储形式
  interface ServiceProps {
    key: string
    enable: boolean
    authData?: AuthData
  }

  // 翻译服务属性
  interface ServiceModule {
    name: string
    authProps: AuthProp[]
    translate: (data: TranslateProps, authData: AuthData) => Promise<TranslateResult>
  }

  // 翻译组件
  interface ServiceComponent {
    translate: (srcText: SrcText & Partial<LanguageProps>) => Promise<TranslateResult>
  }
}
