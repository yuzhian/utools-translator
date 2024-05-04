import { enc, HmacSHA256, SHA256 } from "crypto-js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc)

const url = "https://open.volcengineapi.com"

// https://github.com/volcengine/volc-sdk-nodejs/blob/main/src/base/types.ts
type VolcengineTranslateResponse = {
  ResponseMetaData: {
    RequestId: string
    Action: string
    Version: string
    Service: string
    Region: string
    Error: {
      Code?: string
      Message: string
      CodeN?: number
    }
  }
  TranslationList: [
    {
      Translation: string
      DetectedSourceLanguage: string
      Extra: unknown
    }
  ]
}

/**
 * https://github.com/volcengine/volc-sdk-nodejs/blob/main/src/base/sign.ts
 *
 * @param method      请求方法
 * @param path        请求路径
 * @param queries     请求参数
 * @param headers     请求头
 * @param body        请求体
 * @param credential  ak
 * @param secretKey   sk
 * @param now         当前时间
 * @param region      地域
 * @param service     服务
 * @param identifier  标识
 * @param algorithm   算法
 * @returns           签名
 */
function sign(
  method: string,
  path: string,
  queries: string,
  headers: HeadersInit,
  body: string,
  credential: string,
  secretKey: string,
  now: string,
  region = "cn-north-1",
  service = "translate",
  identifier = "request",
  algorithm = "HMAC-SHA256"
) {
  const headerEntries = Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v])
  const canonicalHeaders = headerEntries.map(([k, v]) => `${k}:${v}\n`).join("")
  const signedHeaders = headerEntries.map(([k]) => k).join(";")
  const canonicalString = [method.toUpperCase(), path, queries, canonicalHeaders, signedHeaders, SHA256(body).toString(enc.Hex)].join("\n")

  const scope = [now.slice(0, 8), region, service, identifier].join("/")
  const signature = HmacSHA256(
    [algorithm, now, scope, SHA256(canonicalString).toString(enc.Hex)].join("\n"),
    HmacSHA256(identifier, HmacSHA256(service, HmacSHA256(region, HmacSHA256(now.slice(0, 8), secretKey))))
  ).toString(enc.Hex)
  return `${algorithm} Credential=${credential}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`
}

export default <ServiceModule>{
  name: "火山翻译",
  authProps: [
    ["accessKeyId", "Access Key ID", "text"],
    ["secretAccessKey", "Secret Access Key", "password"]
  ],
  translate: async ({ srcText, srcLang, dstLang }, { accessKeyId, secretAccessKey } = {}): Promise<TranslateResult> => {
    const now = dayjs().utc().format("YYYYMMDDTHHmmss[Z]")
    const method = "POST"
    const path = "/"
    const queries = "Action=TranslateText&Version=2020-06-01"
    const body = JSON.stringify({ TextList: [srcText], SourceLanguage: srcLang === "auto" ? "" : srcLang, TargetLanguage: dstLang })
    const headers: HeadersInit = { "Content-Type": "application/json; charset=utf-8", "X-Date": now }
    headers.Authorization = sign(method, path, queries, headers, body, accessKeyId, secretAccessKey, now)

    const response = await fetch(`${url}?${queries}`, { method, headers, body })
    const json: VolcengineTranslateResponse = await response.json()
    if (json.ResponseMetaData.Error) {
      throw "火山翻译失败"
    }
    return {
      dstText: json.TranslationList[0].Translation,
      detLang: json.TranslationList[0].DetectedSourceLanguage
    }
  }
}
