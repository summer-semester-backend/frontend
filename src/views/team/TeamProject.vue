<template>
  <ProjectList :projects="projects" :team-id="teamID" :page-size="20" @refresh="getProjectList" />
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { teamProjectList } from '@/api/project';
const teamID = ref(1);
const projects = ref([
  {
    projectID: 1,
    projectName: 'project1project1project1project1',
    projectImage: '/resource/image/project1.jpeg',
    createTime: '2022-01-01',
    lastVisitTime: '2022-01-01',
  },
  {
    projectID: 2,
    projectName: '敏捷开发',
    projectImage: '/resource/image/project1.jpeg',
    createTime: '2020-01-01',
    lastVisitTime: '2020-01-01',
  },
]);
const getProjectList = () => {
  teamProjectList({ teamID: 1 })
    .then((res) => {
      projects.value = res.data.list;
    })
    .catch((err) => {
      console.log(err);
    });
};
onMounted(() => {
  getProjectList();
});
</script>
