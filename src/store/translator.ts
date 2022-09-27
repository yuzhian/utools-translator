import { reactive, computed } from 'vue'
import { defineStore } from 'pinia'
import { translators } from '/src/plugins/translator'
import * as storage from '/src/plugins/storage'

export default defineStore('services', () => {
  const services = reactive<Service[]>(restore())
  const maps = computed(() => Object.fromEntries(services.map(item => [item.key, item])))

  function store() {
    storage.setItem('services', JSON.stringify(services))
  }

  function restore() {
    const keys: string[] = Object.keys(translators)
    const stored: Service[] = JSON.parse(storage.getItem('services') || '[]').filter((item: Service) => keys.includes(item.key))
    const missed: Service[] = keys.filter(key => !stored.find(s => s.key === key)).map(key => ({ key, enable: true }))
    return stored.concat(missed)
  }

  function get(key: string) {
    return maps.value[key]
  }

  function putAll(data: Service[]) {
    services.splice(0, services.length, ...data)
    store()
  }

  return { services, get, putAll }
})
