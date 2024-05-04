import { SyntheticEvent, useState } from "react";
import { createRoot } from "react-dom/client";
import { Alert, AlertColor, Snackbar } from "@mui/material";

const GLOBAL_MESSAGE_DOM_ID = "message"

type SnackbarNodeProps = {
  content: string
  duration?: number
  severity?: AlertColor
}

function SnackbarNode({ content, duration = 1500, severity = "info" }: SnackbarNodeProps) {
  const [open, setOpen] = useState(true)
  const handleClose = (_: SyntheticEvent | Event, reason?: string) => reason === "clickaway" || setOpen(false)

  return (
    <Snackbar open={open} autoHideDuration={duration} anchorOrigin={{ vertical: "top", horizontal: "right" }} onClose={handleClose}>
      <Alert severity={severity} variant="filled" elevation={6} onClose={handleClose}>
        {content}
      </Alert>
    </Snackbar>
  )
}

function Message(props: SnackbarNodeProps) {
  document.getElementById(GLOBAL_MESSAGE_DOM_ID)?.remove()
  const dom = document.createElement("div")
  dom.id = GLOBAL_MESSAGE_DOM_ID
  const snackbarNode = <SnackbarNode {...props} />
  createRoot(dom).render(snackbarNode)
  document.body.appendChild(dom)
}

Message.success = (content = "", duration?: number) => Message({ content, duration, severity: "success" })
Message.info = (content = "", duration?: number) => Message({ content, duration, severity: "info" })
Message.warning = (content = "", duration?: number) => Message({ content, duration, severity: "warning" })
Message.error = (content = "", duration?: number) => Message({ content, duration, severity: "error" })

export default Message
