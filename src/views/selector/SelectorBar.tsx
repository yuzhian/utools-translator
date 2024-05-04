import { ReactNode } from "react";
import { AppBar, AppBarProps, Divider, Grid } from "@mui/material";

interface SelectorBarProps {
  children: [ReactNode, ReactNode]
  onChange?: () => void
}

const SelectorBar = ({ children: [serviceTabs, languageTabs], ...props }: SelectorBarProps & AppBarProps) => {
  return <AppBar {...props}>
    <Grid item xs={6}>
      {serviceTabs}
      <Divider />
    </Grid>
    <Grid item xs={6}>
      {languageTabs}
      <Divider />
    </Grid>
  </AppBar>
}

export default SelectorBar
