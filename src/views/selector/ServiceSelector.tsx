import { SyntheticEvent } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { Tab, Tabs } from "@mui/material";
import { serviceModules } from "/src/plugins/service";
import { useSubscription } from "/src/plugins/action";
import { currentServiceKeyState, enabledServiceKeysState } from "/src/store/service.ts";
import { loopGet } from "/src/util/array.ts";

interface ServiceSelectorProps {
  onChange?: (serviceKey: string) => void
}

const ServiceSelector = ({ onChange }: ServiceSelectorProps) => {
  const enabledServiceKeys = useRecoilValue(enabledServiceKeysState)
  const [currentServiceKey, setCurrentServiceKey] = useRecoilState(currentServiceKeyState)
  const handleServiceKeyChange = (_: SyntheticEvent, value: string) => {
    setCurrentServiceKey(value)
    onChange?.(value)
  }

  useSubscription({
    servicePrev: () => setCurrentServiceKey(loopGet(enabledServiceKeys, enabledServiceKeys.indexOf(currentServiceKey), -1)),
    serviceNext: () => setCurrentServiceKey(loopGet(enabledServiceKeys, enabledServiceKeys.indexOf(currentServiceKey), 1)),
  })

  return <Tabs value={currentServiceKey} variant="scrollable" scrollButtons="auto" onChange={handleServiceKeyChange}>
    {enabledServiceKeys.map(serviceKey => <Tab key={serviceKey} value={serviceKey} label={serviceModules[serviceKey].name} />)}
  </Tabs>
}

export default ServiceSelector
