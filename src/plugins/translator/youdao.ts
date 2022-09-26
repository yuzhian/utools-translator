const languages = [
  { key: 'auto', label: '自动检测' },
  { key: 'ZH_CN', label: '中文' },
  { key: 'EN', label: '英文' },
]

const url = 'http://fanyi.youdao.com/translate'

const translate = async (value: string, from = 'zh', to = 'en'): Promise<TranslateDST> => {
  const response = await fetch(`${url}?doctype=json&type=${from}2${to}&i=${encodeURIComponent(value)}`)
  const json: YoudaoTranslateResponse = await response.json()
  if (json.errorCode !== 0) {
    throw '有道翻译失败：' + json.errorCode
  }
  const types = json.type.split('2')
  return {
    value: json.translateResult.map(item => item[0].tgt).join('\n'),
    from: types[0],
    to: types[1],
  }
}

type YoudaoTranslateResponse = {
  type: string
  errorCode: number
  elapseTime: number
  translateResult: { src: string; tgt: string }[][]
}

export default <Translator>{
  name: '有道翻译',
  icon: 'https://shared.ydstatic.com/images/favicon.ico',
  type: 'free',
  interval: 0,
  languages: languages,
  translate: translate,
}
