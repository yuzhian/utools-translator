import { atom } from "jotai";
import { invert, pick } from "es-toolkit";
import { atomWithStorage } from "jotai/utils";
import { storage } from "/src/util/storage";
import { allActions } from "/src/plugins/action";

interface ActionKeybinding {
  action: string
  keybinding: string
}

const defaultActionKeybindingList: ActionKeybinding[] = allActions
  .flatMap(group => group.actions)
  .map(({ key, preset }) => ({
    action: key, keybinding: preset
  }))

const keybindingStorage = atomWithStorage("keybinding", defaultActionKeybindingList, storage<ActionKeybinding[]>());

// { action: keybinding }
export const actionsAtom = atom(
  (get) => {
    const dftMap = Object.fromEntries(defaultActionKeybindingList.map(item => [item.action, item.keybinding]))
    const stoMap = Object.fromEntries(get(keybindingStorage).map(item => [item.action, item.keybinding]))
    return Object.assign({}, dftMap, pick(stoMap, Object.keys(dftMap)))
  },
  (get, set, newValue: Record<string, string>) => {
    if (!newValue) return
    set(keybindingStorage, get(keybindingStorage).map(item => Object.prototype.hasOwnProperty.call(newValue, item.action)
      ? { ...item, keybinding: newValue[item.action] }
      : item
    ))
  },
)

// { keybinding: action }
export const keybindingsAtom = atom((get) => invert(get(actionsAtom)))
