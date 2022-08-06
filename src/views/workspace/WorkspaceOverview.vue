<template>
  <div id="workspace">
    <WorkBar id="workBar"></WorkBar>
    <div style="margin: 20px 60px">
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
  if (route.params.ProjID) {
    router.push({ name: 'DocumentList', params: { ProjID: route.params.ProjID } });
  } else {
    window.$message.error('项目不存在');
    router.back();
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
