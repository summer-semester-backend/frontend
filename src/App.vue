<template>
  <n-layout has-sider position="absolute">
    <global-sidebar v-if="!isLoginPage" />
    <global-content />
  </n-layout>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();
const isLoginPage = computed(() => {
  return route.name == 'login';
});
</script>

<style scoped></style>
