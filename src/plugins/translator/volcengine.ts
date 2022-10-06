/**
 * https://github.com/volcengine/volc-sdk-nodejs/blob/main/src/base/sign.ts
 */
import useServiceStore from '/src/store/service'
import { SHA256, HmacSHA256, enc } from 'crypto-js'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

const url = 'https://open.volcengineapi.com'

const translate = async (value: string, from = 'zh', to = 'en'): Promise<TranslateEntity> => {
  const serviceStore = useServiceStore()
  const { appid, secret } = serviceStore.get('volcengine')
  if (!appid || !secret) {
    throw '未配置火山翻译账号'
  }
  const now = dayjs().utc().format('YYYYMMDDTHHmmss[Z]')
  const method = 'POST'
  const path = '/'
  const queries = 'Action=TranslateText&Version=2020-06-01'
  const body = JSON.stringify({ TextList: [value], SourceLanguage: from === 'auto' ? '' : from, TargetLanguage: to })
  const headers: HeadersInit = { 'Content-Type': 'application/json; charset=utf-8', 'X-Date': now }
  headers.Authorization = sign(method, path, queries, headers, body, appid, secret, now)

  const response = await fetch(`${url}?${queries}`, { method, headers, body })
  const json: VolcengineTranslateResponse = await response.json()
  if (json.ResponseMetaData.Error) {
    throw '火山翻译失败'
  }
  return {
    value: json.TranslationList[0].Translation,
    from: '',
    to: json.TranslationList[0].DetectedSourceLanguage,
  }
}

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
      Extra: any
    }
  ]
}

/**
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
const sign = (
  method: string,
  path: string,
  queries: string,
  headers: HeadersInit,
  body: string,
  credential: string,
  secretKey: string,
  now: string,
  region = 'cn-north-1',
  service = 'translate',
  identifier = 'request',
  algorithm = 'HMAC-SHA256'
) => {
  const headerEntries = Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v])
  const canonicalHeaders = headerEntries.map(([k, v]) => `${k}:${v}\n`).join('')
  const signedHeaders = headerEntries.map(([k]) => k).join(';')
  const canonicalString = [method.toUpperCase(), path, queries, canonicalHeaders, signedHeaders, SHA256(body).toString(enc.Hex)].join('\n')

  const scope = [now.slice(0, 8), region, service, identifier].join('/')
  const signature = HmacSHA256(
    [algorithm, now, scope, SHA256(canonicalString).toString(enc.Hex)].join('\n'),
    HmacSHA256(identifier, HmacSHA256(service, HmacSHA256(region, HmacSHA256(now.slice(0, 8), secretKey))))
  ).toString(enc.Hex)
  return `${algorithm} Credential=${credential}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`
}

export default <Translator>{
  name: '火山翻译',
  icon: 'https://content.volccdn.com/obj/volc-content/lab/mt-portal/mt-portal-fe/static/media/favicon.8a2e2043.ico',
  type: 'secret',
  interval: 0,
  translate: translate,
}
