<template>
  <div id="workspace">
    <WorkBar id="workBar"></WorkBar>
    <div style="margin: 20px 60px">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<style scoped>
#workspace {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}
</style>
