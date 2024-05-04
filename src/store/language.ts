import { atom, atomFamily, selectorFamily } from "recoil";
import { uniq } from "lodash";

import persistence from "/src/util/persistence.ts";

/**
 * 默认语言 和 显示数量
 */
const DFT = ["auto", "cmn", "eng", "jpn"]
const CNT = DFT.length - 1

/**
 * 语言使用记录
 */
const languageRecordsState = atomFamily<Array<string>, EndpointType>({
  key: "languagesState",
  default: DFT,
  effects: key => [persistence(`${key}_languages`)]
})

/**
 * 最近使用语言(不包含auto, 只读)
 */
export const languageRecordsReadonlyState = selectorFamily<Array<string>, EndpointType>({
  key: "languageRecordsReadonlyState",
  get: (key) => ({ get }) => get(languageRecordsState(key)).filter(item => item !== "auto").slice(0, CNT)
})

/**
 * 当前语言, 在 set 时, 更新最近使用的语言
 */
export const languageCurrentState = selectorFamily<string, EndpointType>({
  key: "languageCurrentState",
  get: (key) => ({ get }) => get(languageRecordsState(key)).find(item => "src" === key ? item : item !== "auto") || "cmn",
  set: (key) => ({ get, set }, newValue) => {
    if (typeof newValue !== "string") return
    set(languageRecordsState(key), uniq([newValue, ...get(languageRecordsState(key))]).slice(0, CNT + 1))
  }
})

/**
 * 检测语言, 自动检测时
 */
export const languageDetectState = atom<string>({
  key: "languageDetectState",
  default: ""
})
