const accounts: Accounts = {
  baidu: { appid: 'xxxxxxxxxxxx', secret: 'xxxxxxxxxxxx' },
}

export default (app: string) => accounts[app]
