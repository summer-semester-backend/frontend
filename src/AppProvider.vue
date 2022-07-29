<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN" class="h-full">
    <naive-provider>
      <app />
    </naive-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { zhCN, dateZhCN } from 'naive-ui';
import App from './App.vue';
</script>

<style scoped></style>
