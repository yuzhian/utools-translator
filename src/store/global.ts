import { create } from "zustand";
import { combine, createJSONStorage, persist } from "zustand/middleware";

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

export const useGlobalStore = create(persist(combine(initProps, (set) => ({
  setGlobalProps: (newProps: Partial<GlobalProps>) => set((state) => ({ ...state, ...newProps })),
})), { name: "global", storage: createJSONStorage(() => localStorage) }));
