import { atom, DefaultValue, selector } from "recoil";
import persistence from "/src/util/persistence.ts";

export interface GlobalProps {
  // 自动翻译
  autoTranslate: boolean
  // 自动切换目标语言
  autoSwitchDstLang: boolean
  // 输入防抖(ms, 自动翻译启用时生效)
  inputDebounceWait: number
  // 语言偏好顺序
  languagePreferences: Array<string>
  // 历史记录保留条数
  historyRecordCount: number
}

const initProps = {
  autoTranslate: true,
  autoSwitchDstLang: true,
  inputDebounceWait: 1000,
  languagePreferences: ["cmn", "eng", "jpn"],
  historyRecordCount: 100,
}

const globalState = atom<GlobalProps>({
  key: "globalState",
  default: initProps,
  effects: [persistence("global")]
})

export const globalPropsState = selector<GlobalProps>({
  key: "globalPropsState",
  get: ({ get }) => ({ ...initProps, ...get(globalState) }),
  set: ({ get, set }, props) => {
    if ((props instanceof DefaultValue) || !props) return
    set(globalState, { ...get(globalState), ...props })
  }
})
