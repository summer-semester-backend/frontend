<template>
  <!-- <work-space /> -->
  <RecentProject />
  <ProjectList :projects="projects" @refresh="getProjectList" :page-size="10" />
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { userProjectList } from '@/api/project';
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
  userProjectList()
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

<style lang="less" scoped>

.box {
  height: 100%;
  width: 270px;
  background-color: aqua;
}
</style>
