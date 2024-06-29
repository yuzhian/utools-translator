import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { intersection } from "lodash";
import { franc } from "franc";
import { Alert, Box, CircularProgress, Paper, PaperProps } from "@mui/material";
import { translate } from "/src/plugins/service";
import { getSupportsByService } from "/src/plugins/language";
import { useSubscription } from "/src/plugins/action";
import { servicePropsState } from "/src/store/service.ts";
import { globalPropsState } from "/src/store/global.ts";
import { languageCurrentState, languageDetectState } from "/src/store/language.ts";
import { recordState } from "/src/store/record.ts";
import { execMonthly } from "/src/util/timer.ts";
import throttle from "/src/util/throttle";
import Message from "/src/components/Message";

interface ServiceComponentProps extends PaperProps {
  serviceKey: string
  enable: boolean
  delay?: number // 当前不可改, 需要考虑上次的调用是否完成等情况, 目前情况看, 除了百度有 qps 限制外, 其他服务并无频率限制, 同时 1 秒也是比较合理的间隔, 因此固定即可, 暂不支持自定义
}

const TranslateService = forwardRef<ServiceComponent, ServiceComponentProps>(({ serviceKey, enable, delay = 1000, ...props }, ref) => {
  const [serviceProps, setServiceProps] = useRecoilState(servicePropsState(serviceKey))
  const globalProps = useRecoilValue(globalPropsState)
  if (!serviceProps) {
    return null
  }

  const [dstText, setDstText] = useState("")
  const [errText, setErrText] = useState("")
  const [loading, setLoading] = useState(false)

  const srcLang = useRecoilValue(languageCurrentState("src"))
  const [dstLang, setDstLang] = useRecoilState(languageCurrentState("dst"))
  const setDetLang = useSetRecoilState(languageDetectState)
  const putRecord = useSetRecoilState(recordState)

  // translate-翻译; throttledTranslate-节流翻译; enhancedTranslate-逻辑处理, 检查参数, 转换语言, 历史记录等
  const throttledTranslate = useRef(throttle(translate(serviceKey), delay))
  const enhancedTranslate = async (props: SrcText & Partial<LanguageProps>) => {
    if (serviceProps.block && serviceProps.usage + props.srcText.length > serviceProps.limit) {
      const err = `当前服务可使用字符将要达到设置上限(${serviceProps.usage}/${serviceProps.limit}), 请切换服务后继续使用`
      setDetLang("");
      setDstText("");
      setErrText(err);
      return { dstText: "", detLang: "", errText: err }
    }
    // 补全参数, 检测语言并根据优先级切换
    const source = props.srcLang ?? srcLang
    const detect = franc(props.srcText, { minLength: 2, only: globalProps.languagePreferences })
    const translateProps = {
      srcText: props.srcText,
      srcLang: source,
      // 如果指定语言, 使用指定语言; 发生冲突且允许自动切换时, 选择优先级最高的符合条件的选项; 如果所有选项都不可用, 用当前目标语言作为兜底.
      dstLang: props.dstLang ?? ((globalProps.autoSwitchDstLang && (source === dstLang || source === "auto" && detect === dstLang))
        && intersection(globalProps.languagePreferences, getSupportsByService(serviceKey, srcLang)).find(item => item !== dstLang)
        || dstLang)
    }
    setDstLang(translateProps.dstLang)
    putRecord(translateProps.srcText)
    setLoading(true)
    try {
      const result = await throttledTranslate.current(translateProps, serviceProps.authData ?? {});
      setDetLang(result.detLang || "");
      setDstText(result.dstText);
      setErrText(result.errText || "");
      return result;
    } finally {
      setLoading(false);
      setServiceProps({ ...serviceProps, usage: serviceProps.usage + props.srcText.length });
    }
  }

  // 外部操作调用翻译
  useImperativeHandle(ref, () => ({
    translate: enhancedTranslate
  }))

  const dstTextCopy = (fn: (text: string) => string) => {
    // 阻止无译文的情况
    if (!dstText) {
      Message.info("尚无译文")
      return
    }
    // 阻止不符合规则的情况 英文/数字/下划线/中划线/空格
    if (!/^[a-zA-Z0-9_\- ]+$/.test(dstText)) {
      Message.info("仅支持转换字母、数字、连字符和空格的译文")
      return
    }
    const resultDstText = fn(dstText)
    navigator.clipboard.writeText(resultDstText).then(() => {
      const ellipsisText = resultDstText.length > 20 ? resultDstText.slice(0, 20) + "..." : resultDstText
      Message.success(`已复制 ${ellipsisText} 到剪贴板`)
    }).catch(err => {
      Message.error(`复制失败 ${err}`)
    })
  }

  useEffect(() => serviceProps.reset
      ? execMonthly(1, time => setServiceProps({ ...serviceProps, usage: 0, lastReset: time }), serviceProps.lastReset)
      : () => null
    , [serviceProps])

  useSubscription(enable ? {
    dstTextCamelCaseCopy: () => dstTextCopy(text => text.replace(/[-_ ]+(.)/g, (_, c) => c.toUpperCase()).replace(/^[A-Z]/, c => c.toLowerCase())),
    dstTextPascalCaseCopy: () => dstTextCopy(text => text.replace(/[-_ ]+(.)/g, (_, c) => c.toUpperCase()).replace(/^[a-z]/, c => c.toUpperCase())),
    dstTextSnakeCaseCopy: () => dstTextCopy(text => text.replace(/[-_ ]+(.)/g, (_, c) => "_" + c).toLowerCase()),
    dstTextScreamingSnakeCaseCopy: () => dstTextCopy(text => text.replace(/[-_ ]+(.)/g, (_, c) => "_" + c).toUpperCase()),
    dstTextKebabCaseCopy: () => dstTextCopy(text => text.replace(/[-_ ]+(.)/g, (_, c) => "-" + c.toLowerCase()).replace(/^[A-Z]/, c => c.toLowerCase())),
  } : {})

  return <Paper {...props}>
    {loading && <Box display="flex" justifyContent="center" alignItems="center" position="absolute" top={0} bottom={0} left={0} right={0} zIndex={1}
      bgcolor={theme => theme.palette.background.default}>
      <CircularProgress />
    </Box>}
    {errText && <Alert severity="warning">{errText}</Alert>}
    {dstText}
  </Paper>
})

export default TranslateService
