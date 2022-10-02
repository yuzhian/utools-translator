import useServiceStore from '/src/store/service'

const languages = [
  { key: 'auto', label: '自动检测' },
  { key: 'zh', label: '中文' },
  { key: 'en', label: '英文' },
  { key: 'ja', label: '日语' },
  { key: 'fr', label: '法语' },
  { key: 'ru', label: '俄语' },
  { key: 'es', label: '西班牙语' },
]

const url = 'http://api.interpreter.caiyunai.com/v1/translator'

const translate = async (value: string, from = 'zh', to = 'en'): Promise<TranslateDST> => {
  const serviceStore = useServiceStore()
  const { token } = serviceStore.get('caiyun')
  if (!token) {
    throw '未配置彩云翻译账号'
  }
  // UTC 时间
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-authorization': `token ${token}`,
    },
    body: JSON.stringify({
      source: value,
      trans_type: `${from}2${to}`,
      request_id: 'demo',
      detect: true,
    }),
  })
  const json: CaiyunTranslateResponse = await response.json()
  if (!json.target) {
    throw '彩云小译翻译失败'
  }
  return {
    value: json.target,
    from: '',
    to: '',
  }
}

type CaiyunTranslateResponse = {
  isdict: number
  confidence: number
  target: string
  rc: number
}

export default <Translator>{
  name: '彩云小译',
  icon: 'https://www.caiyunapp.com/imgs/xiaoyilogo.png',
  type: 'token',
  interval: 0,
  languages: languages,
  translate: translate,
}
