import packageJson from "/src/../package.json"
import { load, save } from "/src/util/storage.ts";

function migration() {
  const source: string = load("version", "0.0.0")
  const target: string = packageJson.version
  if (compareVersion(target, source) <= 0) return
  console.log(`版本更新: ${source} -> ${target}`)

  // 加载版本迁移模块
  const modules: Record<string, { default: VoidFunction }>
    = import.meta.glob("./versions/v_*.ts", { eager: true })
  const migrates = Object.fromEntries(Object.entries(modules).map(([path, module]) => {
    const match = path.match(/v_(.+)\.ts$/)
    if (!match) throw new Error(`版本更新错误: ${path}`)
    return [match[1], module.default] // { 0.0.0: Migrate<unknown, unknown> }
  }))
  const versions = Object.keys(migrates)
    .filter(key => compareVersion(key, source) > 0)
    .sort((a, b) => compareVersion(a, b))

  // 迁移数据, 更新版本
  versions.forEach(version => migrates[version]?.())
  save("version", target)
}

function compareVersion(a: string, b: string): number {
  const aParts = a.split('.').map(Number)
  const bParts = b.split('.').map(Number)
  for (let i = 0; i < aParts.length; i++) {
    if ((aParts[i] || 0) > (bParts[i] || 0)) return 1
    if ((aParts[i] || 0) < (bParts[i] || 0)) return -1
  }
  return 0
}

migration()
