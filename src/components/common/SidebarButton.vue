<template>
  <div class="flex m-auto">
    <n-button
      :type="isSelect ? 'info' : 'default'"
      size="large"
      :bordered="false"
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
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const props = defineProps<{ buttonName: string; routeName: string; rootRoute: string }>();
const handleDirect = () => {
  router.push({ name: props.routeName });
};
const isSelect = computed(() => {
  let name = route.fullPath.split('/')[1];
  if (props.rootRoute == 'user') return name == props.rootRoute;
  else return name == 'team' || name == 'prototype' || name == 'workspace' || name == 'edit';
});
</script>
