<template>
  <n-layout has-sider position="absolute">
    <n-layout-sider collapsed collapse-mode="width" bordered>
      <n-layout-header position="absolute">
        <n-menu
          collapsed
          :options="topMenuOptions"
          class="top-menu"
          :value="topValue"
          @update-value="handleTopUpdate"
        />
      </n-layout-header>
      <n-layout-footer position="absolute">
        <n-menu
          collapsed
          :options="bottomMenuOptions"
          class="bottom-menu"
          :value="bottomValue"
          @update-value="handleBottomUpdate"
        />
      </n-layout-footer>
    </n-layout-sider>
  </n-layout>
</template>

<script setup lang="tsx">
import { ref } from 'vue';
import { createMenuOptions } from './GlobalUtils.js';
import { People, SettingsOutline, PersonCircleOutline } from '@vicons/ionicons5';
import { ProjectOutlined } from '@vicons/antd';
const topValue = ref<string | null>(null);
const bottomValue = ref<string | null>(null);

function handleTopUpdate(key: string) {
  bottomValue.value = null;
  topValue.value = key;
}
function handleBottomUpdate(key: string) {
  topValue.value = null;
  bottomValue.value = key;
}
const topMenuOptions = createMenuOptions([
  { path: '/project', name: '项目', icon: ProjectOutlined },
  { path: '/team', name: '团队', icon: People },
]);

const bottomMenuOptions = createMenuOptions([
  { path: '/login', name: '个人', icon: PersonCircleOutline },
  { path: '/setting', name: '设置', icon: SettingsOutline },
]);
</script>

<style scoped>
.bottom-menu {
  margin-bottom: 0.5vh;
}
</style>
