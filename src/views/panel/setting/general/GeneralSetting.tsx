import { useRecoilState } from "recoil";
import { List, ListSubheader, Switch, TextField } from "@mui/material";
import { GlobalProps, globalPropsState } from "/src/store/global";
import SettingItem from "./SettingItem.tsx";
import { PreferencesOptional, PreferencesSelected } from "/src/views/panel/setting/general/PreferencesSetting.tsx";

const GeneralSetting = () => {
  const [globalProps, setGlobalProps] = useRecoilState(globalPropsState)
  const updatePartial = (props: Partial<GlobalProps>) => {
    setGlobalProps({ ...globalProps, ...props })
  }

  return <List>
    <ListSubheader>自动翻译</ListSubheader>

    <SettingItem title="进入插件时自动翻译">
      <Switch
        checked={globalProps.autoTranslateOnPluginEnter}
        onChange={event => updatePartial({ autoTranslateOnPluginEnter: event.target.checked })}
      />
    </SettingItem>

    <SettingItem title="输入自动翻译">
      <Switch
        checked={globalProps.autoTranslateOnInput}
        onChange={event => updatePartial({ autoTranslateOnInput: event.target.checked })}
      />
    </SettingItem>

    <SettingItem title="输入自动翻译延迟(ms)">
      <TextField
        value={globalProps.waitOnInputTranslate}
        type="number"
        variant="standard"
        onChange={event => updatePartial({ waitOnInputTranslate: Number(event.target.value) })}
      />
    </SettingItem>

    <ListSubheader>其他配置</ListSubheader>

    <SettingItem title="语言优先级列表" collapse={<PreferencesOptional preferences={globalProps.languagePreferences}
      onChange={value => updatePartial({ languagePreferences: value })} />}>
      <PreferencesSelected preferences={globalProps.languagePreferences}
        onChange={value => updatePartial({ languagePreferences: value })} />
    </SettingItem>

    <SettingItem title="历史记录保留条数">
      <TextField
        value={globalProps.historyRecordCount}
        type="number"
        variant="standard"
        onChange={event => updatePartial({ historyRecordCount: Number(event.target.value) })}
      />
    </SettingItem>
  </List>
}

export default GeneralSetting
