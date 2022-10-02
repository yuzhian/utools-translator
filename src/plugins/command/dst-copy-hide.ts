export default {
  label: '复制并关闭',
  exec: ({ data }: any) => {
    window.utools?.copyText(data.dst)
    window.utools?.hideMainWindow()
  },
}
