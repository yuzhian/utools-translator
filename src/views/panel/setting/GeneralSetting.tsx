import { useState } from "react";
import { useRecoilState } from "recoil";
import { closestCenter, DndContext, DragEndEvent, PointerSensor, UniqueIdentifier, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, horizontalListSortingStrategy, SortableContext, useSortable } from "@dnd-kit/sortable";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import {
  Button,
  ButtonGroup,
  ButtonProps,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Switch,
  TextField
} from "@mui/material";
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
  const [search, setSearch] = useState("")

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

  // 处理拖拽
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))
  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return
    const index = (id: UniqueIdentifier) => preferences.findIndex(key => id === key)
    onChange(arrayMove(preferences, index(active.id), index(over.id)))
  }

  const SortableButtonItem = ({ ...props }: ButtonProps) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.value?.toString() ?? "" })
    return <Button ref={setNodeRef} {...attributes} {...listeners} sx={{ transform: CSS.Transform.toString(transform), transition }} {...props} />
  }

  return <>
    <ListItem>
      {/* 左侧描述文本 */}
      <ListItemText primary="语言优先级列表" />

      {/* 右侧已选 */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToHorizontalAxis]}>
        <SortableContext items={preferences.map(id => ({ id }))} strategy={horizontalListSortingStrategy}>
          <ButtonGroup variant="outlined">
            {preferences.map(languageKey =>
              <SortableButtonItem key={languageKey} value={languageKey} variant="text" color="inherit" endIcon={
                <Cancel fontSize="small" onClick={() => handleDelete(languageKey)} />
              }>{getChineseByKey(languageKey)}</SortableButtonItem>
            )}
          </ButtonGroup>
        </SortableContext>
      </DndContext>

      {/* 右侧可选 */}
      <IconButton onClick={() => setOpen(!open)}>
        <KeyboardArrowDown sx={{
          transition: theme => theme.transitions.create("transform", { duration: theme.transitions.duration.shortest }),
          transform: open ? "rotate(0deg)" : "rotate(90deg)"
        }} />
      </IconButton>
    </ListItem>

    {/* 下拉更多列表 */}
    <Collapse in={open} timeout="auto" unmountOnExit sx={{ margin: "0 24px" }}>
      <TextField value={search} variant="standard" fullWidth onChange={event => setSearch(event.target.value)} />
      <List>
        {languages.slice(1)
          .filter(({ key }) => !preferences.includes(key))
          .filter(item => item.chinese.includes(search))
          .map(({ key, chinese }) => <ListItemButton key={key} onClick={() => handleAdd(key)} sx={{ display: "inline-block" }}>
            {chinese}
          </ListItemButton>)
        }
      </List>
    </Collapse>
  </>
}

export default GeneralSetting
