<template>
  <global-header class="relative z-10" v-if="!isLoginPage" />
  <global-content class="relative z-0" :show-padding="!isLoginPage">
    <router-view />
  </global-content>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useMessage } from 'naive-ui';
import { useRoute } from 'vue-router';
const route = useRoute();
const isLoginPage = computed(() => {
  return route.name == 'login';
});

window.$message = useMessage();
</script>

<style scoped></style>
