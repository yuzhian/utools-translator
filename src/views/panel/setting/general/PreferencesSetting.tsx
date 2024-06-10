import { useState } from "react";
import { closestCenter, DndContext, DragEndEvent, PointerSensor, UniqueIdentifier, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, horizontalListSortingStrategy, SortableContext, useSortable } from "@dnd-kit/sortable";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import { Button, ButtonGroup, ButtonProps, List, ListItemButton, TextField } from "@mui/material";
import { Cancel } from "@mui/icons-material";
import languages, { getChineseByKey } from "/src/plugins/language";
import Message from "/src/components/Message.tsx";

// 语言优先级列表已选
export const PreferencesSelected = ({ preferences, onChange }: { preferences: string[], onChange: (languages: string[]) => void }) => {
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

  return <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToHorizontalAxis]}>
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
}

// 语言优先级列表可选
export const PreferencesOptional = ({ preferences, onChange }: { preferences: string[], onChange: (languages: string[]) => void }) => {
  const handleAdd = (languageKey: string) => {
    if (preferences.length >= 4) {
      return Message.info("最多放置4个")
    }
    onChange([...preferences, languageKey])
  }
  const [search, setSearch] = useState("")
  return <>
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
  </>
}
