<template>
  <a-space class="flex h-8">
    <div class="w-20 text-right">{{ translator.name }}</div>
    <a-checkbox v-model:checked="service.enable" />

    <a-space v-if="['free'].includes(translator.type)" class="flex"> 免费服务, 无需配置 </a-space>

    <a-space v-if="['secret'].includes(translator.type)" class="flex">
      <a-input v-model:value="service.appid" placeholder="应用ID" class="w-full" />
      <a-input-password v-model:value="service.secret" placeholder="密钥" class="w-full" />
    </a-space>

    <a-space v-if="['token'].includes(translator.type)" class="flex">
      <a-input v-model:value="service.token" placeholder="令牌" class="w-full" />
    </a-space>
  </a-space>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const { service, translator } = defineProps<{
  service: Service
  translator: Translator
}>()
</script>
