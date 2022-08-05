<template>
  <n-page-header :title="title" style="margin-bottom: 20px">
    <template #extra>
      <slot name="toolbar"></slot>
    </template>
  </n-page-header>
</template>
<script setup lang="ts">
import { withDefaults, defineProps } from 'vue';
type Props = {
  title: string;
};
const props = withDefaults(defineProps<Props>(), {
  title: '文档',
});
</script>
<style lang="scss" scoped></style>
