import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { storage } from "/src/util/storage";

export interface GeneralProps {
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

const defaultGeneralProps: GeneralProps = {
  autoTranslate: true,
  autoSwitchDstLang: true,
  inputDebounceWait: 1000,
  languagePreferences: ["cmn", "eng", "jpn"],
  historyRecordCount: 100
}

const generalStorage = atomWithStorage("general", defaultGeneralProps, storage<GeneralProps>())

export const generalAtom = atom(
  (get) => ({ ...defaultGeneralProps, ...get(generalStorage) }),
  (get, set, props: Partial<GeneralProps>) => {
    if (!props) return
    set(generalStorage, { ...get(generalStorage), ...props })
  }
)
