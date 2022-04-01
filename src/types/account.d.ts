type Account = {
  appid: string
  secret: string
}

type Accounts = {
  [app: string]: Account
}
