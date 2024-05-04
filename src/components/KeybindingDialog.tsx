import React, { forwardRef, useEffect, useImperativeHandle } from "react"
import { Box, Button, Chip, ClickAwayListener, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material"

const KEYBINDING_MODIFIER_KEYS: string[] = ["Control", "Alt", "Shift"]
const SEPARATOR = "+"
const parseEventToKeybinding = (event: KeyboardEvent): string => {
  if (KEYBINDING_MODIFIER_KEYS.includes(event.key)) {
    return event.key
  }
  const mods = KEYBINDING_MODIFIER_KEYS.filter(mod => event.getModifierState(mod))
  const key = event.key === "" ? "Space" : event.key
  const separator = mods.length > 0 ? SEPARATOR : ""
  return mods.join(SEPARATOR) + separator + key
}

interface KeybindingDialogProps {
  onConfirm?: (keybinding: string) => void
  onClose?: () => void
}

export interface KeybindingDialogExposed {
  open: (initialValue: string) => void
}

const KeybindingDialog = forwardRef<KeybindingDialogExposed, KeybindingDialogProps>(({ onConfirm, onClose }, ref) => {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  useImperativeHandle(ref, () => ({
    open: (initialValue: string) => {
      setOpen(true)
      setValue(initialValue)
    }
  }))
  const handleClose = () => {
    setOpen(false)
    onClose?.()
  }
  const handleConfirm = () => {
    onConfirm?.(value)
    handleClose()
  }

  const handleKeydown = (event: KeyboardEvent) => {
    event.preventDefault()
    setValue(parseEventToKeybinding(event))
  }
  useEffect(() => {
    if (!open) return
    window.addEventListener("keydown", handleKeydown)
    return () => {
      window.removeEventListener("keydown", handleKeydown)
    }
  }, [open])

  return <ClickAwayListener onClickAway={() => setOpen(false)}>
    <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { width: 400 } }}>
      <DialogTitle>
        激活快捷键
      </DialogTitle>

      <DialogContent>
        <Typography variant="subtitle2">
          按组合键以更改此快捷键
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Chip label={value} sx={{ m: 4 }} />
        </Box>

        <Typography variant="body2" color="text.secondary">
          只有以 <b>Control</b> 或 <b>Alt</b> 开头的快捷键才有效。
        </Typography>
        <Typography variant="body2" color="text.secondary">
          按住 <b>Backspace</b> 可清除快捷键。
        </Typography>
      </DialogContent>

      <DialogActions sx={{ display: "flex" }}>
        <Button variant="contained" disableElevation sx={{ width: "100%" }} onClick={handleConfirm}>保存</Button>
        <Button variant="outlined" disableElevation sx={{ width: "100%" }} onClick={handleClose}>取消</Button>
      </DialogActions>
    </Dialog>
  </ClickAwayListener>
})

export default KeybindingDialog
