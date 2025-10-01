import { useAtom } from "jotai";
import { List, ListSubheader, Switch, TextField } from "@mui/material";
import { generalAtom, GeneralProps } from "/src/store/general.ts";
import SettingItem from "./SettingItem.tsx";
import { PreferencesOptional, PreferencesSelected } from "/src/views/panel/setting/general/PreferencesSetting.tsx";

const GeneralSetting = () => {
  const [general, setGeneral] = useAtom(generalAtom)
  const updatePartial = (props: Partial<GeneralProps>) => {
    setGeneral({ ...general, ...props })
  }

  return <List>
    <ListSubheader>自动翻译</ListSubheader>

    <SettingItem primary="自动翻译" secondary="输入 | 切换服务 | 切换语言 | 进入应用时，自动执行翻译">
      <Switch
        checked={general.autoTranslate}
        onChange={event => updatePartial({ autoTranslate: event.target.checked })}
      />
    </SettingItem>

    <SettingItem primary="输入防抖" secondary="毫秒，自动翻译启用时生效">
      <TextField
        value={general.inputDebounceWait}
        type="number"
        variant="standard"
        onChange={event => updatePartial({ inputDebounceWait: Number(event.target.value) })}
      />
    </SettingItem>

    <SettingItem primary="语言优先级列表" secondary="若目标语言与原文语言一致，按优先级自动切换"
      collapse={<PreferencesOptional preferences={general.languagePreferences} onChange={value => updatePartial({ languagePreferences: value })} />}>
      <PreferencesSelected preferences={general.languagePreferences}
        onChange={value => updatePartial({ languagePreferences: value })} />
    </SettingItem>

    <ListSubheader>其他配置</ListSubheader>

    <SettingItem primary="历史记录保留条数">
      <TextField
        value={general.historyRecordCount}
        type="number"
        variant="standard"
        onChange={event => updatePartial({ historyRecordCount: Number(event.target.value) })}
      />
    </SettingItem>
  </List>
}

export default GeneralSetting
