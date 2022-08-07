<template>
  <n-space align="center">
    <n-text class="pt-2">正在编辑：</n-text>
    <n-avatar-group :options="options" :size="30" :max="4">
      <template #avatar="{ option: { name, src } }">
        <n-tooltip>
          <template #trigger>
            <n-avatar :src="src" />
          </template>
          {{ name }}
        </n-tooltip>
      </template>
      <template #rest="{ options: restOptions, rest }">
        <n-dropdown :options="createDropdownOptions(restOptions)" placement="top">
          <n-avatar>+{{ rest }}</n-avatar>
        </n-dropdown>
      </template>
    </n-avatar-group>
  </n-space>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { SyncManager } from './SyncManager';
const props = defineProps<{ syncManager: SyncManager }>();
const options = ref([
  {
    name: localStorage.getItem('userName') as string,
    src: localStorage.getItem('avatar') as string,
  },
]);
const createDropdownOptions = (options: Array<{ name: string; avatar: string }>) =>
  options.map((option) => ({
    key: option.name,
    label: option.name,
  }));
</script>
