import { getCodeByKey, getKeyByCode } from "../language";

const modules: Record<string, { default: ServiceModule }> = import.meta.glob("/src/plugins/service/*.(ts|js)", { eager: true })

export const serviceModules: Record<string, ServiceModule> = Object.fromEntries(
  Object.entries(modules).map(([key, { default: serviceModule }]) => [
    key.match(/\/src\/plugins\/service\/(\w+)\.(ts|js)/)?.[1],
    serviceModule
  ])
)

export const defaultServiceProps: Array<ServiceProps> = Object.entries(serviceModules).map(([key, serviceModule]) => ({
  key, enable: true, authData: {}, lastReset: 0, ...serviceModule.initProps
}))

/**
 * 供程序内调用的翻译函数, 用于屏蔽错误和编码转换. 具体功能如下:
 * - 拦截非法请求
 * - 捕获响应异常, 转换为错误文本
 * - 转换语言参数: key => code
 * - 转换语言响应: code => key
 *
 * *: code - 第三方服务的语言代码; key - 应用内的唯一标识符.
 */
export const translate = (serviceKey: string) =>
  async ({ srcText, srcLang, dstLang }: TranslateProps, authData: Record<string, string>) => {
    const serviceModule = serviceModules[serviceKey]
    const buildTranslateResult = (dstText: string, detLang: string, errText: string | false): TranslateResult => ({ dstText, detLang: detLang, errText })

    // 阻止无输入的情况, 清空检测语言/目标文本/提示信息
    if (!srcText) {
      return Promise.resolve(buildTranslateResult("", "", false))
    }

    // 阻止服务未授权的情况, 清空检测语言/目标文本, 提示服务未配置
    if (serviceModule.authProps.map(([field]) => authData?.[field]).some((v: string) => !v)) {
      return Promise.resolve(buildTranslateResult("", "", `${serviceModule.name} 需要 ${serviceModule.authProps.map(([, name]) => name).join("、")} `))
    }

    // 组装参数, 将 key 转换为 code 提供给翻译程序
    const params = {
      srcText,
      srcLang: getCodeByKey(srcLang, serviceKey),
      dstLang: getCodeByKey(dstLang, serviceKey),
    }

    // 执行翻译, 将 code 转换为 key 提供给页面
    try {
      const result = await serviceModule.translate(params, authData)
      return buildTranslateResult(result.dstText, getKeyByCode(result.detLang, serviceKey) || "", false)
    } catch (reason: unknown) {
      return buildTranslateResult("", "", typeof reason === "string" ? reason : "翻译错误")
    }
  }
