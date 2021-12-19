<template>
  <vue-final-modal v-model="visible" classes="flex justify-center items-center" content-class="relative h-3/4 w-5/6 p-4 overflow-auto bg-white">
    <!-- 配置项主体 -->
    <div class="w-full h-[calc(100%-2rem)] overflow-auto">
      <div v-for="(v, k) in accounts">
        <div>{{ k }}</div>
        <div class="grid grid-cols-2 gap-2">
          <input v-model="accounts[k]['appid']" type="text" class="w-full" />
          <input v-model="accounts[k]['secret']" type="text" class="w-full" />
        </div>
      </div>
    </div>
    <div class="flex justify-center items-center h-7">
      <button class="mx-1" @click="changeVisible(false)">取消</button>
      <button class="mx-1" @click="saveAll()">保存</button>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

import store from '/src/store'

const accounts = reactive({
  ...JSON.parse(JSON.stringify(store.getters.accounts())),
})

const saveAll = () => {
  store.commit('setAccounts', accounts)
  changeVisible(false)
}

const visible = ref<boolean>(false)
const changeVisible = (val: boolean) => {
  visible.value = val
}

defineExpose({
  changeVisible,
})
</script>
