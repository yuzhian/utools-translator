<template>
  <textarea ref="input" v-model="src" :rows="10" class="w-full" />
  <FromTo v-model:from="trans.from" v-model:to="trans.to" />
  <div>{{ dst }}</div>
</template>

<script setup lang="ts">
import { reactive, ref, watch, onMounted } from 'vue'
import FromTo from '/src/components/FromTo.vue'

const props = defineProps({
  fn: Function,
})

const src = ref<string>('') // 原文
const dst = ref<string>('') // 译文
const trans = reactive({
  from: 'zh',
  to: 'en',
})

// 防抖
const wait = 800
let timeoutID: number
const debounce = (fn: Function) => {
  if (timeoutID) clearTimeout(timeoutID)
  timeoutID = setTimeout(() => fn(), wait)
}

// 监听原文和语种, 任一变化后都将重新翻译
watch([src, trans], () => {
  debounce(() => {
    if (!src.value) {
      dst.value = ''
      return
    }
    props.fn?.(src.value, trans.from, trans.to).then((result: string) => {
      dst.value = result
    })
  })
})

// 加载后聚焦
const input = ref()
onMounted(() => {
  input.value.focus()
})

// utools api, 本插件被调用时的回调, 用于初始化原文值. see https://u.tools/docs/developer/api.html#onpluginenter-callback
if (window.utools) {
  window.utools.onPluginEnter(({ payload }) => {
    src.value = payload
  })
}
</script>
