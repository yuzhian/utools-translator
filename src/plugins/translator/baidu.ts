import md5 from 'crypto-js/md5'
import useServiceStore from '/src/store/service'

const languages = [
  { key: 'auto', label: '自动检测' },
  { key: 'zh', label: '中文' },
  { key: 'en', label: '英文' },
  { key: 'jp', label: '日语' },
  { key: 'ru', label: '俄语' },
  { key: 'wyw', label: '文言文' },
  { key: 'cht', label: '繁体中文' },
  { key: 'yue', label: '粤语' },
]

const url = 'http://api.fanyi.baidu.com/api/trans/vip/translate'

const translate = async (value: string, from = 'zh', to = 'en'): Promise<TranslateDST> => {
  const serviceStore = useServiceStore()
  const { appid, secret } = serviceStore.get('baidu')
  if (!appid || !secret) {
    throw '未配置百度翻译账号'
  }
  const salt = Date.now().toString()
  const sign = md5(appid + value + salt + secret).toString()
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ q: value, from, to, appid, salt, sign }),
  })
  const json: BaiduTranslateResponse = await response.json()
  if (json.error_code) {
    throw '百度翻译失败：' + json.error_msg
  }
  return {
    value: json.trans_result.map(item => item.dst).join('\n'),
    from: json.from,
    to: json.to,
  }
}

type BaiduTranslateResponse = {
  error_code: string
  error_msg: string
  from: string
  to: string
  trans_result: { src: string; dst: string }[]
}

export default <Translator>{
  name: '百度翻译',
  icon: 'https://fanyi-cdn.cdn.bcebos.com/webStatic/translation/img/favicon/favicon.ico',
  type: 'secret',
  interval: 1000,
  languages: languages,
  translate: translate,
}
