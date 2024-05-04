import languagesCsv from "./languages.csv";
import { mapKeys } from "lodash";

// 语言列表: [ { key: "cmn", chinese: "中文", english: "Mandarin Chinese", youdao: "zh-CHS", tencent: "zh|eng,..." }, ... ]
export default languagesCsv

// 通用列
const commonColumns = ["key", "scope", "type", "chinese", "english"]
// 服务列
const serviceColumns = Object.keys(languagesCsv[0]).filter(column => !commonColumns.includes(column))

// key-LanguageCsvInfo: { "cmn": { key: "cmn", chinese: "中文", english: "Mandarin Chinese", youdao: "zh-CHS", tencent: "zh|eng,..." }, ... }
const keyMap = mapKeys(languagesCsv, ({ key }) => key)

// service-code-LanguageCsvInfo: { "youdao": { "zh-CHS": { key: "cmn", chinese: "中文", english: "Mandarin Chinese", youdao: "zh-CHS", tencent: "zh|eng,..." }, ... }, ...
const serviceCodeKeyMap = Object.fromEntries(serviceColumns.map(serviceKey => [
  serviceKey, mapKeys(languagesCsv.filter(item => item[serviceKey]), ({ [serviceKey]: v }) => v.split("|")[0])
]))

/**
 * 通过语言标识和服务标识, 获取对应的服务编码
 * @param langKey    语言标识
 * @param serviceKey 服务标识
 */
export const getCodeByKey = (langKey: string, serviceKey: string) => {
  return keyMap?.[langKey]?.[serviceKey]?.split('|')[0]
}

/**
 * 通过服务编码和服务标识, 获取对应的语言标识
 * @param langCode   服务编码
 * @param serviceKey 服务标识
 */
export const getKeyByCode = (langCode: string, serviceKey: string) => {
  return serviceCodeKeyMap[serviceKey]?.[langCode]?.key
}

/**
 * 通过语言标识获取对应的中文名
 *
 * @param langKey 语言标识
 */
export const getChineseByKey = (langKey: string) => {
  return keyMap?.[langKey]?.chinese
}

/**
 * 获取支持的语言
 *
 * @param serviceKey 服务标识
 * @param srcLang    原文语言
 */
export const getSupportsByService = (serviceKey: string, srcLang?: string): string[] =>
  (srcLang && keyMap[srcLang]?.[serviceKey]?.split("|")[1]?.split(","))
  || languagesCsv.filter(language => language[serviceKey]).map(({ key }) => key)
