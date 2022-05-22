<template>
  <div class="m-1">
    <ATextarea ref="input" v-model:value="src" :rows="10" class="w-full" />
    <LanguageSelector v-model:from="trans.from" v-model:to="trans.to" class="w-full" />
    <p v-for="(item, index) of dst" :key="index">{{ item }}</p>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'

const props = defineProps({
  fn: Function,
})

const src = ref<string>() // 原文
const dst = ref<string[]>() // 译文段落集
const trans = reactive({
  from: 'auto',
  to: 'auto',
})

// 翻译调用
const fetchTranslation = () => {
  if (!src.value) {
    dst.value = []
    return
  }
  props.fn?.(src.value, trans.from, trans.to).then((result: string) => {
    dst.value = result.split('\n')
  })
}

// 防抖
const wait = 800
let timeoutID: number
const debounce = (fn: Function) => {
  if (timeoutID) clearTimeout(timeoutID)
  timeoutID = setTimeout(() => fn(), wait)
}

// 监听原文和语种, 任一变化后都将重新翻译
watch([src, trans], () => debounce(fetchTranslation))

// 聚焦输入框
const input = ref()
const focusInput = () => input?.value?.focus()

// utools api, 本插件被调用时的回调, 用于初始化原文值. see https://u.tools/docs/developer/api.html#onpluginenter-callback
if (window.utools) {
  window.utools.onPluginEnter(({ payload }) => {
    src.value = payload
    focusInput()
  })
}
</script>
