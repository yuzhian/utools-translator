import { createStore, createLogger, Store } from 'vuex'

const state = {
  accounts: JSON.parse(localStorage.getItem('accounts') || '{"baidu": {}}'),
}

const mutations = {
  setAccounts(state: any, data: any) {
    state.accounts = data
    localStorage.setItem('accounts', JSON.stringify(data))
  },
}

const getters = {
  accounts:
    (state: any) =>
    (key: string): Account | Accounts => {
      return key ? state.accounts[key] : state.accounts
    },
}

const debug: boolean = import.meta.env.DEV
export default createStore({
  strict: debug,
  state,
  mutations,
  getters,
  plugins: debug ? [createLogger()] : [],
}) as Store<any>
