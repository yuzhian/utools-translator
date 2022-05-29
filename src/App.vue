<template>
  <a-config-provider :csp="zhCN">
    <a-tabs v-model:activeKey="activeKey" h="screen" p="1">
      <a-tab-pane v-for="item of 3" :key="item" :tab="'Tab ' + item">
        <Translator :translate="baiduTranslate" />
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
import baiduTranslate from '/src/plugins/translator/baidu'

const activeKey = ref(1)
const appConfigModal = ref()
</script>
