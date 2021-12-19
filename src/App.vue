<template>
  <main>
    <textarea v-model="src" :rows="10" />
    <div>{{ dst }}</div>
  </main>
</template>

<script setup lang="ts">
import baiduTranslate from './utils/translator/baidu'
import { ref, watch } from 'vue'

const src = ref<string>('') // 原文
const dst = ref<string>('') // 译文

// 原文更新, 调用翻译接口产生译文
watch(
  () => src.value,
  val => {
    baiduTranslate(val, 'zh', 'en').then((result: string) => {
      dst.value = result
    })
  }
)

// utools api, 本插件被调用时的回调. see https://u.tools/docs/developer/api.html#onpluginenter-callback
if (window.utools) {
  window.utools.onPluginEnter(({ payload }) => {
    src.value = payload
  })
}
</script>

<style scoped>
main {
  padding: 0.25rem;
}
textarea {
  width: 100%;
}
</style>
