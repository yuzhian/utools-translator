import { enc, HmacSHA256, SHA256 } from "crypto-js";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc)

const url = "https://tmt.tencentcloudapi.com"
type TencentTranslateResponse = {
  Response: {
    RequestId: string
    Source: string
    Target: string
    TargetText: string
    Error: {
      Code: string
      Message: string
    }
  }
}

// https://cloud.tencent.com/document/api/213/30654
// https://github.com/TencentCloud/tencentcloud-sdk-nodejs/blob/master/src/common/sign.ts
const sign = (
  method: string,
  path: string,
  queries: string,
  headers: HeadersInit,
  body: string,
  secretId: string,
  secretKey: string,
  date: Dayjs,
  service = "tmt",
  identifier = "tc3_request",
  algorithm = "TC3-HMAC-SHA256"
) => {
  const headerEntries = Object.entries(headers)
    .map(([k, v]) => [k.toLowerCase(), v])
    .filter(([k]) => !k.startsWith("x-tc-"))
  const canonicalHeaders = headerEntries.map(([k, v]) => `${k}:${v}\n`).join("")
  const signedHeaders = headerEntries.map(([k]) => k).join(";")
  const canonicalRequest = [method, path, queries, canonicalHeaders, signedHeaders, SHA256(body)].join("\n")

  const credentialScope = [date.format("YYYY-MM-DD"), service, identifier].join("/")
  const stringToSign = [algorithm, date.unix(), credentialScope, SHA256(canonicalRequest)].join("\n")
  const kDate = HmacSHA256(date.format("YYYY-MM-DD"), "TC3" + secretKey)
  const kService = HmacSHA256(service, kDate)
  const kSigning = HmacSHA256(identifier, kService)
  const signature = HmacSHA256(stringToSign, kSigning).toString(enc.Hex)
  return `${algorithm} Credential=${secretId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`
}

export default <ServiceModule>{
  name: "腾讯翻译",
  authProps: [
    ["secretId", "SecretId", "text"],
    ["secretKey", "SecretKey", "password"]
  ],
  translate: async ({ srcText, srcLang, dstLang }, { secretId, secretKey } = {}) => {
    const date = dayjs().utc()
    const body = JSON.stringify({ SourceText: srcText, Source: srcLang, Target: dstLang, ProjectId: 0 })
    const headers: HeadersInit = {
      "Content-Type": "application/json; charset=utf-8",
      Host: "tmt.tencentcloudapi.com",
      "X-TC-Action": "TextTranslate",
      "X-TC-Version": "2018-03-21",
      "X-TC-Timestamp": date.unix().toString(),
      "X-TC-Region": "ap-guangzhou"
    }
    headers.Authorization = sign("POST", "/", "", headers, body, secretId, secretKey, date)

    const response = await fetch(url, { method: "POST", headers, body })
    const json: TencentTranslateResponse = await response.json()
    if (json.Response.Error) {
      throw "腾讯翻译失败"
    }
    return {
      dstText: json.Response.TargetText,
      detLang: json.Response.Source,
      errText: json.Response.Target
    }
  }
}
