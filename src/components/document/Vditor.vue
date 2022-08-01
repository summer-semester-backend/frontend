<template>
  <div id="vditor" style="margin: auto"></div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Vditor from 'vditor';
import 'vditor/dist/index.css';
const vditor = ref<Vditor | null>();

const init = () => {
  vditor.value = new Vditor('vditor', {
    toolbar: [
      'emoji',
      'headings',
      'bold',
      'italic',
      'strike',
      'link',
      '|',
      'list',
      'ordered-list',
      'check',
      '|',
      'quote',
      'line',
      'code',
      'inline-code',
      '|',
      'upload',
      'record',
      'table',
      '|',
      'undo',
      'redo',
      '|',
      'fullscreen',
      'edit-mode',
      'export',
      'outline',
      {
        name: 'more',
        toolbar: ['code-theme', 'preview', 'devtools', 'info', 'help'],
      },
    ],
    toolbarConfig: {
      pin: true,
    },
    after: () => {
      // vditor.value is a instance of Vditor now and thus can be safely used here
      vditor.value!.setValue('# 未命名文件');
    },
    counter: {
      enable: true,
      type: 'text',
    },
    input: (value: string) => {
      console.log(vditor.value!.getValue());
      console.log(vditor.value!.getHTML());
    },
    width: '80%',
  });
};

onMounted(init);
</script>
