import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { translators } from '/src/plugins/translator'
import storage from '/src/plugins/storage'

export default defineStore('accounts', () => {
  const accounts: Accounts = reactive(restore())

  function store() {
    storage.setItem('accounts', JSON.stringify(accounts))
  }

  function restore() {
    return {
      ...Object.fromEntries(Object.entries(translators).map(([item]) => [item, {}])),
      ...JSON.parse(storage.getItem('accounts') || '{}'),
    }
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
    store()
  }

  return { get, getAll, putAll }
})
