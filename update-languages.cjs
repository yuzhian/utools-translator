/**
 * 将服务的 语种名称 转换为 键名, 用于服务切换时, 通过键名关联, 解决不同服务间的语种名称/语种代码不一致
 * 提供文件及格式: /src/assets/languages/source.{service}.json   : [ ...[语种名称, 语种代码, [受支持的语种名称数组, 默认全选], [不受支持的语种名称数组, 默认不选] ] ]
 * 生成文件及格式: /src/assets/languages/language.{service}.json : [ ...[语种键名, 语种代码, [受支持的语种键名数组(受支持数组 - 不受支持数组)] ] ]
 * @example 英语 => en  /  zh-TW => zh-Hant
 * @example [ ["简体中文", "zh", ["zh-TW", "英语"]] ] => [ ["zh-Hans", "zh", ["zh-Hant", "en"]] ]
 */
const fs = require('fs')

// 操作目录
const dir = './src/assets/languages/'
// 指定服务
const services = process.argv.slice(2)

// 文件列表
const filenames = fs
  .readdirSync(dir)
  .filter(file => file.startsWith('source.'))
  .filter(file => (services.length ? services.includes(file.split('.')[1]) : true))

// 键名语种对照表 knMapping: { 键名: 语种名称 }; nkMapping: { 语种名称: 键名 }
const cldr = require('./src/assets/languages/cldr.zh.json')
const cldrLanguages = cldr.main.zh.localeDisplayNames.languages
const extensionLanguages = require('./src/assets/languages/extension.zh.json')
const knMapping = Object.assign({}, cldrLanguages, extensionLanguages)
const nkMapping = Object.fromEntries(Object.entries(knMapping).map(([k, v]) => [v, k]))

// 调用转化函数, 生成对应的 json 文件
for (const filename of filenames) {
  console.log('>>> ' + filename)
  const json = getReplacedJson(require(dir + filename)).sort(([a], [b]) => a.localeCompare(b))
  const text = '[\r' + json.map(([name, key, supports]) => `  ["${name}", "${key}", [${supports.map(s => `"${s}"`).join(', ')}]]`).join(',\r') + '\r]\r'
  const target = dir + filename.replace(/^source\./, 'language.')
  fs.writeFileSync(target, text)
}

// 生成替换后的 json
function getReplacedJson(jsonArray) {
  // 通过名称获取键, 如果不存在则返回原名称, 控制台输出 名称 以及 编码匹配到的名称, 以便手动修改
  const getKey = (name, code) => {
    const key = nkMapping[name]
    if (!key) console.error('语种无法匹配', name, '可能的名称', knMapping[code])
    return key || name
  }
  return jsonArray.map(([name, code, supportedNames, unsupportedNames]) => {
    const supportedKeys = supportedNames ? supportedNames.map(n => getKey(n)) : jsonArray.map(([n]) => getKey(n, code))
    const unsupportedKeys = unsupportedNames ? unsupportedNames.map(n => getKey(n)) : []
    return [getKey(name, code), code, supportedKeys.filter(n => !unsupportedKeys.includes(n))]
  })
}
