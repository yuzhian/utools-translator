<template>
  <main>
    <Translator :fn="baiduTranslate" />
  </main>
</template>

<script setup lang="ts">
import baiduTranslate from './utils/translator/baidu'
import Translator from '/src/components/Translator.vue'
</script>
