import { Fragment, useRef, useState } from "react";
import { useAtom } from "jotai";
import { Chip, List, ListItem, ListItemText, ListSubheader } from "@mui/material";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import { allActions } from "/src/plugins/action";
import { actionsAtom } from "/src/store/keybinding";
import KeybindingDialog, { KeybindingDialogExposed } from "/src/components/KeybindingDialog";

const ShortcutSetting = () => {
  const [actionKeybindingMap, setActionKeybindingMap] = useAtom(actionsAtom)
  const [actionKey, setActionKey] = useState<string | false>(false)

  const putKeybindingProp = (keybinding: string, actionKey: string) => {
    const _actionKeybindingMap = { ...actionKeybindingMap }
    _actionKeybindingMap[actionKey] = keybinding
    setActionKeybindingMap(_actionKeybindingMap)
  }


  const ref = useRef<KeybindingDialogExposed>(null)
  const openKeybindingDialog = (actionKey: string) => {
    setActionKey(actionKey)
    ref.current?.open(actionKeybindingMap[actionKey])
  }
  const handleConfirm = (keybinding: string) => {
    if (false === actionKey) return
    putKeybindingProp(keybinding, actionKey)
    setActionKey(false)
  }

  return (
    <List>
      {allActions.map(({ text: groupText, key: groupKey, actions }) =>
        <Fragment key={groupKey}>
          <ListSubheader>{groupText}</ListSubheader>
          {actions.map(({ text: actionText, key: actionKey }, index) =>
            <ListItem key={index}>
              <ListItemText primary={actionText} />
              <Chip label={actionKeybindingMap[actionKey]} deleteIcon={<KeyboardIcon />} onDelete={() => openKeybindingDialog(actionKey)} />
            </ListItem>
          )}
        </Fragment>
      )}

      <KeybindingDialog ref={ref} onConfirm={handleConfirm} onClose={() => setActionKey(false)} />
    </List>
  )
}

export default ShortcutSetting
