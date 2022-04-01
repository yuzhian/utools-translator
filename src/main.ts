import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'

import 'virtual:windi.css'

createApp(App).use(createPinia()).mount('#app')
