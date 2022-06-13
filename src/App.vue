<template>
  <a-config-provider :csp="zhCN">
    <a-tabs v-model:activeKey="activeKey" h="screen" p="1">
      <a-tab-pane v-for="{ name, languages, translate } of translators" :key="name" :tab="name">
        <Translator :languages="languages" :translate="translate" />
      </a-tab-pane>
      <template #rightExtra>
        <AButton type="link" size="large" @click="appConfigModal.changeVisible(true)">
          <template #icon><SettingOutlined /></template>
        </AButton>
      </template>
    </a-tabs>
  </a-config-provider>
  <AppConfiguratorModal ref="appConfigModal" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { SettingOutlined } from '@ant-design/icons-vue'
import { translators } from '/src/plugins/translator'

const activeKey = ref(translators[0]?.name)
const appConfigModal = ref()
</script>
