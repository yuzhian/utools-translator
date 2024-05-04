import { Dispatch, forwardRef, SetStateAction, useImperativeHandle, useRef, useState } from "react";
import { AppBar, AppBarProps, Box, ClickAwayListener, Divider, Fade, IconButton, Paper, Popper, Tab, Tabs, Typography } from "@mui/material";
import { Adjust } from "@mui/icons-material";
import { onEscape } from "/src/util/keyboard.ts";

export interface ComponentHubExposed {
  setActive: Dispatch<SetStateAction<string | false>>
}

interface ComponentHubProps {
  components?: Array<ComponentProps & { fullScreen?: boolean }>
}

const ComponentHub = forwardRef<ComponentHubExposed, ComponentHubProps & AppBarProps>(({ components, ...props }, ref) => {
  const [active, setActive] = useState<string | false>(false)
  const anchorRef = useRef<HTMLDivElement>(null)
  const popperRef = useRef<HTMLDivElement>(null)

  useImperativeHandle(ref, () => ({
    setActive: value => setActive(value)
  }))

  return <ClickAwayListener onClickAway={() => setActive(false)}>
    <AppBar onKeyDown={onEscape(() => setActive(false))} {...props}>
      <Divider />
      <Tabs ref={anchorRef} value={active}>
        {components?.map(({ key, name }) =>
          <Tab key={key} value={key} label={name} onClick={() => setActive(key === active ? false : key)} />
        )}
      </Tabs>

      <Popper open={!!active} anchorEl={anchorRef.current} transition placement="top">
        {({ TransitionProps }) => <Fade {...TransitionProps}>
          <Paper ref={popperRef} elevation={0} tabIndex={0} sx={{ outline: "none" }}>
            {components?.map(({ key, name, element, fullScreen }) =>
              <Box key={key} sx={{ display: key === active ? "block" : "none", height: `calc(${fullScreen ? 100 : 50}vh - 48px)`, width: "100vw" }}>
                <Divider />
                <Box sx={{ display: "flex", justifyContent: "space-between", px: 2, py: 1 }}>
                  <Typography variant="subtitle1" lineHeight="40px">
                    {name}
                  </Typography>
                  <IconButton onClick={() => setActive(false)}>
                    <Adjust />
                  </IconButton>
                </Box>
                <Divider />
                <Box height={`calc(${fullScreen ? 100 : 50}vh - 104px)`} overflow="auto">
                  {element}
                </Box>
              </Box>
            )}
          </Paper>
        </Fade>
        }
      </Popper>
    </AppBar>
  </ClickAwayListener>
})

export default ComponentHub
