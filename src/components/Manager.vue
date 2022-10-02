<template>
  <a-drawer v-model:visible="visible" title="设置" width="32rem" @close="visibleTo(false)">
    <template #extra>
      <a-space>
        <a-button @click="visibleTo(false)">取消</a-button>
        <a-button type="primary" @click="submit">保存</a-button>
      </a-space>
    </template>

    <a-space direction="vertical">
      <a-card title="账号配置">
        <draggable :list="services" item-key="key">
          <template #item="{ element }">
            <a-card-grid class="w-full">
              <ServiceForm :service="element" :translator="translators[element.key]" />
            </a-card-grid>
          </template>
        </draggable>
      </a-card>

      <a-card title="快捷键配置">
        <draggable :list="hotkeys" item-key="key">
          <template #item="{ index }">
            <a-card-grid class="w-full">
              <HotkeyForm v-model:hotkey="hotkeys[index]" @remove="handleHotkeyRemove" />
            </a-card-grid>
          </template>
          <template #footer>
            <a-card-grid :hoverable="false" class="w-full">
              <a-button type="primary" block @click="handleHotkeyAdd">添加</a-button>
            </a-card-grid>
          </template>
        </draggable>
      </a-card>
    </a-space>
  </a-drawer>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { cloneDeep, remove } from 'lodash-es'
import { message } from 'ant-design-vue'
import { translators } from '/src/plugins/translator'
import useServiceStore from '/src/store/service'
import useHotkeyStore from '/src/store/hotkey'
import draggable from 'vuedraggable'
import hk from 'hotkeys-js'

const serviceStore = useServiceStore()
const services = reactive<Service[]>(cloneDeep(serviceStore.services))

const hotkeyStore = useHotkeyStore()
const hotkeys = reactive<Hotkey[]>(cloneDeep(hotkeyStore.hotkeys))

const handleHotkeyAdd = () => {
  hotkeys.push({})
}
const handleHotkeyRemove = (hotkey: Hotkey) => {
  remove(hotkeys, (item: Hotkey) => item === hotkey)
}

const emit = defineEmits(['confirm'])
const submit = () => {
  serviceStore.putAll(services)
  hotkeyStore.putAll(cloneDeep(hotkeys.filter(item => item.command && item.hotkey)))
  message.success('已保存')
  emit('confirm')
  visibleTo(false)
}

const visible = ref(false)
const visibleTo = (_visible: boolean) => {
  visible.value = _visible
  hk.setScope(_visible ? '' : 'application')
  if (!_visible) return
  services.splice(0, services.length, ...cloneDeep(serviceStore.services))
  hotkeys.splice(0, hotkeys.length, ...cloneDeep(hotkeyStore.hotkeys))
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
