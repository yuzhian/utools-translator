import { reactive } from 'vue'
import { defineStore } from 'pinia'
import storage from '/src/plugins/storage'

export const useAccountStore = defineStore('accounts', () => {
  const accounts: Accounts = reactive(_getAllAccount())

  function _saveAllAccount() {
    storage.setItem('accounts', JSON.stringify(accounts))
  }

  function _getAllAccount() {
    return JSON.parse(storage.getItem('accounts') || '{"baidu": {}}')
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
    _saveAllAccount()
  }

  return { get, getAll, putAll }
})
