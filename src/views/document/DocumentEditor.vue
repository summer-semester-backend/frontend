<template>
  <file-header ref="fileHeaderRef" :file-i-d="fileID">
    <template #extra>
      <n-space style="margin-right: 20px">
        <n-dropdown :options="options" @select="handleSelect">
          <n-button size="small">导出</n-button>
        </n-dropdown>
        <n-button size="small" @click="handleSave">保存为模板</n-button>
      </n-space>
    </template>
  </file-header>
  <n-layout has-sider>
    <n-layout-sider bordered>
      <DocumentTree :father-i-d="fileHeaderRef?.fileInfo.fatherID"></DocumentTree>
    </n-layout-sider>
    <n-layout>
      <AmEditor ref="AmEditorRef"></AmEditor>
    </n-layout>
  </n-layout>
</template>
<script setup lang="ts">
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import AmEditor from '@/components/editor/AmEditor.vue';
import FileHeader from '@/components/document/FileHeader.vue';
import { onMounted, ref, h, watch } from '@vue/runtime-core';
import { Component } from 'vue';
import { NDivider, NIcon, NInput } from 'naive-ui';
import { FilePdfOutlined, FileWordOutlined, FileMarkdownOutlined, Html5Outlined, SaveOutlined } from '@vicons/antd';
import router from '@/router';
var route = useRoute();
const fileID = ref<number | null>(null);
const AmEditorRef = ref<InstanceType<typeof AmEditor> | null>(null);
const fileHeaderRef = ref<InstanceType<typeof FileHeader> | null>(null);
const moduleName = ref('');
const renderIcon = (icon: Component) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon),
    });
  };
};
const options = ref([
  {
    label: 'PDF',
    key: 'pdf',
    icon: renderIcon(FilePdfOutlined),
  },
  {
    label: 'Word',
    key: 'word',
    icon: renderIcon(FileWordOutlined),
  },
  {
    label: 'MarkDown File',
    key: 'md',
    icon: renderIcon(FileMarkdownOutlined),
  },
  {
    label: 'HTML',
    key: 'html',
    icon: renderIcon(Html5Outlined),
  },
]);
//选择导出类型
const handleSelect = (key: string | number) => {
  switch (key) {
    case 'pdf':
      AmEditorRef.value?.exportPdf(fileHeaderRef.value?.fileInfo.fileName || 'PdfFile');
      break;
    case 'html':
      AmEditorRef.value?.exportHtml(fileHeaderRef.value?.fileInfo.fileName || 'HtmlFile');
      break;
    case 'md':
      AmEditorRef.value?.exportMd(fileHeaderRef.value?.fileInfo.fileName || 'MarkdownFile');
      break;
    case 'word':
      AmEditorRef.value?.exportWord(fileHeaderRef.value?.fileInfo.fileName || 'MarkdownFile');
      break;
  }
};
//保存为模板
const handleSave = () => {
  window.$dialog.info({
    title: '保存模板',
    content: () => {
      return h('div', {}, [
        h(NDivider, { style: 'margin-top: 10px;' }),
        h(NInput, {
          style: 'width: 100%;',
          placeholder: '请输入模板名称',
          value: moduleName.value,
          onInput: (e: any) => {
            moduleName.value = e;
          },
        }),
      ]);
    },
    icon: () => {
      return h(NIcon, {
        component: SaveOutlined,
      });
    },
    positiveText: '确定',
    negativeText: '取消',
    maskClosable: false,
    onPositiveClick: () => {
      AmEditorRef.value?.saveModule(fileID.value, moduleName.value);
    },
    onNegativeClick: () => {},
  });
};

watch(route, () => {
  if (route.params.id) fileID.value = parseInt(route.params.id.toString());
});
onMounted(() => {
  fileID.value = parseInt(route.params.id.toString());
});
</script>
