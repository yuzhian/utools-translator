<template>
  <a-row :gutter="8" p="y-1">
    <a-col v-for="prop of emitProps" :key="prop" :span="12">
      <a-dropdown>
        <template #overlay>
          <a-menu @click="({ key }) => handleEmit(prop, key)">
            <a-menu-item v-for="{ label, value } of langs" :key="value">{{ label }}</a-menu-item>
          </a-menu>
        </template>
        <a-button block>{{ langs.find(({ value }) => value === props[prop])?.['label'] }}</a-button>
      </a-dropdown>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { RetweetOutlined } from '@ant-design/icons-vue'

const emitProps: ['from', 'to'] = ['from', 'to']
const emit = defineEmits(['update:from', 'update:to'])
const handleEmit = (prop: 'from' | 'to', key: string) => emit(`update:${prop}`, key)

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
</script>
