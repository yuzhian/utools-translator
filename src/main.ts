import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import VueFinalModal from 'vue-final-modal'

import 'virtual:windi.css'

createApp(App).use(store).use(VueFinalModal()).mount('#app')
