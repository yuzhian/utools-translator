import { atom } from "jotai";
import deepEqual from 'fast-deep-equal'
import { atomFamily, atomWithStorage } from "jotai/utils";
import { defaultServiceProps, serviceModules } from "/src/plugins/service";
import { load, storage } from "/src/util/storage";

/**
 * 服务列表(存储)
 */
export const servicesStorage = atomWithStorage<ServiceProps[]>("services", load("services", []), storage<ServiceProps[]>())

/**
 * 服务列表
 */
export const servicePropsListAtom = atom(
  (get) => ([
    // 过滤掉不存在的服务
    ...get(servicesStorage).filter(props => Object.keys(serviceModules).includes(props.key)),
    // 补充缺失的服务
    ...Object.keys(serviceModules).filter(key => !get(servicesStorage).map(props => props.key).includes(key)).map(key => defaultServiceProps(key)),
  ]),
  (_get, set, newValue: ServiceProps[]) => {
    set(servicesStorage, newValue)
  }
)

export const servicePropsFamily = atomFamily((serviceKey: string) => atom(
  (get) => get(servicesStorage).find(({ key }) => key === serviceKey) ?? defaultServiceProps(serviceKey),
  (get, set, newValue: ServiceProps) => {
    set(servicePropsListAtom, get(servicePropsListAtom).map(props => props.key === serviceKey ? newValue : props))
  }
), deepEqual)

/**
 * 启用的服务列表(KEY)
 */
export const enabledServiceKeysAtom = atom(
  (get) => get(servicePropsListAtom).filter(({ enable }) => enable).map(({ key }) => key)
)

/**
 * 当前服务(KEY)
 */
export const currentServiceKeyAtom = atomWithStorage("service", load("service", Object.keys(serviceModules)[0]), storage<string>())
