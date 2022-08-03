<template>
  <div style="position: relative">
    <!--工具栏-->
    <n-el tag="div" id="toolbar" style="position: absolute; right: 10px; top: 20px; z-index: 2">
      <slot name="toolbar"></slot>
    </n-el>
    <!--标签页-->
    <n-tabs type="line" animated>
      <n-tab-pane name="project" :tab="title">
        <slot name="content"></slot>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>
<script setup lang="ts">
import { ref, defineProps } from 'vue';
//父组件传参
const { title = '标题' } = defineProps<{
  title?: string;
}>();
</script>
<style lang="less" scoped></style>
