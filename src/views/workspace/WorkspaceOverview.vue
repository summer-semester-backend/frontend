<template>
  <div id="workspace">
    <WorkBar id="workBar"></WorkBar>
    <div style="padding: 20px 60px">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from '@vue/runtime-core';
import { RouterView } from 'vue-router';
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();
onMounted(() => {
  if (!route.params.ProjID) {
    window.$message.error('项目不存在');
    router.back();
  }
  if (route.fullPath.split('/').length === 3) {
    router.replace(`/workspace/${route.params.ProjID}/doc`);
  }
});
</script>

<style scoped>
#workspace {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}
</style>
