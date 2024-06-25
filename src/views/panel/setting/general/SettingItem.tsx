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
  const [expanded, setExpanded] = useState(false)
  return <>
    <ListItem>
      <ListItemText primary={primary} secondary={secondary} />
      {children}
      {collapse && <ExpandMore expand={expanded} onClick={() => setExpanded(!expanded)} />}
    </ListItem>
    {collapse && <Collapse in={expanded} unmountOnExit sx={{ margin: "0 24px" }}>{collapse}</Collapse>}
  </>
}

export default SettingItem
