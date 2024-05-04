import { assign, invert, pick } from "lodash";
import { atom, DefaultValue, selector } from "recoil";
import persistence from "/src/util/persistence.ts";
import { allActions } from "/src/plugins/action";

export interface ActionKeybinding {
  action: string
  keybinding: string
}

const dftList = allActions
  .flatMap(group => group.actions)
  .map(({ key, preset }) => ({ action: key, keybinding: preset }))

const actionKeybindingListState = atom<Array<ActionKeybinding>>({
  key: "actionKeybindingListState",
  default: dftList,
  effects: [persistence("keybinding")]
})

export const actionKeybindingMapState = selector<Record<string, string>>({
  key: "actionKeybindingMapState",
  get: ({ get }) => {
    const dftMap = Object.fromEntries(dftList.map(item => [item.action, item.keybinding]))
    const stoMap = Object.fromEntries(get(actionKeybindingListState).map(item => [item.action, item.keybinding]))
    return assign({}, dftMap, pick(stoMap, Object.keys(dftMap)))
  },
  set: ({ set, get }, newValue) => {
    if ((newValue instanceof DefaultValue) || !newValue) return
    const updatedList = get(actionKeybindingListState).map(item => Object.prototype.hasOwnProperty.call(newValue, item.action)
      ? { ...item, keybinding: newValue[item.action] }
      : item
    )
    set(actionKeybindingListState, updatedList)
  },
})

export const keybindingActionMapState = selector<Record<string, string>>({
  key: "keybindingActionMapState",
  get: ({ get }) => invert(get(actionKeybindingMapState)),
})
