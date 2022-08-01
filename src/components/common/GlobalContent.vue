<template>
  <n-layout-content class="content">
    <router-view />
  </n-layout-content>
</template>
<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>
<style scoped>
.content:deep(.n-layout-scroll-container)::-webkit-scrollbar {
  width: 9px;
  background-color: #eee;
}
.content:deep(.n-layout-scroll-container)::-webkit-scrollbar-thumb {
  border-radius: 20px;
  border: 1px solid #ddd;
  background-color: #ccc;
}
.content:deep(.n-layout-scroll-container)::-webkit-scrollbar-track {
  border-radius: 20px;
}
</style>
