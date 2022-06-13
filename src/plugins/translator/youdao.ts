import useAccountStore from '/src/store/account'

const languages = [
  { label: '自动检测', value: 'auto' },
  { label: '中文', value: 'ZH_CN' },
  { label: '英文', value: 'EN' },
]

// https://fanyi.youdao.com/translate?&doctype=json&type=AUTO&i=%E6%9C%AC%E6%96%87%E6%A1%A3%E4%B8%BB%E8%A6%81%E9%92%88%E5%AF%B9%E5%BC%80%E5%8F%91%E4%BA%BA%E5%91%98%EF%BC%8C%E6%8E%A5%E5%85%A5%E6%B5%8B%E8%AF%95%E5%89%8D%E9%9C%80%E8%A6%81%E8%8E%B7%E5%8F%96%20%E5%BA%94%E7%94%A8ID%20%E5%92%8C%20%E5%BA%94%E7%94%A8%E5%AF%86%E9%92%A5%20%EF%BC%8C%E5%B9%B6%E7%BB%91%E5%AE%9A%E5%AE%9E%E4%BE%8B%EF%BC%9B%E5%A6%82%E6%9E%9C%E6%82%A8%E8%BF%98%E6%B2%A1%E6%9C%89%EF%BC%8C%E8%AF%B7%E6%8C%89%E7%85%A7%20%E6%96%B0%E6%89%8B%E6%8C%87%E5%8D%97%20%E8%8E%B7%E5%8F%96%E3%80%82%0A%E5%B9%B3%E5%8F%B0%E5%90%91%E6%AF%8F%E4%B8%AA%E8%B4%A6%E6%88%B7%E8%B5%A0%E9%80%8150%E5%85%83%E7%9A%84%E4%BD%93%E9%AA%8C%E9%87%91%EF%BC%8C%E4%BE%9B%E7%94%A8%E6%88%B7%E9%9B%86%E6%88%90%E5%89%8D%E6%B5%8B%E8%AF%95%E6%89%80%E7%94%A8%EF%BC%8C%E5%85%B7%E4%BD%93%E8%B5%84%E8%B4%B9%E8%A7%84%E5%88%99%E8%AF%A6%E8%A7%81%20%E6%96%87%E6%9C%AC%E7%BF%BB%E8%AF%91%E6%9C%8D%E5%8A%A1%E6%8A%A5%E4%BB%B7%20
const url = 'http://fanyi.youdao.com/translate'

const translate = async (text: string, from = 'zh', to = 'en'): Promise<any> => {
  const response = await fetch(`${url}?doctype=json&type=${from}2${to}&i=${encodeURIComponent(text)}`)
  const json: YoudaoTranslateResponse = await response.json()
  if (json.errorCode !== 0) {
    throw '有道翻译失败：' + json.errorCode
  }
  return json.translateResult.map(item => item[0].tgt).join('\n')
}

type YoudaoTranslateResponse = {
  type: string
  errorCode: number
  elapseTime: number
  translateResult: { src: string; tgt: string }[][]
}

export default new (class implements Translator {
  name = '有道翻译'
  icon = ''
  languages = languages
  translate = translate
})()
