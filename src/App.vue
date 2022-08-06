<template>
  <n-layout has-sider position="absolute">
    <global-sidebar v-if="!isLoginPage && !isProtoPage" />
    <global-content />
  </n-layout>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { backend } from '@/api/utils/request';
import { useAuthStore } from '@/store/auth';
const { signOut } = useAuthStore();
const route = useRoute();
const router = useRouter();
const isLoginPage = computed(() => {
  return route.name == 'login';
});
const isProtoPage = computed(() => {
  return route.name == 'prototype';
});
backend.interceptors.response.use(
  (response) => {
    console.log(response.data);
    if (response.data.result == 10) {
      window.$message.error('登录认证失败');
      signOut();
      router.push({ name: 'login' });
    } else if (response.data.result != 0) {
      window.$message.error(response.data.message);
      return Promise.reject(response);
    } else return Promise.resolve(response);
  },
  (error) => {
    return Promise.reject(error);
  }
);
</script>

<style scoped></style>
