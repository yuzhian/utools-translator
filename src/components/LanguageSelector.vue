<template>
  <a-row :gutter="8" p="y-1">
    <a-col v-for="prop of emitProps" :key="prop" :span="12">
      <a-dropdown>
        <template #overlay>
          <a-menu @click="({ key }) => handleEmit(prop, key)">
            <a-menu-item v-for="{ label, value } of props.languages" :key="value">{{ label }}</a-menu-item>
          </a-menu>
        </template>
        <a-button block>{{ props.languages.find(({ value }) => value === props[prop])?.['label'] }}</a-button>
      </a-dropdown>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { RetweetOutlined } from '@ant-design/icons-vue'

const emitProps: ['from', 'to'] = ['from', 'to']
const emit = defineEmits(['update:from', 'update:to'])
const handleEmit = (prop: 'from' | 'to', key: string) => emit(`update:${prop}`, key)

const props = defineProps<{
  languages: [{ label: String; value: String }]
  from: String
  to: String
}>()
</script>
