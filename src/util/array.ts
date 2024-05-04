export function loopGet<T>(arr: T[], current: number, move: number): T {
  // 数组为空 | current 越界 | move 超出数组长度的负值导致左侧结果小于0 等情况暂不考虑
  return arr[(current + move + arr.length) % arr.length]
}
