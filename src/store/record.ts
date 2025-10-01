import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { storage } from "/src/util/storage.ts";

export const recordsAtom = atomWithStorage("records", [], storage<Array<string>>());

export const recordAtom = atom(
  (get) => get(recordsAtom)[0],
  (get, set, record: string) => {
    if (!record) return
    set(recordsAtom, [record].concat(get(recordsAtom).filter(item => !record.includes(item))))
  }
)
