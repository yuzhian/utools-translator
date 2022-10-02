<template>
  <a-space class="flex h-8">
    <a-input :value="hotkey.hotkey" placeholder="快捷键" style="width: 12rem" @keydown="handleKeydown" @keyup="handleKeyup" />
    <a-select v-model:value="hotkey.command" style="width: 14rem">
      <a-select-option v-for="(item, key) in commands" :key="key" :value="key" placeholder="可选操作">
        {{ item.label }}
      </a-select-option>
    </a-select>
    <a-button type="link" @click="emit('remove', hotkey)">
      <template #icon><DeleteOutlined /></template>
    </a-button>
  </a-space>
</template>

<script setup lang="ts">
import { isEmpty } from 'lodash-es'
import { DeleteOutlined } from '@ant-design/icons-vue'
import { commands } from '/src/plugins/command'

const { hotkey } = defineProps<{
  hotkey: Hotkey
}>()

const emit = defineEmits(['update:hotkey', 'remove'])
const updateHotkey = (append: Hotkey) => emit('update:hotkey', { ...hotkey, ...append })

// 单独按以下键则清空输入框
const EMPTY_KEYS = ['Meta', 'Control', 'Shift', 'Alt', 'CapsLock', ' ', 'Backspace', 'Delete']
// 将组合键映射为hotkeys键名
const MODIFIERS = { altKey: 'alt', ctrlKey: 'ctrl', shiftKey: 'shift' }
// 绑定操作是否进行中, 用于解决keyup时, 组合键逐个弹起的问题
let listening = false
// 按键按下时绑定, 如果无组合键, 则默认与ctrl组合, 用+拼接
const handleKeydown = (e: any) => {
  listening = true
  const modifiers = Object.entries(MODIFIERS)
    .filter(([key]) => e[key])
    .map(([key, value]) => value)
  updateHotkey({ hotkey: [...(isEmpty(modifiers) ? ['ctrl'] : modifiers), EMPTY_KEYS.includes(e.key) ? '' : e.key].join('+') })
}
// 按键弹起时, 如果按键不支持, 则清空
const handleKeyup = (e: KeyboardEvent) => {
  if (!listening) return
  listening = false
  if (EMPTY_KEYS.includes(e.key)) updateHotkey({ hotkey: '' })
}
</script>
