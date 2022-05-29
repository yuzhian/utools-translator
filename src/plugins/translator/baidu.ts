import md5 from 'crypto-js/md5'
import { useAccountStore } from '/src/store/configurator'

const url = 'http://api.fanyi.baidu.com/api/trans/vip/translate'

export default async (text: string, from = 'zh', to = 'en'): Promise<any> => {
  const accountStore = useAccountStore()
  const { appid, secret } = accountStore.get('baidu')
  if (!appid || !secret) {
    throw '请先配置百度翻译账号'
  }
  const salt = new Date().getTime().toString()
  const sign = md5(appid + text + salt + secret).toString()
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ q: text, from, to, appid, salt, sign }),
  })
  const json: BaiduTranslateResponse = await response.json()
  if (json.error_code) {
    throw '百度翻译失败：' + json.error_msg
  }
  return json.trans_result.map(item => item.dst).join('\n')
}

type BaiduTranslateResponse = {
  error_code: string
  error_msg: string
  from: string
  to: string
  trans_result: Array<{ src: string; dst: string }>
}
