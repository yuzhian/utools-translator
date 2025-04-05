import { ReactNode } from "react";
import { Grid } from "@mui/material";
import { GridProps } from "@mui/material/Grid";

interface TranslateContainerProps {
  children: [ReactNode, ReactNode]
}

const MainContainer = ({ children: [source, target], ...props }: TranslateContainerProps & GridProps) => {
  return <Grid container {...props}>
    <Grid size={6}>
      {source}
    </Grid>
    <Grid size={6}>
      {target}
    </Grid>
  </Grid>
}

export default MainContainer
