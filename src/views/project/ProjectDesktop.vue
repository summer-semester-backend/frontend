<template>
  <!-- <work-space /> -->
  <ProjectBar id="projectBar"></ProjectBar>
  <!-- <div class="box" id="projectBar"></div> -->
  <RecentProject />
  <ProjectList :projects="projects" />
</template>
<script setup lang="ts">
import { ref } from 'vue';
const projects = ref([
  {
    id: 1,
    name: 'project1project1project1project1',
    url: '/resource/image/project1.jpeg',
  },
  {
    id: 2,
    name: '敏捷开发',
    url: '/resource/image/project1.jpeg',
  },
]);
</script>

<style lang="less" scoped>
    // #projectBar
    // {
    //     float: left;
    //     height: 100%;
        
    // }

    .box
    {
      height: 100%;
      width: 270px;
      background-color: aqua;
    }
</style>
