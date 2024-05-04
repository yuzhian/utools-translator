import { atom, DefaultValue, selector, selectorFamily } from "recoil";
import persistence from "/src/util/persistence.ts";
import { serviceModules } from "/src/plugins/service";

/**
 * 服务列表(存储)
 */
const servicesState = atom<Array<ServiceProps>>({
  key: "servicesState",
  default: Object.keys(serviceModules).map(key => ({ key: key, enable: true })),
  effects: [persistence(`services`)]
})

/**
 * 服务列表
 */
export const servicePropsListState = selector<Array<ServiceProps>>({
  key: "servicePropsListState",
  get: ({ get }) => (Object.keys(serviceModules).map(key => get(servicesState).find(item => item.key === key) ?? ({ key: key, enable: true }))),
  set: ({ set }, newValue) => {
    if ((newValue instanceof DefaultValue) || !newValue) return
    set(servicesState, newValue)
  }
})

export const servicePropsState = selectorFamily<ServiceProps | undefined, string>({
  key: "servicePropsState",
  get: (serviceKey) => ({ get }) => get(servicePropsListState).find(({ key }) => key === serviceKey)
})

/**
 * 启用的服务列表(KEY)
 */
export const enabledServiceKeysState = selector<Array<string>>({
  key: "enabledServiceKeysState",
  get: ({ get }) => get(servicePropsListState).filter(({ enable }) => enable).map(({ key }) => key)
})

/**
 * 当前服务(KEY)
 */
export const currentServiceKeyState = atom<string>({
  key: "currentServiceKeyState",
  default: Object.keys(serviceModules)[0],
  effects: [persistence(`service`)]
})
