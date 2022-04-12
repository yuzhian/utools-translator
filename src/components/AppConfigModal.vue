<template>
  <a-modal v-model:visible="visible" title="设置" @cancel="changeVisible(false)" @ok="saveAccounts">
    <div v-for="(v, k) in accounts" :key="k">
      <div>{{ k }}</div>
      <div class="grid grid-cols-2 gap-2">
        <AInput v-model:value="accounts[k]['appid']" placeholder="请输入应用ID" />
        <AInputPassword v-model:value="accounts[k]['secret']" placeholder="请输入密钥"  />
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { cloneDeep } from 'lodash'
import { useAccountStore } from '/src/store/configurator'
import { message } from 'ant-design-vue'

const accountStore = useAccountStore()

const accounts = ref()
const loadAccounts = () => {
  accounts.value = cloneDeep(accountStore.getAll())
}
const saveAccounts = () => {
  accountStore.putAll(accounts.value)
  message.success('已保存')
  changeVisible(false)
}

const visible = ref<boolean>(false)
const changeVisible = (val: boolean) => {
  val && loadAccounts()
  visible.value = val
}

defineExpose({
  changeVisible,
})
</script>
