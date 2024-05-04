import { useState } from "react";
import { Box, Divider, List, ListItem, ListItemButton, ListItemText } from "@mui/material";

interface RecordsPanelProps {
  components?: Array<ComponentProps>
}

const RecordsPanel = ({ components }: RecordsPanelProps) => {
  const [active, setActive] = useState<string | false>(components?.[0]?.key || false)

  return <Box display="flex">
    <List sx={{ width: "200px" }}>
      {components?.map(({ key, name }) => (
        <ListItem key={key} disablePadding>
          <ListItemButton selected={active === key} onClick={() => setActive(key)}>
            <ListItemText primary={name} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
    <Divider orientation="vertical" flexItem />
    {components?.map(({ key, element }) => (
      <Box key={key} display={active === key ? "block" : "none"} width="100%" height="calc(100vh - 104px)" overflow="auto">
        {element}
      </Box>
    ))}
  </Box>
}

export default RecordsPanel
