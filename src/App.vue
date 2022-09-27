<template>
  <a-config-provider :locale="zhCN">
    <!-- 遍历启用的翻译服务 -->
    <a-tabs v-model:activeKey="activeTranslator" class="h-screen p-1">
      <template v-for="{ key, enable } of translatorStore.services">
        <a-tab-pane v-if="enable" :key="key">
          <template #tab>
            <img :src="translators[key].icon || '/translate.png'" class="inline-block w-4 h-4" />
            <span class="text-sm mx-1">{{ translators[key].name }}</span>
          </template>
          <!-- 翻译器 -->
          <Translator :ref="elRef => appendTranslatorRefs(elRef, key.toString())" :translator="translators[key]" @src-change="updateSrc" />
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
import { ref, watch, nextTick } from 'vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { Key } from 'ant-design-vue/lib/_util/type'
import { SettingOutlined } from '@ant-design/icons-vue'
import { translators } from '/src/plugins/translator'
import useTranslatorStore from '/src/store/translator'
const translatorStore = useTranslatorStore()

// 保留输入文本, 用于切换翻译服务时恢复
const src = ref<any>()
const updateSrc = (value: string) => (src.value = value)

// dom引用
const appConfigModal = ref()
const translatorRefs: { [key: string]: any } = {}
const appendTranslatorRefs = (elRef: any, key: string) => elRef && (translatorRefs[key] = elRef)

// 活动的翻译器
const activeTranslator = ref(translatorStore.services.find(({ enable }) => enable)?.key || translatorStore.services[0].key)
watch(activeTranslator, (key: Key) => nextTick(() => writeTo(key, src.value)))

const writeTo = (key: Key, text: string) => {
  translatorRefs[key].setSrc((src.value = text))
  translatorRefs[key].focusInput()
}

const handleConfigChange = () => {
  if (translatorStore.get(activeTranslator.value)?.enable) {
    writeTo(activeTranslator.value, src.value)
  } else {
    activeTranslator.value = translatorStore.services.find(({ enable }) => enable)?.key || translatorStore.services[0].key
  }
}

// utools api, 本插件被调用时的回调, 用于初始化原文值. see https://u.tools/docs/developer/api.html#onpluginenter-callback
if (window.utools) {
  window.utools.onPluginEnter(({ payload }) => {
    writeTo(activeTranslator.value, payload)
  })
}
</script>
