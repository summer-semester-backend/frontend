<template>
  <n-data-table :columns="columns" :data="files" :pagination="pagination" :bordered="false" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { readFile } from '@/api/file';
import { useRoute } from 'vue-router';
interface File {
  fileID: number;
  fileName: string;
  userName: string;
  lastEditTime: string;
}
const route = useRoute();
const projID = ref<number | null>(null);
const pagination = ref({
  current: 1,
  pageSize: 10,
});
const columns = ref([
  {
    title: '项目名称',
    key: 'fileName',
    sorter: (row1: File, row2: File) => (row1.fileName > row2.fileName ? 1 : -1),
  },
  {
    title: '创建者',
    key: 'teamName',
    sorter: (row1: File, row2: File) => (row1.userName > row2.userName ? 1 : -1),
  },
  {
    title: '最近更新',
    key: 'abandonTime',
    sorter: (row1: File, row2: File) => (row1.lastEditTime > row2.lastEditTime ? 1 : -1),
  },
]);

const files = ref([
  {
    fileID: 1,
    fileName: '项目1',
    userName: '张三',
    lastEditTime: '2020-01-01',
  },
  {
    fileID: 2,
    fileName: '项目2',
    userName: '李四',
    lastEditTime: '2020-01-02',
  },
  {
    fileID: 3,
    fileName: '项目3',
    userName: '王五',
    lastEditTime: '2020-01-03',
  },
]);
const getFileList = (id: number) => {
  readFile({
    fileID: id,
    teamID: null,
  }).then((res) => {
    console.log(res.data);
    files.value = res.data.sonList;
  });
};
onMounted(() => {
  projID.value = parseInt(route.params.id.toString());
  getFileList(parseInt(route.params.id.toString()));
});
</script>

<style scoped></style>
