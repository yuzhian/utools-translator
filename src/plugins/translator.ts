import cldrzh from '/src/assets/languages/cldr.zh.json'
import extension from '/src/assets/languages/extension.zh.json'

const translatorModules: Record<string, { default: Translator }> = import.meta.glob('/src/plugins/translator/*.(ts|js)', { eager: true })
const languageModules: Record<string, { default: Array<LanguageType> }> = import.meta.glob('/src/assets/languages/language.*.json', { eager: true })

export const translators: Record<string, Translator> = Object.fromEntries(
  Object.entries(translatorModules).map(([key, { default: translator }]) => {
    const service = key.replace(/^\/src\/plugins\/translator\//, '').replace(/\.(ts|js)$/, '')
    return [service, Object.assign(translator, { languages: languageModules[`/src/assets/languages/language.${service}.json`]?.default })]
  })
)

export const languageLocale: Record<string, string> = Object.assign(cldrzh.main.zh.localeDisplayNames.languages, extension)

// 服务-支持语言 : [{ key: service, lks: [languageKey] }]
const tks = Object.entries(translators).map(([key, translator]) => ({ key, lks: translator.languages.map(([k]) => k) }))
export const languageOptions: Array<{ key: string; label: string; services: Array<string> }> = Object.entries(languageLocale)
  // [key, label] => { key, label, services }
  .map(([key, label]) => ({ key, label, services: tks.filter(({ lks }) => lks.includes(key)).map(({ key }) => key) }))
  // 过滤掉没有服务支持的语言
  .filter(({ services }) => services.length > 0)
  // 过滤掉auto
  .filter(({ key }) => !['auto'].includes(key))
