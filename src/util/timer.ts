import dayjs from "dayjs";

export const execMonthly = (day: number, exec: (time: number) => void, last: number) => {
  const now = dayjs()
  const pre = now.startOf("month")
  const next = pre.add(day, "month")
  // 比较 最后执行时间 和 计划上次执行时间, 如果未执行, 则补一次执行
  pre.isAfter(last) && exec(dayjs().valueOf())
  // 设置定时器, 在运行期间, 到指定日期时, 执行回调
  const timer = setTimeout(() => execMonthly(day, () => exec(dayjs().valueOf()), dayjs().valueOf()), next.diff(now))
  return () => clearTimeout(timer)
}
