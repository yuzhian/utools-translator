import { ReactNode, useState } from "react";
import { Collapse, IconButton, ListItem, ListItemText } from "@mui/material";
import { KeyboardArrowDown } from "@mui/icons-material";

interface SettingItemProps {
  title: string
  children?: ReactNode
  collapse?: ReactNode
}

const SettingItem = ({ title, children, collapse }: SettingItemProps) => {
  const [open, setOpen] = useState(false)
  return <>
    <ListItem>
      <ListItemText primary={title} />
      {children}
      {collapse && <IconButton onClick={() => setOpen(!open)}>
        <KeyboardArrowDown sx={{
          transition: theme => theme.transitions.create("transform", { duration: theme.transitions.duration.shortest }),
          transform: open ? "rotate(0deg)" : "rotate(90deg)"
        }} />
      </IconButton>}
    </ListItem>
    {collapse && <Collapse in={open} unmountOnExit sx={{ margin: "0 24px" }}>{collapse}</Collapse>}
  </>
}

export default SettingItem
