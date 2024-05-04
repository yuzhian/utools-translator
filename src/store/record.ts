import { atom, DefaultValue, selector } from "recoil";
import persistence from "/src/util/persistence.ts";


export const recordsState = atom<Array<string>>({
  key: "recordsState",
  default: [],
  effects: [persistence("records")]
})

export const recordState = selector<string>({
  key: "recordState",
  get: ({ get }) => get(recordsState)[0],
  set: ({ get, set }, record) => {
    if ((record instanceof DefaultValue) || !record) return
    set(recordsState, [record].concat(get(recordsState).filter(item => !record.includes(item))))
  }
})
