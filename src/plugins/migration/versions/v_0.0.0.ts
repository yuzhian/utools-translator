export type v_0_0_0 = {
  global: {
    autoTranslate: boolean
    autoSwitchDstLang: boolean
    inputDebounceWait: number
    languagePreferences: string[]
    historyRecordCount: number
  }
  keybinding: { action: string, keybinding: string }[]
  service: string
  services: {
    key: string
    enable: boolean
    authData: Record<string, string>
    lastReset: number
    block: boolean
    reset: boolean
    limit: number
    usage: number
  }[]
  records: string[]
  src_languages: string[]
  dst_languages: string[]
}

export default () => {
}
