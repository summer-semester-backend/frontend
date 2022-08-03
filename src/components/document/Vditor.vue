<template>
  <div id="vditor" style="margin: auto; margin-top: 30px"></div>
  <span style="position: absolute; bottom: 10px; right: 20px">字数:{{ wordCount }}</span>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Vditor from 'vditor';
import 'vditor/dist/index.css';
const vditor = ref<Vditor | null>();
const wordCount = ref();

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
      //渲染完成后执行
      //获取本地缓存的数据
      vditor.value!.setValue(localStorage.getItem('vditorvditor') || '# 未命名文件');
    },
    counter: {
      //字数统计
      enable: true,
      type: 'text',
      after: (count: number) => {
        wordCount.value = count;
      },
    },
    input: (value: string) => {
      //输入内容时执行
      console.log(vditor.value!.getValue());
      console.log(vditor.value!.getHTML());
    },
    width: '100%',
    height: '100%',
    upload: {
      //上传配置
      url: 'http://43.138.77.8:8000/api/upload',
      linkToImgUrl: 'http://43.138.77.8:8000/api/upload',
      fieldName: 'file',
      withCredentials: true,
      accept: 'image/*',
      headers: {},
      success: (editor: HTMLPreElement, msg: string) => {
        let img = JSON.parse(msg).url;
        vditor.value!.insertValue(`![](${img})`); //插入图片
      },
    },
  });
};

onMounted(init);
</script>
