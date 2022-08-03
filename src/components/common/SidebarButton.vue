<template>
  <div class="flex m-auto">
    <n-button
      :type="isSelect ? 'info' : 'default'"
      size="large"
      class="flex rounded-xl mx-2 my-4 h-14"
      @click="handleDirect"
    >
      <div class="flex h-10 items-center flex-col">
        <n-icon size="24"><slot></slot> </n-icon>
        <div class="text-xs mt-1">{{ buttonName }}</div>
      </div>
    </n-button>
  </div>
</template>
<script setup lang="ts">
import { computed } from '@vue/reactivity';
import { useRoute, useRouter } from 'vue-router';
import { barState } from '@/store/bar';

const barstate = barState();
const showUserBar = () => {
  barstate.openUserBar();
};
const showProjectBar = () => {
  barstate.openProjectBar();
};
const showTeamBar = () => {
  barstate.openTeamBar();
};

const router = useRouter();
const route = useRoute();
const props = defineProps<{ buttonName: string; routeName: string; barName: string }>();
const handleDirect = () => {
  router.push({ name: props.routeName });
  if (props.barName == 'user') showUserBar();
  if (props.barName == 'project') showProjectBar();
  if (props.barName == 'team') showTeamBar();
};
const isSelect = computed(() => {
  return route.fullPath.split('/')[1] == props.routeName;
});
</script>
