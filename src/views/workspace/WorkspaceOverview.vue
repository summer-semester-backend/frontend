<template>
  <div id="workspace">
    <WorkBar id="workBar"></WorkBar>
    <router-view id="view" />
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
