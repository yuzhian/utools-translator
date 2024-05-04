import { useEffect } from "react";
import { tinykeys } from "tinykeys";
import mitt, { EventType, Handler } from "mitt";
import { mapValues } from "lodash";

// 全部的事件项目
export { allActions } from "./configuration.ts";

const emitter = mitt()

// 监听键盘事件, 推送操作事件
export const useShortcutEmit = (target: Window | HTMLElement, keybindingActionMap: Record<string, string>) => {
  useEffect(() => tinykeys(target, mapValues(keybindingActionMap, value => (event: KeyboardEvent) => {
    event.preventDefault()
    event.stopPropagation()
    emitter.emit(value)
  })), [target, keybindingActionMap])
}

// 订阅操作事件
export const useSubscription = (events: Record<EventType, Handler>) =>
  useEffect(() => {
    const eventEntries = Object.entries(events)
    eventEntries.forEach(([eventName, handler]) => emitter.on(eventName, handler))
    return () => eventEntries.forEach(([eventName, handler]) => emitter.off(eventName, handler))
  }, [events])
