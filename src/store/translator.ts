import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { translators } from '/src/plugins/translator'
import * as storage from '/src/plugins/storage'

export default defineStore('accounts', () => {
  const accounts: Accounts = reactive(restore())

  function store() {
    storage.setItem('accounts', JSON.stringify(accounts))
  }

  function restore() {
    const dft = { enable: true }
    return {
      ...Object.fromEntries(Object.keys(translators).map(key => [key, { ...dft }])),
      ...JSON.parse(storage.getItem('accounts') || '{}'),
    }
  }

  function getAll() {
    return accounts
  }

  function get(app: string) {
    return accounts[app] ?? {}
  }

  function isEnable(app: string) {
    return get(app).enable
  }

  function putAll(obj: Accounts) {
    for (const [key, val] of Object.entries(obj)) {
      accounts[key] = val
    }
    store()
  }

  return { get, getAll, putAll, isEnable }
})
