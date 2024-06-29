const url = "https://api.interpreter.caiyunai.com/v1/translator"
type CaiyunTranslateResponse = {
  isdict: number
  confidence: number
  target: string
  rc: number
  trans_type: string
}

const service: ServiceModule = {
  name: "彩云小译",
  authProps: [["token", "令牌", "password"]],
  initProps: {
    block: true,
    reset: false,
    limit: 1000000,
    usage: 0,
  },
  translate: async ({ srcText, srcLang, dstLang }, { token } = {}) => {
    // UTC 时间
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-authorization": `token ${token}`
      },
      body: JSON.stringify({
        source: srcText,
        trans_type: `${srcLang}2${dstLang}`,
        request_id: "demo",
        detect: true
      })
    })
    const json: CaiyunTranslateResponse = await response.json()
    if (!json.target) {
      throw "彩云小译翻译失败"
    }
    const pair = json.trans_type.split("2")
    return {
      dstText: json.target,
      detLang: pair[0]
    }
  }
}

export default service
