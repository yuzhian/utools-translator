import { PropsWithChildren } from "react";
import { createTheme, CssBaseline, ThemeOptions, ThemeProvider, useMediaQuery } from "@mui/material";

const themeOptions = (dark: boolean): ThemeOptions => ({
  palette: {
    mode: dark ? "dark" : "light",
  },
  components: {
    MuiListItemButton: {
      styleOverrides: {
        root: ({ theme }) => {
          return {
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
            "&.Mui-selected": {
              backgroundColor: theme.palette.action.selected,
            },
            "&.Mui-selected:hover": {
              backgroundColor: theme.palette.action.focus,
            },
          }
        },
      },
    },
  },
})

const GlobalTheme = ({ children }: PropsWithChildren) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)")
  const theme = createTheme(themeOptions(prefersDarkMode))

  return <ThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </ThemeProvider>
}

export default GlobalTheme
