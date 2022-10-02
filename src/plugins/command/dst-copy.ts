export default <Command>{
  label: '复制结果',
  exec: ({ data }: any) => {
    window.utools?.copyText(data.dst)
  },
}
