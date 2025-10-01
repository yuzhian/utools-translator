import { atom } from "jotai";
import { uniq } from "lodash";
import deepEqual from 'fast-deep-equal'
import { atomFamily, atomWithStorage } from "jotai/utils";
import { load, storage } from "/src/util/storage.ts";

/**
 * 默认语言 和 显示数量
 */
const DFT = ["auto", "cmn", "eng", "jpn"]
const CNT = DFT.length - 1

/**
 * 语言使用记录
 */
const languageStorage = atomWithStorage("languages", load<Record<EndpointType, string[]>>("languages", {
  src: DFT,
  dst: DFT
}), storage<Record<EndpointType, string[]>>())

/**
 * 最近使用语言(不包含auto, 只读)
 */
export const languagesFamily = atomFamily((endpoint: EndpointType) => atom(
  (get) => get(languageStorage)[endpoint].filter((item: string) => item !== "auto").slice(0, CNT),
  (get, set, newValue: string[]) => set(languageStorage, { ...get(languageStorage), [endpoint]: newValue })
), deepEqual)

/**
 * 当前语言, 在 set 时, 更新最近使用的语言
 */
export const currentLanguageFamily = atomFamily((endpoint: EndpointType) => atom(
  (get) => (get(languageStorage)[endpoint].find((item: string) => "src" === endpoint ? item : item !== "auto") || "cmn"),
  (get, set, newValue: string) => {
    set(languagesFamily(endpoint), uniq([newValue, ...get(languagesFamily(endpoint))]).slice(0, CNT + 1))
  }
), deepEqual)

/**
 * 检测语言, 自动检测时
 */
export const detectLanguageAtom = atom<string>("")
