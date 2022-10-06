<template>
  <a-config-provider :locale="zhCN">
    <!-- 遍历启用的翻译服务 -->
    <a-tabs v-model:activeKey="activeTranslator" class="h-screen p-1">
      <template v-for="{ key, enable } of serviceStore.services">
        <a-tab-pane v-if="enable" :key="key">
          <template #tab>
            <img :src="translators[key].icon || '/translate.png'" class="inline-block w-4 h-4" />
            <span class="text-sm mx-1">{{ translators[key].name }}</span>
          </template>
          <!-- 翻译器 -->
          <Translator :ref="elRef => keeptr(elRef, key.toString())" :translator="translators[key]" @update="updateData" />
        </a-tab-pane>
      </template>

      <!-- 配置按钮 -->
      <template #rightExtra>
        <a-button type="link" size="large" @click="managerComponent.visibleTo(true)">
          <template #icon><SettingOutlined /></template>
        </a-button>
      </template>
    </a-tabs>

    <!-- 配置面板 -->
    <Manager ref="managerComponent" @confirm="handleConfigChange" />
  </a-config-provider>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, reactive } from 'vue'
import { cloneDeep } from 'lodash-es'
import hotkeys from 'hotkeys-js'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { Key } from 'ant-design-vue/lib/_util/type'
import { SettingOutlined } from '@ant-design/icons-vue'
import { translators } from '/src/plugins/translator'
import { commands } from '/src/plugins/command'
import useServiceStore from '/src/store/service'
import useHotkeyStore from '/src/store/hotkey'
import hotkey from '/src/store/hotkey'
const serviceStore = useServiceStore()
const hotkeyStore = useHotkeyStore()

// 保留原文和译文
const data = reactive<{ src: TranslateEntity; dst: TranslateEntity }>({ src: {}, dst: {} })
const updateData = (_data: { src: TranslateEntity; dst: TranslateEntity }) => Object.assign(data, _data)

// dom引用
const managerComponent = ref()
const trs: Record<string, any> = {}
const keeptr = (elRef: any, key: string) => elRef && (trs[key] = elRef)

// 活动的翻译器
const activeTranslator = ref(serviceStore.services.find(({ enable }) => enable)?.key || serviceStore.services[0].key)
watch(activeTranslator, (key: Key) => nextTick(() => updateSrc(key, data.src)))

const updateSrc = (key: Key, src: TranslateEntity) => {
  trs[key].updateSrc((data.src = src))
  trs[key].focusInput()
}

// 绑定快捷键
const bindHotkeys = () => {
  hotkeys.filter = () => true
  hotkeys(hotkeyStore.hotkeys.map(item => item.hotkey).join(','), { scope: 'application' }, (event, handler) => {
    event.preventDefault()
    commands[hotkeyStore.get(handler.key).command]?.exec({ data: cloneDeep(data) })
  })
  hotkeys.setScope('application')
}
bindHotkeys()

// 配置更改回调, 重设翻译器, 重新绑定快捷键
const handleConfigChange = () => {
  if (serviceStore.get(activeTranslator.value)?.enable) {
    updateSrc(activeTranslator.value, data.src)
  } else {
    activeTranslator.value = serviceStore.services.find(({ enable }) => enable)?.key || serviceStore.services[0].key
  }
  hotkeys.deleteScope('application')
  bindHotkeys()
}

// utools api, 本插件被调用时的回调, 用于初始化原文值. see https://u.tools/docs/developer/api.html#onpluginenter-callback
window.utools?.onPluginEnter(({ payload }) => {
  updateSrc(activeTranslator.value, { value: payload })
})
</script>
