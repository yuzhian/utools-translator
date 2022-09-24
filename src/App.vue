<template>
  <a-config-provider :locale="zhCN">
    <!-- 遍历启用的翻译服务 -->
    <a-tabs v-model:activeKey="activeTranslator" class="h-screen p-1" @change="reloadTranslator">
      <template v-for="(translator, key) in translators">
        <a-tab-pane v-if="translatorStore.isEnable(key.toString())" :key="key">
          <template #tab>
            <img :src="translator.icon || '/translate.png'" class="inline-block w-4 h-4" />
            <span class="text-sm mx-1">{{ translator.name }}</span>
          </template>
          <!-- 翻译器 -->
          <Translator :ref="elRef => appendTranslatorRefs(elRef, key.toString())" :translator="translator" @src-change="updateSrc" />
        </a-tab-pane>
      </template>

      <!-- 配置按钮 -->
      <template #rightExtra>
        <a-button type="link" size="large" @click="appConfigModal.visibleTo(true)">
          <template #icon><SettingOutlined /></template>
        </a-button>
      </template>
    </a-tabs>

    <!-- 配置面板 -->
    <Manager ref="appConfigModal" @confirm="handleConfigChange" />
  </a-config-provider>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { Key } from 'ant-design-vue/lib/_util/type'
import { SettingOutlined } from '@ant-design/icons-vue'
import { translators } from '/src/plugins/translator'
import useTranslatorStore from '/src/store/translator'
const translatorStore = useTranslatorStore()

// 保留输入文本, 用于切换翻译服务时恢复
const src = ref<any>()
const updateSrc = (value: string) => (src.value = value)

// 翻译组件引用列表(对象, key为翻译服务名)
const translatorRefs: { [key: string]: any } = {}
const appendTranslatorRefs = (elRef: any, key: string) => elRef && (translatorRefs[key] = elRef)

// 设置组件引用
const appConfigModal = ref()

// 重新加载翻译组件
const reloadTranslator = (key: Key) =>
  nextTick(() => {
    translatorRefs[key].setSrc(src.value)
    translatorRefs[key].focusInput()
  })
// 活动的翻译组件: 如果之前的组件仍然启用则保持现状, 否则取启用的翻译列表第一项
const activeTranslator = ref(Object.keys(translators).filter(key => translatorStore.isEnable(key))[0])
const handleConfigChange = () => {
  translatorStore.isEnable(activeTranslator.value) || (activeTranslator.value = Object.keys(translators).filter(key => translatorStore.isEnable(key))[0])
  reloadTranslator(activeTranslator.value)
}

// utools api, 本插件被调用时的回调, 用于初始化原文值. see https://u.tools/docs/developer/api.html#onpluginenter-callback
if (window.utools) {
  window.utools.onPluginEnter(({ payload }) => {
    src.value = payload
    reloadTranslator(activeTranslator.value)
  })
}
</script>
