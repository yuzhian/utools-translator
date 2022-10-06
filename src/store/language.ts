import { reactive } from 'vue'
import { defineStore } from 'pinia'
import * as storage from '/src/plugins/storage'

export default defineStore('languages', () => {
  const languages = reactive<string[]>(restore())

  function restore() {
    const str = storage.getItem('languages')
    return str ? JSON.parse(str) : ['zh', 'en', 'ja', 'ko', 'fr', 'zh-Hant']
  }

  return { languages }
})
