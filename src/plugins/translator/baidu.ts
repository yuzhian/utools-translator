import md5 from 'crypto-js/md5'
import fetchJsonp from 'fetch-jsonp'
import store from '/src/store'

export default async (text: string, from = 'zh', to = 'en'): Promise<any> => {
  const { appid, secret } = store.getters.accounts('baidu')
  const salt = new Date().getTime()
  const sign = md5(appid + text + salt + secret)
  const params = new URLSearchParams()
  params.append('q', text)
  params.append('from', from)
  params.append('to', to)
  params.append('appid', appid)
  params.append('salt', salt.toString())
  params.append('sign', sign.toString())
  const url = `http://api.fanyi.baidu.com/api/trans/vip/translate?${params.toString()}`
  const response = await fetchJsonp(url)
  const json = await response.json()
  return json['trans_result'][0]['dst']
}
