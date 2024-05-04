import { useState } from "react";
import { useRecoilState } from "recoil";
import { Collapse, IconButton, List, ListItem, ListItemButton, ListItemText, ListSubheader, Switch, TextField, useTheme } from "@mui/material";
import { Cancel, KeyboardArrowDown } from "@mui/icons-material";
import Message from "/src/components/Message";
import { GlobalProps, globalPropsState } from "/src/store/global";
import languages, { getChineseByKey } from "/src/plugins/language";

const GeneralSetting = () => {
  const [globalProps, setGlobalProps] = useRecoilState(globalPropsState)
  const updatePartial = (props: Partial<GlobalProps>) => {
    1
    setGlobalProps({ ...globalProps, ...props })
  }

  return <List>
    <ListSubheader>自动翻译</ListSubheader>
    <ListItem>
      <ListItemText primary="进入插件时自动翻译" />
      <Switch
        checked={globalProps.autoTranslateOnPluginEnter}
        onChange={(event) => updatePartial({ autoTranslateOnPluginEnter: event.target.checked })}
      />
    </ListItem>

    <ListItem>
      <ListItemText primary="输入自动翻译" />
      <Switch
        checked={globalProps.autoTranslateOnInput}
        onChange={(event) => updatePartial({ autoTranslateOnInput: event.target.checked })}
      />
    </ListItem>

    <ListItem>
      <ListItemText primary="输入自动翻译延迟(ms)" />
      <TextField
        value={globalProps.waitOnInputTranslate}
        type="number"
        variant="standard"
        onChange={(event) => updatePartial({ waitOnInputTranslate: Number(event.target.value) })}
      />
    </ListItem>

    <ListSubheader>其他配置</ListSubheader>
    <LanguagePreferences
      preferences={globalProps.languagePreferences}
      onChange={value => updatePartial({ languagePreferences: value })} />

    <ListItem>
      <ListItemText primary="历史记录保留条数" />
      <TextField
        value={globalProps.historyRecordCount}
        type="number"
        variant="standard"
        onChange={(event) => updatePartial({ historyRecordCount: Number(event.target.value) })}
      />
    </ListItem>
  </List>
}

const LanguagePreferences = ({ preferences, onChange }: { preferences: string[], onChange: (languages: string[]) => void }) => {
  const [open, setOpen] = useState(false)
  const theme = useTheme()

  const handleAdd = (languageKey: string) => {
    if (preferences.length >= 4) {
      return Message.info("最多放置4个")
    }
    onChange([...preferences, languageKey])
  }
  const handleDelete = (languageKey: string) => {
    if (preferences.length <= 2) {
      return Message.info("最少保留2个")
    }
    onChange(preferences.filter(item => item !== languageKey))
  }

  return <>
    <ListItem>
      <ListItemText primary="语言偏好顺序" />
      {/* 已选 */}
      <List sx={{ display: "inline-block" }}>
        {preferences.map(languageKey =>
          <ListItem key={languageKey} sx={{ display: "inline-block", width: "auto" }} secondaryAction={
            <IconButton edge="end" size="small" onClick={() => handleDelete(languageKey)}>
              <Cancel fontSize="small" />
            </IconButton>
          } disablePadding>
            <ListItemButton>{getChineseByKey(languageKey)}</ListItemButton>
          </ListItem>
        )}
      </List>

      {/* 可选 */}
      <IconButton onClick={() => setOpen(!open)}>
        <KeyboardArrowDown sx={{
          transition: theme.transitions.create("transform", { duration: theme.transitions.duration.shortest }),
          transform: open ? "rotate(0deg)" : "rotate(90deg)"
        }} />
      </IconButton>
    </ListItem>

    <Collapse in={open} timeout="auto" unmountOnExit sx={{ margin: "0 24px" }}>
      <List>
        {languages.slice(1).filter(({ key }) => !preferences.includes(key)).map(({ key, chinese }) => (
          <ListItemButton key={key} onClick={() => handleAdd(key)} sx={{ display: "inline-block" }}>
            {chinese}
          </ListItemButton>
        ))}
      </List>
    </Collapse>
  </>
}

export default GeneralSetting
