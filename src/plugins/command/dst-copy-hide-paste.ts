export default {
  label: '复制并粘贴',
  exec: ({ data }: any) => {
    window.utools?.copyText(data.dst)
    window.utools?.hideMainWindow()
    window.utools?.simulateKeyboardTap('v', 'ctrl')
  },
}
