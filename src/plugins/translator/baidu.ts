import md5 from 'crypto-js/md5'
import useAccountStore from '/src/store/account'

const languages = [
  { label: '自动检测', value: 'auto' },
  { label: '中文', value: 'zh' },
  { label: '英文', value: 'en' },
  { label: '日语', value: 'jp' },
  { label: '俄语', value: 'ru' },
  { label: '文言文', value: 'wyw' },
  { label: '繁体中文', value: 'cht' },
  { label: '粤语', value: 'yue' },
]

const url = 'http://api.fanyi.baidu.com/api/trans/vip/translate'

const translate = async (text: string, from = 'zh', to = 'en'): Promise<string> => {
  const accountStore = useAccountStore()
  const { appid, secret } = accountStore.get('baidu')
  if (!appid || !secret) {
    throw '未配置百度翻译账号'
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
  trans_result: { src: string; dst: string }[]
}

export default new (class implements Translator {
  name = '百度翻译'
  icon = ''
  languages = languages
  translate = translate
})()
