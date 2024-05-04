import CryptoJS from "crypto-js";

const url = "https://openapi.youdao.com/api"
type YoudaoTranslateResponse = {
  errorCode: string
  translation: string[]
  l: string
  query: string
  isWord: boolean
  requestId: string
  tSpeakUrl: string
  speakUrl: string
  dict: {
    url: string
  }
  webdict: {
    url: string
  }
}

function truncate(q: string) {
  const len = q.length
  if (len <= 20) return q
  return q.substring(0, 10) + len + q.substring(len - 10, len)
}

export default <ServiceModule>{
  name: "有道翻译",
  authProps: [
    ["appid", "应用ID", "text"],
    ["secret", "应用秘钥", "password"]
  ],
  translate: async ({ srcText, srcLang, dstLang }, { appid, secret } = {}) => {
    const salt = Date.now().toString()
    const curtime = Math.round(Date.now() / 1000).toString()
    const sign = CryptoJS.SHA256(appid + truncate(srcText) + salt + curtime + secret).toString(CryptoJS.enc.Hex)
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        q: srcText,
        from: srcLang,
        to: dstLang,
        appKey: appid,
        salt: salt,
        sign: sign,
        signType: "v3",
        curtime: curtime
      })
    })

    const json: YoudaoTranslateResponse = await response.json()
    if (json.errorCode !== "0") {
      throw "有道翻译失败：" + json.errorCode
    }
    const pair = json.l.split("2")
    return {
      dstText: json.translation.join("\n"),
      detLang: pair[0]
    }
  }
}
