<template>
  <!-- <UserBar id="userBar"></UserBar>
  <router-view></router-view> -->

  <n-layout has-sider style="height: 100%;">
    <n-layout-sider>
      <UserBar id="userBar"></UserBar>
    </n-layout-sider>
    <n-layout>
      <router-view></router-view>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts"></script>

<style scoped>
/* #userBar {
  float: left;
  height: 100%;
} */
</style>
