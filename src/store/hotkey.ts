import { reactive, computed } from 'vue'
import { defineStore } from 'pinia'
import * as storage from '/src/plugins/storage'

export default defineStore('hotkeys', () => {
  const hotkeys = reactive<Hotkey[]>(restore())
  const maps = computed(() => Object.fromEntries(hotkeys.map(item => [item.hotkey, item])))

  function store() {
    storage.setItem('hotkeys', JSON.stringify(hotkeys))
  }

  function restore() {
    return JSON.parse(storage.getItem('hotkeys') || '[]')
  }

  function get(key: string) {
    return maps.value[key]
  }

  function putAll(data: Hotkey[]) {
    hotkeys.splice(0, hotkeys.length, ...data)
    store()
  }

  return { hotkeys, get, putAll }
})
