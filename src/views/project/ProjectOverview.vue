<template>
  <!-- <work-space /> -->
  <n-layout has-sider style="height: 100%;">
    <n-layout-sider>
      <ProjectBar id="projectBar"></ProjectBar>
    </n-layout-sider>
    <n-layout>
      <router-view></router-view>
    </n-layout>
  </n-layout>
  
  
</template>
<script setup lang="ts"></script>

<style scoped>

</style>
