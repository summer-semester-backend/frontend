<template>
  <!-- <work-space /> -->
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
