<template>
  <main w="screen" h="screen" p="1" bg="gray-100">
    <a-config-provider :locale="zhCN">
      <Translator :fn="baiduTranslate" />
      <AppConfigModal ref="appConfigModal" />
      <AButton type="link" class="fixed bottom-0 left-0" @click="appConfigModal.changeVisible(true)">设置</AButton>
    </a-config-provider>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import zhCN from 'ant-design-vue/es/locale/zh_CN'
import baiduTranslate from '/src/plugins/translator/baidu'

const appConfigModal = ref()
</script>
