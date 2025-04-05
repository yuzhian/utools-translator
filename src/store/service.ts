import { create } from "zustand";
import { combine, createJSONStorage, persist } from "zustand/middleware";
import { keyBy, merge, pick } from "lodash";
import { defaultServiceProps, serviceModules } from "/src/plugins/service";

/**
 * 组装配置参数
 */
function pickProps(dft: ServiceProps[], cfg: ServiceProps[]): Array<ServiceProps> {
  const cfgMap = keyBy(cfg, "key")
  return dft.map(item => (pick(merge({}, item, cfgMap[item.key]), Object.keys(item)) as ServiceProps))
}

export const useServiceStore = create(persist(combine({ services: [] as ServiceProps[], currentServiceKey: Object.keys(serviceModules)[0], }, (set) => ({
  setServices: (newServices: ServiceProps[]) => set({ services: newServices }),
  setService: (serviceKey: string, newProps: ServiceProps) => set((state) => ({
    services: state.services.map((props) => props.key === serviceKey ? newProps : props)
  })),
  setCurrentServiceKey: (key: string) => set({ currentServiceKey: key }),
})), { name: "services", storage: createJSONStorage(() => localStorage) }));

/**
 * 获取处理后的服务列表
 */
export const useServicePropsList = () => {
  const { services } = useServiceStore();
  return pickProps(defaultServiceProps, services);
};

/**
 * 获取单个服务信息
 */
export const useServiceProps = (serviceKey: string) => {
  return useServicePropsList().find(({ key }) => key === serviceKey);
};

/**
 * 获取启用的服务 key 列表
 */
export const useEnabledServiceKeys = () => {
  return useServicePropsList().filter(({ enable }) => enable).map(({ key }) => key);
};

/**
 * 获取当前服务 key
 */
export const useCurrentServiceKey = () => {
  return useServiceStore((state) => state.currentServiceKey);
};
