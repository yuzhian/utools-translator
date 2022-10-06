<template>
  <div class="flex justify-between py-1">
    <a-select v-model:value="src.from" class="w-[calc(50%-0.25rem)] text-center">
      <template #suffixIcon></template>
      <a-select-option key="auto" value="auto" :disabled="!translator.languages.map(([k]) => k).includes('auto')">{{ languageLocale['auto'] }}</a-select-option>
      <a-select-option v-for="key of languageStore.languages" :key="key" :value="key" :disabled="!translator.languages.map(([k]) => k).includes(key)">{{ languageLocale[key] }}</a-select-option>
    </a-select>
    <a-select v-model:value="src.to" class="w-[calc(50%-0.25rem)] text-center">
      <template #suffixIcon></template>
      <a-select-option v-for="key of languageStore.languages" :key="key" :value="key" :disabled="!translator.languages.find(([k]) => k === src.from)?.[2]?.includes(key)">{{ languageLocale[key] }}</a-select-option>
    </a-select>
  </div>

  <div class="flex justify-between -mx-1">
    <a-textarea ref="input" v-model:value="src.value" class="mx-1 resize-none" />
    <a-textarea :value="dst.value" readonly class="mx-1 resize-none" />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import { debounce, throttle } from 'lodash-es'
import { translators, languageLocale } from '/src/plugins/translator'
import useLanguageStore from '/src/store/language'
const languageStore = useLanguageStore()

const { translator } = defineProps<{ translator: Translator }>()

// 原文译文, 指定的源语言/目标语言, 响应猜测的源语言/目标语言
const src = reactive<TranslateEntity>({ from: 'auto', to: languageStore.languages[0] })
const dst = reactive<TranslateEntity>({})

// 翻译服务请求
const mapping = (key: string | undefined) => {
  const code = translator.languages.find(([k]) => k === key)?.[1]
  if (!code) throw `翻译服务不支持${languageLocale[key || '']}`
  return code
}
const handleTranslate = async () => {
  if (!src.value) {
    return Object.assign(dst, { value: '', from: '', to: '' })
  }
  try {
    const result = await translator.translate?.(src.value, mapping(src.from), mapping(src.to))
    return Object.assign(dst, result)
  } catch (err: any) {
    typeof err === 'string' ? message.error(err) : console.error(err)
  }
}
// 输入防抖(300), 接口限流(默认0)
const throttled = throttle(handleTranslate, translator.interval || 0, { leading: true, trailing: true })
watch(src, debounce(throttled, 300))

const emit = defineEmits(['update'])
watch([src, dst], ([_src, _dst]) => {
  emit('update', { src: _src, dst: _dst })
})

const input = ref()
defineExpose({
  updateSrc: (_src: TranslateEntity) => Object.assign(src, _src),
  focusInput: () => input?.value?.focus(),
})
</script>

<style scoped>
textarea.ant-input {
  height: calc(100vh - 46px - 40px - 8px); /* 服务tabs, 语言选择, 外边框 */
}
</style>
