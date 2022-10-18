import { reactive } from 'vue'
import { defineStore } from 'pinia'
import * as storage from '/src/plugins/storage'

export default defineStore('languages', () => {
  const languages = reactive<Record<string, string[]>>(JSON.parse(storage.getItem('languages') || '{}'))

  function get(key: string) {
    return languages[key] || (languages[key] = ['zh', 'en'])
  }

  function push(key: string, language: string) {
    languages[key] = [language].concat((languages[key] || []).filter(item => item !== language)).slice(0, 3)
    storage.setItem('languages', JSON.stringify(languages))
  }

  return { get, push }
})
