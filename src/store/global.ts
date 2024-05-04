import { atom, DefaultValue, selector } from "recoil";
import persistence from "/src/util/persistence.ts";

export interface GlobalProps {
  // 进入插件时自动翻译
  autoTranslateOnPluginEnter: boolean
  // 输入自动翻译
  autoTranslateOnInput: boolean
  // 自动切换目标语言
  autoSwitchDstLang: boolean
  // 输入自动翻译延迟(ms)
  waitOnInputTranslate: number
  // 语言偏好顺序
  languagePreferences: Array<string>
  // 历史记录保留条数
  historyRecordCount: number
}

const dftProps = {
  autoTranslateOnPluginEnter: true,
  autoTranslateOnInput: true,
  autoSwitchDstLang: true,
  waitOnInputTranslate: 1000,
  languagePreferences: ["cmn", "eng", "jpn"],
  historyRecordCount: 100,
}

const globalState = atom<GlobalProps>({
  key: "globalState",
  default: dftProps,
  effects: [persistence("global")]
})

export const globalPropsState = selector<GlobalProps>({
  key: "globalPropsState",
  get: ({ get }) => ({ ...dftProps, ...get(globalState) }),
  set: ({ get, set }, props) => {
    if ((props instanceof DefaultValue) || !props) return
    set(globalState, { ...get(globalState), ...props })
  }
})
