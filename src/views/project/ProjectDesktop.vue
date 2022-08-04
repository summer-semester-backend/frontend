<template>
  <!-- <work-space /> -->
  <RecentProject />
  <ProjectList :projects="projects" @refresh="getProjectList" :page-size="10" />
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { readUserFile } from '@/api/file';
const projects = ref([]);
const getProjectList = () => {
  readUserFile()
    .then((res) => {
      projects.value = res.data.list;
      console.log(projects.value);
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
