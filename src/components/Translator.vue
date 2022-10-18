<template>
  <div class="flex justify-between py-1">
    <a-tabs v-model:activeKey="src.from" class="w-[calc(50%-0.25rem)]" @change="activeKey => handleLanguageChange('from', activeKey.toString())">
      <a-tab-pane key="auto" :tab="dst.from ? `检测到${languageLocale[dst.from]}` : languageLocale['auto']" />
      <a-tab-pane v-for="key of languageTabs.from" :key="key" :tab="languageLocale[key]" :disabled="!translator.languages.map(([k]) => k).includes(key)" />
      <template #rightExtra>
        <a-button type="text" @click="() => handleDrawerChange('from')">
          <UpOutlined v-if="drawerData.optype === 'from'" />
          <DownOutlined v-else />
        </a-button>
      </template>
    </a-tabs>
    <a-tabs v-model:activeKey="src.to" class="w-[calc(50%-0.25rem)]" @change="activeKey => handleLanguageChange('to', activeKey.toString())">
      <a-tab-pane
        v-for="key of languageTabs.to"
        :key="key"
        :tab="languageLocale[key]"
        :disabled="!translator.languages.find(([k]) => k === src.from)?.[2]?.includes(key)" />
      <template #rightExtra>
        <a-button type="text" @click="() => handleDrawerChange('to')">
          <UpOutlined v-if="drawerData.optype === 'to'" />
          <DownOutlined v-else />
        </a-button>
      </template>
    </a-tabs>
  </div>

  <div class="flex justify-between -mx-1 relative overflow-hidden">
    <a-drawer
      :visible="!!drawerData.optype"
      :closable="false"
      :get-container="false"
      placement="top"
      class="absolute"
      :bodyStyle="{ overflowX: 'hidden' }"
      @close="() => (drawerData.optype = false)">
      <template #title>
        <a-input v-model:value="drawerData.searchText" placeholder="搜索语种" allow-clear />
      </template>
      <a-list :data-source="computedLanguages" :grid="{ gutter: 16, xs: 2, sm: 4, md: 6, lg: 8, xl: 10, xxl: 12, xxxl: 14 }">
        <template #renderItem="{ item }">
          <a-list-item>
            <a-checkable-tag
              :checked="drawerData.key === item.key"
              class="w-full"
              @change="() => drawerData.optype && handleLanguageChange(drawerData.optype, item.key, true)"
              >{{ item.label }}
            </a-checkable-tag>
          </a-list-item>
        </template>
      </a-list>
    </a-drawer>
    <a-textarea ref="input" v-model:value="src.value" class="mx-1 resize-none" />
    <a-textarea :value="dst.value" readonly class="mx-1 resize-none" />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch, computed } from 'vue'
import { message } from 'ant-design-vue'
import { debounce, throttle, cloneDeep } from 'lodash-es'
import { translators, languageLocale, languageOptions } from '/src/plugins/translator'
import { DownOutlined, UpOutlined } from '@ant-design/icons-vue'
import useLanguageStore from '/src/store/language'
const languageStore = useLanguageStore()

// >>>>>>>>>>>> 翻译功能 >>>>>>>>>>>>>>>>>>>>>>>>
const { translator } = defineProps<{ translator: Translator }>()

// 原文译文, 指定的源语种/目标语种, 响应猜测的源语种/目标语种
const src = reactive<TranslateEntity>({ from: 'auto', to: languageStore.get('to')[0] })
const dst = reactive<TranslateEntity>({})

// 翻译服务请求
const mapping = (key: string | undefined) => {
  const code = translator.languages.find(([k]) => k === key)?.[1]
  if (code == null) throw `翻译服务不支持${languageLocale[key || '']}`
  return code
}
const handleTranslate = async () => {
  if (!src.value) {
    return Object.assign(dst, { value: '', from: '', to: '' })
  }
  try {
    const result = await translator.translate?.(src.value, mapping(src.from), mapping(src.to))
    result.from = translator.languages.find(([k, c]) => c === result.from)?.[0]
    result.to = translator.languages.find(([k, c]) => c === result.to)?.[0]
    return Object.assign(dst, result)
  } catch (err: any) {
    typeof err === 'string' ? message.error(err) : console.error(err)
  }
}
// 输入防抖(300), 接口限流(默认0)
const throttled = throttle(handleTranslate, translator.interval || 0, { leading: true, trailing: true })
watch(src, debounce(throttled, 300))

// >>>>>>>>>>>> 语种切换 >>>>>>>>>>>>>>>>>>>>>>>>
type optype = 'from' | 'to'
const sortedLanguages = languageOptions.sort((v1, v2) => v1.label?.localeCompare(v2.label))
const computedLanguages = computed(() => sortedLanguages.filter(item => !drawerData.searchText || item.label?.includes(drawerData.searchText)))

const drawerData = reactive<{ optype: optype | false; key: string; searchText: string }>({ optype: false, key: '', searchText: '' })
const handleDrawerChange = (type: optype) => {
  if (drawerData.optype === type) {
    drawerData.optype = false
  } else {
    Object.assign(drawerData, { optype: type, key: src[type], searchText: '' })
  }
}
// 语种数组
const languageTabs = reactive<Record<optype, string[]>>({ from: cloneDeep(languageStore.get('from')), to: cloneDeep(languageStore.get('to')) })
const handleLanguageChange = (type: optype, language: string, refresh: boolean = false) => {
  if (language === 'auto') {
    src[type] = language
    return
  }
  src[type] = language
  languageStore.push(type, language)
  if (refresh) {
    languageTabs[type] = cloneDeep(languageStore.get(type))
  }
  drawerData.optype = false
}

// >>>>>>>>>>>> 对外提供 >>>>>>>>>>>>>>>>>>>>>>>>
const emit = defineEmits(['update'])
watch([src, dst], ([_src, _dst]) => {
  emit('update', { src: _src, dst: _dst })
})

const input = ref()
defineExpose({
  updateSrc: (_src: TranslateEntity) => Object.assign(src, _src),
  focusInput: () => input?.value?.focus(),
})
</script>

<style scoped>
textarea.ant-input {
  height: calc(100vh - 46px - 54px - 8px); /* 服务tabs, 语种选择, 外边框 */
}
</style>
