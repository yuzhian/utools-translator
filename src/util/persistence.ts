import { AtomEffect } from "recoil";

const storage = window.utools?.dbStorage || localStorage

function defaultInit<T>(savedValue: T, setSelf: (v: T) => void) {
  setSelf(savedValue)
}

const persistence = <T>(key: string, init = defaultInit): AtomEffect<T> =>
  ({ setSelf, onSet }) => {
    const storageValue = storage.getItem(key)
    if (storageValue) {
      init(JSON.parse(storageValue), setSelf)
    }

    onSet(newValue => {
      storage.setItem(key, JSON.stringify(newValue))
    })
  }

export default persistence
