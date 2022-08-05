<template>
  <!-- <TeamBar id="teamBar"></TeamBar>
  <router-view /> -->

  <n-layout has-sider style="height: 100%;">
    <n-layout-sider>
      <TeamBar id="teamBar"></TeamBar>
    </n-layout-sider>
    <n-layout>
      <router-view></router-view>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts"></script>

<style scoped>
/* #teamBar {
  float: left;
  height: 100%;
} */
</style>
