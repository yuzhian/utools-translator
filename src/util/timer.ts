import dayjs from "dayjs";

/**
 * 每月执行
 * @param day  每月{}日执行
 * @param exec 执行函数
 * @param last 最后执行时间
 */
export const execMonthly = (day: number, exec: (time: number) => void, last: number) => {
  const now = dayjs() // 当前时间
  const prev = now.startOf("month") // 计划上次执行时间
  const next = prev.add(day, "month") // 计划下次执行时间
  // 比较 最后执行时间 和 计划上次执行时间, 如果未执行, 则补一次执行
  if (prev.isAfter(last)) {
    last = dayjs().valueOf()
    exec(last)
  }
  // 设置定时器, 在运行期间, 到指定日期时, 执行回调
  const timer = setTimeout(() => execMonthly(day, () => exec(dayjs().valueOf()), last), next.diff(now))
  return () => clearTimeout(timer)
}
