<template>
  <div class="w-18 h-15">
    <div class="flex h-10 items-center flex-col">
      <n-icon v-if="!isEditorIcon" size="24" :component="icon"> </n-icon>
      <span v-else class="material-symbols-outlined" :style="{ 'font-size': 24 + ' !important' }">{{ toolName }}</span>
      <n-text v-if="!isEditorIcon" class="text-xs mt-1 justify-center">{{ toolName }}</n-text>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Component } from 'vue';
const props = defineProps<{ toolName: string; icon?: Component; isEditorIcon: boolean }>();
</script>
