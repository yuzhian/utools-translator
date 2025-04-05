import { create } from "zustand";
import { combine, createJSONStorage, persist } from "zustand/middleware";
import { uniq } from "lodash";

/**
 * 默认语言 和 显示数量
 */
const DFT = ["auto", "cmn", "eng", "jpn"]
const CNT = DFT.length - 1

export const useLanguageStore = create(persist(combine({
  languageRecords: {
    src: DFT,
    dst: DFT,
  } as Record<EndpointType, string[]>,
  languageDetect: "",
}, (set) => ({
  setLanguage: (key: EndpointType, newLang: string) =>
    set((state) => ({
      languageRecords: {
        ...state.languageRecords,
        [key]: uniq([newLang, ...state.languageRecords[key]]).slice(0, CNT + 1),
      },
    })),
  setLanguageDetect: (lang: string) => set({ languageDetect: lang }),
})), { name: "languages", storage: createJSONStorage(() => localStorage) }));

/**
 * 最近使用语言(不包含 auto, 只读)
 */
export const useLanguageRecordsReadonly = (key: EndpointType): string[] => {
  const { languageRecords } = useLanguageStore();
  return languageRecords[key].filter((item) => item !== "auto").slice(0, CNT);
};

/**
 * 当前语言, 在 set 时, 更新最近使用的语言
 */
export const useLanguageCurrent = (key: EndpointType): [string, (newLang: string) => void] => {
  const { languageRecords, setLanguage } = useLanguageStore();
  const currentLang = languageRecords[key].find((item) => (key === "src" ? item : item !== "auto")) || "cmn";
  return [currentLang, (newLang) => setLanguage(key, newLang)];
};
