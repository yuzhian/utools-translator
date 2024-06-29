import md5 from "crypto-js/md5";

const url = "https://api.fanyi.baidu.com/api/trans/vip/translate"
type BaiduTranslateResponse = {
  error_code: string
  error_msg: string
  from: string
  to: string
  trans_result: { src: string; dst: string }[]
}

const service: ServiceModule = {
  name: "百度翻译",
  authProps: [
    ["appid", "APP ID", "text"],
    ["secret", "密钥", "password"]
  ],
  initProps: {
    block: true,
    reset: true,
    limit: 1000000,
    usage: 0,
  },
  translate: async ({ srcText, srcLang, dstLang }, { appid, secret } = {}) => {
    const salt = Date.now().toString()
    const sign = md5(appid + srcText + salt + secret).toString()
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ q: srcText, from: srcLang, to: dstLang, appid, salt, sign })
    })
    const json: BaiduTranslateResponse = await response.json()
    if (json.error_code) {
      throw "百度翻译失败：" + json.error_msg
    }
    return {
      dstText: json.trans_result.map(item => item.dst).join("\n"),
      detLang: json.from,
      errText: ""
    }
  }
}

export default service
