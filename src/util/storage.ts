import { createJSONStorage } from "jotai/utils";

const rawStorage = window.utools?.dbStorage || localStorage

export const load = <T>(key: string, dft: T) => rawStorage.getItem(key) ? JSON.parse(rawStorage.getItem(key)) : dft

export const storage = <T>() => createJSONStorage<T>(() => rawStorage)
