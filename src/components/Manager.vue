<template>
  <a-drawer v-model:visible="visible" title="设置" width="32rem" @close="visibleTo(false)">
    <template #extra>
      <a-space>
        <a-button @click="visibleTo(false)">取消</a-button>
        <a-button type="primary" @click="submit">保存</a-button>
      </a-space>
    </template>

    <a-card title="账号配置">
      <draggable :list="services" item-key="key">
        <template #item="{ element }">
          <a-card-grid class="w-full">
            <ServiceForm :service="element" :translator="translators[element.key]" />
          </a-card-grid>
        </template>
      </draggable>
    </a-card>
  </a-drawer>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { cloneDeep } from 'lodash-es'
import { message } from 'ant-design-vue'
import { translators } from '/src/plugins/translator'
import useTranslatorStore from '/src/store/translator'
import draggable from 'vuedraggable'

const translatorStore = useTranslatorStore()
const services = reactive<Service[]>(cloneDeep(translatorStore.services))

const emit = defineEmits(['confirm'])
const submit = () => {
  translatorStore.putAll(services)
  message.success('已保存')
  emit('confirm')
  visibleTo(false)
}

const visible = ref(false)
const visibleTo = (_visible: boolean) => {
  _visible && services.splice(0, services.length, ...cloneDeep(translatorStore.services))
  visible.value = _visible
}

defineExpose({
  visibleTo,
})
</script>

<style lang="less" scoped>
:deep(.ant-card-body) {
  padding: 0;
  .ant-card-grid {
    padding: 1rem;
  }
}
</style>
