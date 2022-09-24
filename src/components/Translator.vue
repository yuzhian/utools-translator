<template>
  <div class="flex justify-between py-1 -mx-1">
    <a-dropdown v-for="p of ['from', 'to']" :key="p" :trigger="['click']" class="mx-1">
      <!-- 遍历所有可用语言 -->
      <template #overlay>
        <a-menu @click="({ key }) => (src[p] = key)">
          <a-menu-item v-for="{ label, key } of translator.languages" :key="key">
            {{ label }}
          </a-menu-item>
        </a-menu>
      </template>

      <a-button block>
        <!-- 当前选用语言和猜测语言 -->
        {{ label(src[p]) }}
        {{ src[p] === 'auto' && label(dst[p]) ? `(${label(dst[p])})` : '' }}
      </a-button>
    </a-dropdown>
  </div>

  <div class="flex justify-between -mx-1">
    <a-textarea ref="input" v-model:value="src.value" class="mx-1 resize-none" @change="handleSrcChange" />
    <a-textarea :value="dst.value" readonly class="mx-1 resize-none" />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import { debounce } from 'lodash-es'

const { translator } = defineProps<{
  translator: Translator
}>()

const emit = defineEmits(['srcChange'])
const handleSrcChange = (e: Event) => emit('srcChange', (e.target as HTMLInputElement).value)

const src = reactive<any>({ value: '', from: translator.languages[0]?.key, to: translator.languages[0]?.key })
const dst = reactive<any>({ value: '', from: '', to: '' })

const label = (k: string) => translator.languages.find(({ key }) => key === k)?.label

// 翻译调用
const handleTranslate = async () => {
  if (!src.value) {
    return Object.assign(dst, { value: '', from: '', to: '' })
  }
  try {
    const result = await translator.translate?.(src.value, src.from, src.to)
    return Object.assign(dst, result)
  } catch (err: any) {
    typeof err === 'string' ? message.error(err) : console.error(err)
  }
}

watch([src], debounce(handleTranslate, translator.delay || 1000, { leading: true, trailing: true }))

// 聚焦输入框
const input = ref()

defineExpose({
  setSrc: (value: string) => (src.value = value),
  focusInput: () => input?.value?.focus(),
})
</script>

<style scoped>
textarea.ant-input {
  height: calc(100vh - 46px - 40px - 8px); /* 服务tabs, 语言选择, 外边框 */
}
</style>
