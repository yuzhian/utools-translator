<template>
  <a-modal v-model:visible="visible" title="设置" @cancel="changeVisible(false)" @ok="saveAccounts">
    <div v-for="(v, k) in accounts" :key="k">
      <div>{{ k }}</div>
      <div class="grid grid-cols-2 gap-2">
        <input v-model="accounts[k]['appid']" placeholder="请输入应用ID" type="text" />
        <input v-model="accounts[k]['secret']" placeholder="请输入密钥" type="password" />
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import cloneDeep from 'lodash/cloneDeep'
import store from '/src/store'
import { message } from 'ant-design-vue'

const accounts = ref()
const loadAccounts = () => {
  accounts.value = cloneDeep(store.getters.accounts())
}
const saveAccounts = () => {
  store.commit('setAccounts', accounts.value)
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
