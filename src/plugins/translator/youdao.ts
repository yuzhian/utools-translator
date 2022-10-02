import CryptoJS from 'crypto-js'
import useServiceStore from '/src/store/service'

const languages = [
  { key: 'auto', label: '自动检测' },
  { key: 'zh-CHS', label: '中文' },
  { key: 'en', label: '英文' },
  { key: 'jp', label: '日语' },
  { key: 'ru', label: '俄语' },
  { key: 'wyw', label: '文言文' },
  { key: 'cht', label: '繁体中文' },
  { key: 'yue', label: '粤语' },
]

const url = 'http://openapi.youdao.com/api'

function truncate(q: string) {
  const len = q.length
  if (len <= 20) return q
  return q.substring(0, 10) + len + q.substring(len - 10, len)
}

const translate = async (value: string, from = 'zh', to = 'en'): Promise<TranslateDST> => {
  const serviceStore = useServiceStore()
  const { appid, secret } = serviceStore.get('youdao')
  if (!appid || !secret) {
    throw '未配置有道翻译账号'
  }
  const salt = Date.now().toString()
  const curtime = Math.round(Date.now() / 1000).toString()
  const sign = CryptoJS.SHA256(appid + truncate(value) + salt + curtime + secret).toString(CryptoJS.enc.Hex)
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      q: value,
      from: from,
      to: to,
      appKey: appid,
      salt: salt,
      sign: sign,
      signType: 'v3',
      curtime: curtime,
    }),
  })

  const json: YoudaoTranslateResponse = await response.json()
  if (json.errorCode !== '0') {
    throw '有道翻译失败：' + json.errorCode
  }
  const types = json.l.split('2')
  return {
    value: json.translation.join('\n'),
    from: types[0],
    to: types[1],
  }
}

type YoudaoTranslateResponse = {
  errorCode: string
  translation: string[]
  l: string
  query: string
  isWord: boolean
  requestId: string
  tSpeakUrl:string
  speakUrl: string
  dict: {
    url: string
  }
  webdict: {
    url: string
  }
}

export default <Translator>{
  name: '有道翻译',
  icon: 'https://shared.ydstatic.com/images/favicon.ico',
  type: 'secret',
  interval: 0,
  languages: languages,
  translate: translate,
}
