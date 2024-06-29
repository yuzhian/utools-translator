import { ReactNode, useState } from "react";
import { Collapse, ListItem, ListItemText } from "@mui/material";
import ExpandMore from "/src/components/ExpandMore.tsx";

interface SettingItemProps {
  primary: ReactNode
  secondary?: ReactNode
  children?: ReactNode
  collapse?: ReactNode
}

const SettingItem = ({ primary, secondary, children, collapse }: SettingItemProps) => {
  const [open, setOpen] = useState(false)
  return <>
    <ListItem>
      <ListItemText primary={primary} secondary={secondary} />
      {children}
      {collapse && <ExpandMore expand={open} onClick={() => setOpen(!open)} />}
    </ListItem>
    {collapse && <Collapse in={open} unmountOnExit sx={{ margin: "0 24px" }}>{collapse}</Collapse>}
  </>
}

export default SettingItem
