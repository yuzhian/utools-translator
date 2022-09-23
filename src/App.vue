<template>
  <div class="h-screen w-screen flex justify-center items-center">
    <AButton type="primary" @click="handleClick">AntDV Button</AButton>
  </div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue'

const handleClick = () => {
  message.info('Hello AntDV')
}
</script>
