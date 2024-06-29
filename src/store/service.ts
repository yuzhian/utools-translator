import { atom, DefaultValue, selector, selectorFamily } from "recoil";
import persistence from "/src/util/persistence.ts";
import { defaultServiceProps, serviceModules } from "/src/plugins/service";
import { keyBy, merge, pick } from "lodash";

/**
 * 服务列表(存储)
 */
const servicesState = atom<Array<ServiceProps>>({
  key: "servicesState",
  default: [],
  effects: [persistence(`services`)]
})

/**
 * 服务列表
 */
export const servicePropsListState = selector<Array<ServiceProps>>({
  key: "servicePropsListState",
  get: ({ get }) => pickProps(defaultServiceProps, get(servicesState)),
  set: ({ set }, newValue) => {
    if ((newValue instanceof DefaultValue) || !newValue) return
    set(servicesState, newValue)
  }
})

export const servicePropsState = selectorFamily<ServiceProps | undefined, string>({
  key: "servicePropsState",
  get: (serviceKey) => ({ get }) => get(servicePropsListState).find(({ key }) => key === serviceKey),
  set: (serviceKey) => ({ set }, newValue) => {
    if ((newValue instanceof DefaultValue) || !newValue) return
    set(servicePropsListState, (list) => list.map(props => props.key === serviceKey ? newValue : props))
  }
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
  effects: [persistence("service")]
})

/**
 * 组装配置参数
 */
function pickProps(dft: ServiceProps[], cfg: ServiceProps[]): Array<ServiceProps> {
  const cfgMap = keyBy(cfg, "key")
  return dft.map(item => (pick(merge({}, item, cfgMap[item.key]), Object.keys(item)) as ServiceProps))
}
