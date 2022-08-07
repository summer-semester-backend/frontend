<template>
  <file-header ref="fileHeaderRef" :file-i-d="fileID">
    <template #extra>
      <n-space>
        <n-dropdown :options="options" @select="handleSelect">
          <n-button size="small" style="margin-right: 20px">导出</n-button>
        </n-dropdown>
      </n-space>
    </template>
  </file-header>
  <AmEditor ref="AmEditorRef"></AmEditor>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router';
import AmEditor from '@/components/editor/AmEditor.vue';
import FileHeader from '@/components/document/FileHeader.vue';
import { onMounted, ref, h } from '@vue/runtime-core';
import { Component } from 'vue';
import { NIcon } from 'naive-ui';
import { FilePdfOutlined, FileWordOutlined, FileMarkdownOutlined, Html5Outlined } from '@vicons/antd';
const route = useRoute();
const fileID = ref<number | null>(null);
const AmEditorRef = ref<InstanceType<typeof AmEditor> | null>(null);
const fileHeaderRef = ref<InstanceType<typeof FileHeader> | null>(null);
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
onMounted(() => {
  fileID.value = parseInt(route.params.id.toString());
});
</script>
