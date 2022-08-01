<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN" :theme-overrides="colorConfig">
    <naive-provider>
      <app />
    </naive-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { zhCN, dateZhCN } from 'naive-ui';
import App from './App.vue';
import { colorConfig } from './config/color';
</script>

<style scoped></style>
