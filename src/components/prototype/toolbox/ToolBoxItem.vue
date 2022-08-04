<template>
  <div class="w-15 h-15">
    <div class="flex h-10 items-center flex-col">
      <n-icon size="24" :component="icon"> </n-icon>
      <div class="text-xs mt-1 text-light-100">{{ toolName }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Component } from 'vue';
const props = defineProps<{ toolName: string; icon?: Component }>();
</script>
