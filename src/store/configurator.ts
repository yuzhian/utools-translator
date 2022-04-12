import { reactive } from 'vue'
import { defineStore } from 'pinia'

const prod = import.meta.env.PROD

export const useAccountStore = defineStore('accounts', () => {
  const accounts: Accounts = reactive(_lodeAccount())

  function _save() {
    // 测试
    if (!prod) {
      localStorage.setItem('accounts', JSON.stringify(accounts))
      return
    }
    utools.dbStorage.setItem('accounts', accounts)
  }

  function _lodeAccount() {
    // 测试
    if (!prod) {
      return JSON.parse(localStorage.getItem('accounts') || '{"baidu": {}}')
    }
    return utools.dbStorage.getItem('accounts') || { baidu: {} }
  }

  function getAll() {
    return accounts
  }

  function get(app: string) {
    return accounts[app] ?? {}
  }

  function putAll(obj: Accounts) {
    for (const [key, val] of Object.entries(obj)) {
      accounts[key] = val
    }
    _save()
  }

  return { get, getAll, putAll }
})
