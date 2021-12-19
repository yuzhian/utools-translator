<template>
  <main class="p-1">
    <Translator :fn="baiduTranslate" />
    <AppConfigModal ref="appConfigModal" />
    <button class="fixed bottom-2 left-2" @click="appConfigModal.changeVisible(true)">设置</button>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import baiduTranslate from './utils/translator/baidu'
import Translator from '/src/components/Translator.vue'
import AppConfigModal from '/src/components/AppConfigModal.vue'

const appConfigModal = ref()
</script>
