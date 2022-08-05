<template>
  <ProjectList :projects="projects" :team-id="teamID" :page-size="20" @refresh="getProjectList" />
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { readFile } from '@/api/file';
const teamID = ref(1);
const projects = ref([]);
const getProjectList = () => {
  readFile({ fileID: -1, teamID: 1 })
    .then((res) => {
      projects.value = res.data.sonList;
    })
    .catch((err) => {
      console.log(err);
    });
};
onMounted(() => {
  getProjectList();
});
</script>
