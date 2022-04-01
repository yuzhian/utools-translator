<template>
  <select :value="props.from" @input="event => emit('update:from', event.target.value)">
    <option v-for="{ label, value } of langs" :key="value" :value="value">{{ label }}</option>
  </select>
  <div class="inline-block mx-1 cursor-pointer select-none" @click="handleExchange">↔</div>
  <select :value="props.to" @input="event => emit('update:to', event.target.value)">
    <option v-for="{ label, value } of langs" :key="value" :value="value">{{ label }}</option>
  </select>
</template>

<script setup lang="ts">
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
