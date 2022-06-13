<template>
  <LanguageSelector :languages="props.languages" v-model:from="trans.from" v-model:to="trans.to" />
  <a-row :gutter="8">
    <a-col :span="12">
      <textarea ref="input" v-model="src" h="[calc(100vh-92px)]" w="full" resize="none" border="2 rounded-none gray-500" />
    </a-col>
    <a-col :span="12">
      <div w="full" h="[calc(100vh-92px)]" overflow="x-hidden y-scroll" border="2 rounded-none gray-500">
        <p v-for="(item, index) of dst" :key="index">{{ item }}</p>
      </div>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue'
import { reactive, ref, watch } from 'vue'

const props = defineProps({
  languages: {} as { [key: string]: string },
  translate: Function,
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
  return props
    .translate?.(src.value, trans.from, trans.to)
    .then((result: string) => {
      dst.value = result.split('\n')
    })
    .catch((err: string) => {
      message.error(err)
    })
}

let timeoutID: number | null
const throttle = (fn: Function) => {
  if (timeoutID) return
  timeoutID = setTimeout(() => fn().then(() => (timeoutID = null)), 1000)
}

// 监听原文和语种, 任一变化后都将重新翻译
watch([src, trans], () => throttle(fetchTranslation))

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
