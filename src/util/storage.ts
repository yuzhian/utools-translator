import { createJSONStorage } from "jotai/utils";

export const rawStorage = window.utools?.dbStorage || localStorage

export const load = <T>(key: string, dft: T) => rawStorage.getItem(key) ? JSON.parse(rawStorage.getItem(key)) : dft

export const save = <T>(key: string, value: T) => rawStorage.setItem(key, JSON.stringify(value))

export const remove = (key: string) => rawStorage.removeItem(key)

export const storage = <T>() => createJSONStorage<T>(() => rawStorage)
