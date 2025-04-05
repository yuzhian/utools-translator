import { create } from "zustand";
import { combine, createJSONStorage, persist } from "zustand/middleware";
import { invert, pick } from "lodash";
import { allActions } from "/src/plugins/action";

export interface ActionKeybinding {
  action: string
  keybinding: string
}

const dftList = allActions
  .flatMap(group => group.actions)
  .map(({ key, preset }) => ({ action: key, keybinding: preset }))

export const useKeybindingStore = create(persist(combine({ actionKeybindingList: dftList }, (set) => ({
  setKeybinding: (by: Record<string, string>) => set((state) => ({
    actionKeybindingList: state.actionKeybindingList.map(item =>
      Object.prototype.hasOwnProperty.call(by, item.action) ? { ...item, keybinding: by[item.action] } : item
    ),
  })),
})), { name: "keybinding", storage: createJSONStorage(() => localStorage) }));

export const useActionKeybindingMap = () => {
  const { actionKeybindingList } = useKeybindingStore(state => state);
  const dftMap = Object.fromEntries(dftList.map(item => [item.action, item.keybinding]));
  const stoMap = Object.fromEntries(actionKeybindingList.map(item => [item.action, item.keybinding]));
  return { ...dftMap, ...pick(stoMap, Object.keys(dftMap)) };
};

export const useKeybindingActionMap = () => {
  const actionKeybindingMap = useActionKeybindingMap();
  return invert(actionKeybindingMap);
};
