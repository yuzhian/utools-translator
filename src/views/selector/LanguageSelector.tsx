import { ReactNode, useMemo, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { Box, ClickAwayListener, Fade, Grid, List, ListItemButton, Paper, Popper, Tab, Tabs } from "@mui/material";
import languages, { getChineseByKey, getSupportsByService } from "/src/plugins/language";
import { useSubscription } from "/src/plugins/action";
import { languageCurrentState, languageDetectState, languageRecordsReadonlyState } from "/src/store/language.ts";
import { currentServiceKeyState } from "/src/store/service.ts";
import { globalPropsState } from "/src/store/global.ts";
import { onEscape } from "/src/util/keyboard.ts";
import { loopGet } from "/src/util/array.ts";
import ExpandMore from "/src/components/ExpandMore.tsx";

interface LanguageSelectorProps {
  onChange?: (params: Partial<LanguageProps>) => void
}

interface LanguagesOptionsProps {
  value: string
  supports: Array<string>
  onClick?: (value: string) => void
  onExpand?: (endpoint: EndpointType | false) => void
}

interface LanguageTabsProps extends LanguagesOptionsProps {
  // 原文语言 | 目标语言
  endpoint: EndpointType
  // 是否展开更多语言选项
  expand: EndpointType | false
  // 自动翻译
  auto?: boolean
  // 猜测语言的标识
  det?: string
  // 是否锁定, 此处仅用于显示
  lock?: boolean
}

const LanguageSelector = ({ onChange }: LanguageSelectorProps) => {
  const serviceKey = useRecoilValue(currentServiceKeyState)
  const [endpoint, setEndpoint] = useState<EndpointType | false>(false)

  const [srcLang, setSrcLang] = useRecoilState(languageCurrentState("src"))
  const [dstLang, setDstLang] = useRecoilState(languageCurrentState("dst"))
  const detLang = useRecoilValue(languageDetectState)
  const [globalProps, setGlobalProps] = useRecoilState(globalPropsState)

  const srcSupports = getSupportsByService(serviceKey)
  const dstSupports = getSupportsByService(serviceKey, srcLang === "auto" ? "" : srcLang)

  const handleSrcClick = (value: string) => {
    if (srcLang == value) {
      return
    }
    setSrcLang(value)
    onChange?.({ srcLang: value })
  }

  const handleDstClick = (value: string) => {
    if (dstLang === value) {
      setGlobalProps({ ...globalProps, autoSwitchDstLang: !globalProps.autoSwitchDstLang })
      return
    }
    setDstLang(value)
    onChange?.({ dstLang: value })
  }

  return <LanguageContainer open={!!endpoint} onClose={() => setEndpoint(false)} proper={endpoint && {
    "src": <LanguagesOptions value={srcLang} supports={srcSupports} onClick={handleSrcClick} onExpand={setEndpoint} />,
    "dst": <LanguagesOptions value={dstLang} supports={dstSupports} onClick={handleDstClick} onExpand={setEndpoint} />
  }[endpoint]}>
    <LanguageTabs endpoint="src" auto det={detLang} supports={srcSupports}
      value={srcLang} onClick={handleSrcClick}
      expand={endpoint} onExpand={setEndpoint} />
    <LanguageTabs endpoint="dst" supports={dstSupports}
      lock={!globalProps.autoSwitchDstLang}
      value={dstLang} onClick={handleDstClick}
      expand={endpoint} onExpand={setEndpoint} />
  </LanguageContainer>
}

interface LanguageContainerProps {
  open: boolean
  children: [ReactNode, ReactNode]
  proper?: ReactNode
  onClose?: () => void
}

const LanguageContainer = ({ children: [source, target], proper, open, onClose }: LanguageContainerProps) => {
  const popoverTargetRef = useRef<HTMLDivElement>(null)
  return <ClickAwayListener onClickAway={() => onClose?.()}>
    <Box onKeyDown={onEscape(onClose)}>
      <Grid ref={popoverTargetRef} container>
        <Grid item xs={6}>
          {source}
        </Grid>
        <Grid item xs={6}>
          {target}
        </Grid>
      </Grid>

      <Popper open={open} anchorEl={popoverTargetRef.current} transition placement="bottom">
        {({ TransitionProps }) => <Fade {...TransitionProps}>
          <Paper sx={{ maxHeight: "60vh", overflow: "auto" }}>
            {proper}
          </Paper>
        </Fade>}
      </Popper>
    </Box>
  </ClickAwayListener>
}

const LanguageTabs = ({ value, supports, onClick, onExpand, endpoint, expand, auto, det, lock }: LanguageTabsProps) => {
  // 组件内缓存一份语言使用记录, 当在最近使用(缓存已有)的语言内切换时, 不修改组件顺序
  const languageRecords = useRecoilValue(languageRecordsReadonlyState(endpoint))
  const [languageCaches, setLanguageCaches] = useState(auto ? ["auto", ...languageRecords] : languageRecords)

  const getLabel = (langKey: string) => {
    // 检测原文语言
    if (det && langKey === "auto") {
      const detLangChinese = getChineseByKey(det)
      return detLangChinese ? `检测到${detLangChinese}` : getChineseByKey(langKey)
    }
    // 锁定目标语言
    if (lock && langKey === value) {
      return getChineseByKey(langKey) + "✦"
    }
    return getChineseByKey(langKey)
  }

  useMemo(() => {
    // 切换语言时, 如果新的语言不在缓存中, 则重新给缓存赋值
    if (!languageCaches.includes(value)) {
      setLanguageCaches(auto ? ["auto", ...languageRecords] : languageRecords)
    }
  }, [auto, languageCaches, languageRecords, value])

  useSubscription({
    [endpoint + "LangPrev"]: () => onClick?.(loopGet(languageCaches, languageCaches.indexOf(value), -1)),
    [endpoint + "LangNext"]: () => onClick?.(loopGet(languageCaches, languageCaches.indexOf(value), 1)),
  })

  return <Box display="flex" justifyContent="space-between" alignItems="center">
    <Tabs value={value}>
      {languageCaches.map(langKey =>
        <Tab key={langKey} value={langKey} label={getLabel(langKey)} disabled={auto ? false : !supports?.includes(langKey)} onClick={() => onClick?.(langKey)}
        />)}
    </Tabs>
    <ExpandMore expand={endpoint === expand} onClick={() => onExpand?.(endpoint === expand ? false : endpoint)} />
  </Box>
}

const LanguagesOptions = ({ value, supports, onClick, onExpand }: LanguagesOptionsProps) => {
  const handleClick = (key: string) => {
    onClick?.(key)
    onExpand?.(false)
  }

  return <List>
    {languages.slice(1).map(({ key, chinese }) => (
      <ListItemButton key={key} selected={value === key} disabled={!supports.includes(key)} onClick={() => handleClick(key)} sx={{ display: "inline-block" }}>
        {chinese}
      </ListItemButton>
    ))}
  </List>
}

export default LanguageSelector
