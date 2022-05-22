<template>
  <a-space class="my-2 justify-center">
    <a-select :value="props.from" class="w-40" @change="value => emit('update:from', value)">
      <a-select-option v-for="{ label, value } of langs" :key="value" :value="value">{{ label }}</a-select-option>
    </a-select>
    <a-button type="text" @click="handleExchange">
      <template #icon><RetweetOutlined /></template>
    </a-button>
    <a-select :value="props.to" class="w-40" @change="value => emit('update:to', value)">
      <a-select-option v-for="{ label, value } of langs" :key="value" :value="value">{{ label }}</a-select-option>
    </a-select>
  </a-space>
</template>

<script setup lang="ts">
import { RetweetOutlined } from '@ant-design/icons-vue'
const emit = defineEmits(['update:from', 'update:to'])
const props = defineProps({
  from: String,
  to: String,
})
const langs = [
  { label: '自动检测', value: 'auto' },
  { label: '中文', value: 'zh' },
  { label: '英文', value: 'en' },
  { label: '日语', value: 'jp' },
  { label: '俄语', value: 'ru' },
  { label: '文言文', value: 'wyw' },
  { label: '繁体中文', value: 'cht' },
  { label: '粤语', value: 'yue' },
]

const handleExchange = () => {
  const temp = props.from
  emit('update:from', props.to)
  emit('update:to', temp)
}
</script>
