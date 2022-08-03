<template>
  <div id="teamBar"></div>
  <router-view id="view" />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<style scoped>
#teamBar {
  float: left;
  width: 140px;
  height: 100%;
  height: 100%;
}

#view {
  width: 100%;
  height: 100%;
  float: left;
}
</style>
