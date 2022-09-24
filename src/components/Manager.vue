<template>
  <a-drawer v-model:visible="visible" title="设置" width="32rem" @close="visibleTo(false)">
    <template #extra>
      <a-space>
        <a-button @click="visibleTo(false)">取消</a-button>
        <a-button type="primary" @click="saveAccounts">保存</a-button>
      </a-space>
    </template>

    <!-- 账号配置 -->
    <a-space v-for="({ name, type }, k) in translators" :key="k" class="my-2 flex">
      <div class="w-20 text-right">{{ name }}</div>
      <a-checkbox v-model:checked="accounts[k]['enable']" />
      <a-space class="flex">
        <a-input v-if="['secret'].includes(type)" v-model:value="accounts[k]['appid']" placeholder="请输入应用ID" class="w-full" />
        <a-input-password v-if="['secret'].includes(type)" v-model:value="accounts[k]['secret']" placeholder="请输入密钥" class="w-full" />
      </a-space>
    </a-space>
  </a-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { cloneDeep } from 'lodash-es'
import { message } from 'ant-design-vue'
import { translators } from '/src/plugins/translator'
import useTranslatorStore from '/src/store/translator'

const translatorStore = useTranslatorStore()
const emit = defineEmits(['confirm'])

const accounts = ref()
const loadAccounts = () => {
  accounts.value = { ...Object.fromEntries(Object.keys(translators).map((key: string) => [key, {}])), ...cloneDeep(translatorStore.getAll()) }
}

const saveAccounts = () => {
  translatorStore.putAll(accounts.value)
  message.success('已保存')
  emit('confirm')
  visibleTo(false)
}

const visible = ref(false)
const visibleTo = (_visible: boolean) => {
  _visible && loadAccounts()
  visible.value = _visible
}

defineExpose({
  visibleTo,
})
</script>
