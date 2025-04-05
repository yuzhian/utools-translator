import { create } from "zustand";
import { combine, createJSONStorage, persist } from "zustand/middleware";

export const useRecordStore = create(persist(combine({ records: [] as string[] }, (set) => ({
  addRecord: (by: string) => set((state) => ({
    records: [by].concat(state.records.filter((item) => !by.includes(item))),
  })),
  removeRecord: (by: number) => set((state) => ({
    records: state.records.filter((_, i) => i !== by),
  }))
})), { name: "records", storage: createJSONStorage(() => localStorage) }));
