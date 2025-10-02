export default function throttle<Args extends unknown[], R>(promiseFn: (...args: Args) => Promise<R>, delay: number) {
  // 用于标记当前是否有函数正在执行
  let isExecuting = false
  // 上一个函数执行完毕的时间
  let lastExecTime = 0
  // 延迟执行器的id
  let timeoutId: number | undefined

  return function(...args: Args) {
    return new Promise<R>((resolve) => {
      function createTimeout(func: (...args: Args) => Promise<R>, params: Args) {
        // 同时多个请求进入, 清除上一个请求的定时器, 保证只有最后一个请求的定时器生效
        clearTimeout(timeoutId)
        return setTimeout(async() => {
          isExecuting = true
          const result = await func(...params).finally(() => {
            lastExecTime = Date.now()
            isExecuting = false
          })
          resolve(result)
        }, Math.max(lastExecTime + delay - Date.now(), 0) ?? 0)
      }

      if (isExecuting) {
        // 如果正在执行，等待执行完成后再调用下一个函数
        timeoutId = setTimeout(() => {
          timeoutId = createTimeout(promiseFn, args)
        }, delay)
      } else {
        timeoutId = createTimeout(promiseFn, args)
      }
    })
  }
}