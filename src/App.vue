<template>
  <input v-model="text" type="text" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const text = ref<string>()

if (window.utools) {
  window.utools.onPluginEnter(({ payload }) => {
    text.value = payload
  })
}
</script>
