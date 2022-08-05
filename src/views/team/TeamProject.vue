<template>
  <ProjectList :projects="projects" :team-id="teamID" :page-size="20" @refresh="getProjectList" />
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { readFile } from '@/api/file';
const teamID = ref<number | null>(null);
const projects = ref([]);
const getProjectList = (id: number | null) => {
  readFile({ fileID: -1, teamID: id })
    .then((res) => {
      projects.value = res.data.sonList;
    })
    .catch((err) => {
      console.log(err);
    });
};
onMounted(() => {
  teamID.value = parseInt(window.location.pathname.split('/')[2]);
  getProjectList(teamID.value);
});
</script>
