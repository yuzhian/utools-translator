<template>
  <input :value="props.from" type="text" @input="($event: any) => emit('update:from', $event.target.value)" />
  <div style="display: inline-block; margin: 0 0.25rem; cursor: pointer" @click="handleExchange">↔</div>
  <input :value="props.to" type="text" @input="($event: any) => emit('update:to', $event.target.value)" />
</template>

<script setup lang="ts">
const emit = defineEmits(['update:from', 'update:to'])
const props = defineProps({
  from: String,
  to: String,
})

const handleExchange = () => {
  const temp = props.from
  emit('update:from', props.to)
  emit('update:to', temp)
}
</script>
