<template>
  <div class="h-screen w-screen flex justify-center items-center">
    <ASpace>
      <AInput v-model:value="text" />
      <AButton type="primary" @click="handleClick">AntDV Button</AButton>
    </ASpace>
  </div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue'
import { ref } from 'vue'

const text = ref<string>('')

const handleClick = () => {
  message.info('验证跨域请求处理, 打开控制台查看')
  fetch('https://www.baidu.com')
    .then(response => console.log(response))
    .catch(error => console.error(error))
}

// utools api, 本插件被调用时的回调, 用于初始化原文值. see https://u.tools/docs/developer/api.html#onpluginenter-callback
window.utools?.onPluginEnter(({ payload }) => {
  text.value = payload
})
</script>
