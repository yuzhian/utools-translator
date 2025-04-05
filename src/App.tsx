import { createRef, RefObject, useRef, useState } from "react";
import { useShortcutEmit, useSubscription } from "/src/plugins/action";
import { useCurrentServiceKey, useEnabledServiceKeys } from "/src/store/service.ts";
import { useKeybindingActionMap } from "/src/store/action.ts";
import { useGlobalStore } from "/src/store/global.ts";
import InputBox from "/src/views/main/InputBox.tsx";
import MainContainer from "/src/views/main/MainContainer.tsx";
import TranslateService from "/src/views/main/TranslateService.tsx";
import SelectorBar from "/src/views/selector/SelectorBar.tsx";
import ServiceSelector from "/src/views/selector/ServiceSelector.tsx";
import LanguageSelector from "/src/views/selector/LanguageSelector.tsx";
import ComponentHub, { ComponentHubExposed } from "/src/views/panel/ComponentHub.tsx";
import RecordsPanel from "/src/views/panel/RecordsPanel.tsx";
import SettingPanel from "/src/views/panel/setting/SettingPanel.tsx";
import GeneralSetting from "/src/views/panel/setting/general/GeneralSetting.tsx";
import ServiceSetting from "/src/views/panel/setting/ServiceSetting.tsx";
import ShortcutSetting from "/src/views/panel/setting/ShortcutSetting.tsx";

const App = () => {
  const currentServiceKey = useCurrentServiceKey()
  const enabledServiceKeys = useEnabledServiceKeys()
  const { autoTranslate, inputDebounceWait } = useGlobalStore();
  const keybindingActionMap = useKeybindingActionMap()

  const [srcText, setSrcText] = useState("")

  const componentHubRef = useRef<ComponentHubExposed>(null)

  const serviceRefs = useRef<Record<string, RefObject<ServiceComponent | null>>>(
    Object.fromEntries(enabledServiceKeys.map((serviceKey) => [serviceKey, createRef()]))
  )

  // 调用服务翻译
  const translate = (props: Partial<TranslateProps>, service = currentServiceKey) => {
    serviceRefs.current[service].current?.translate({ srcText, ...props })
  }

  // 替换输入语言, 并在 DOM 更新后回调
  const updateSrcText = (value: string) => {
    setSrcText(value)
    return new Promise<SrcText>((resolve) => setTimeout(() => resolve({ srcText: value })))
  }

  // 载入触发翻译
  window.utools?.onPluginEnter(({ type, payload }) => {
    if (type !== "over") return
    updateSrcText(payload).then(src => {
      componentHubRef.current?.setActive(false)
      autoTranslate && translate(src)
    })
  })

  // 按快捷键时, 发布对应的事件
  useShortcutEmit(window, keybindingActionMap)
  // 订阅操作事件
  useSubscription({
    "translate": () => translate({})
  })

  return <>
    <SelectorBar position="relative" elevation={0} sx={{ bgcolor: "background.default" }}>
      {/* 服务切换 */}
      <ServiceSelector onChange={(value) => autoTranslate && translate({}, value)} />
      {/* 语言切换 */}
      <LanguageSelector onChange={(value) => autoTranslate && translate(value)} />
    </SelectorBar>

    <MainContainer spacing={1} p={1} mt={0} maxHeight="calc(100vh - 144px)" overflow="auto">
      {/* 左侧输入框, 防抖后执行翻译 */}
      <InputBox value={srcText} wait={inputDebounceWait} limit={5000} fullWidth multiline minRows={10} size="small"
        onChange={value => setSrcText(value)}
        onDebounced={value => autoTranslate && translate({ srcText: value })}
      />
      {/* 右侧结果框, 一组服务组件, 显示当前匹配的服务. 提供了翻译函数 */}
      {enabledServiceKeys.map(serviceKey => (
        <TranslateService ref={serviceRefs.current[serviceKey]} key={serviceKey} serviceKey={serviceKey} delay={1000} variant="outlined"
          enable={serviceKey === currentServiceKey} sx={{
            p: 1, minHeight: "calc(100% - 1.5rem)", wordWrap: "break-word", whiteSpace: "pre-line",
            position: "relative", display: serviceKey === currentServiceKey ? "block" : "none"
          }} />
      ))}
    </MainContainer>

    {/* 底部附加功能 */}
    <ComponentHub ref={componentHubRef} position="absolute" elevation={0}
      sx={{ top: "auto", bottom: 0, bgcolor: theme => theme.palette.background.default, zIndex: theme => theme.zIndex.appBar + 1 }}
      components={[
        {
          key: "setting", name: "设置", element: <SettingPanel components={[
            { key: "general", name: "通用", element: <GeneralSetting /> },
            { key: "service", name: "服务", element: <ServiceSetting /> },
            { key: "shortcut", name: "快捷键", element: <ShortcutSetting /> },
          ]} />, fullScreen: true
        },
        {
          key: "records",
          name: "历史",
          element: <RecordsPanel onClick={value => updateSrcText(value).then(translate).then(() => componentHubRef.current?.setActive(false))} />
        },
      ]} />
  </>
}

export default App
