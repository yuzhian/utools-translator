import md5 from 'crypto-js/md5'
import useServiceStore from '/src/store/service'

const url = 'http://api.fanyi.baidu.com/api/trans/vip/translate'

const translate = async (value: string, from = 'zh', to = 'en'): Promise<TranslateEntity> => {
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
  translate: translate,
}
