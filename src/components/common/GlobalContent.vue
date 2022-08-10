<template>
  <div v-if="isIndex">
    <router-view />
  </div>
  <n-layout-content class="content" v-if="!isIndex">
    <router-view />
  </n-layout-content>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { RouterView } from 'vue-router';
import { useRoute, useRouter } from 'vue-router';
import { backend } from '@/api/utils/request';
import { useAuthStore } from '@/store/auth';
const { signOut } = useAuthStore();
const route = useRoute();
const router = useRouter();
const isIndex = computed(() => {
  return route.name == 'Index';
});
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
