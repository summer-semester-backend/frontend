<template>
  <ToolBar title="原型">
    <template #toolbar>
      <n-button text @click="handleProto">
        <n-icon size="26" class="icon">
          <AddCircleOutline />
        </n-icon>
      </n-button>
    </template>
  </ToolBar>
  <n-data-table :columns="columns" :data="files" :pagination="pagination" :bordered="false" />
</template>

<script setup lang="ts">
import { NButton, NIcon, NSpace } from 'naive-ui';
import { h, ref, computed, onMounted } from 'vue';
import { AddCircleOutline, Trash, ArrowRedo } from '@vicons/ionicons5';
import { readFile } from '@/api/file';
import { useRoute, useRouter } from 'vue-router';
import { ToolBar } from './components';
interface File {
  fileID: number;
  fileName: string;
  userName: string;
  lastEditTime: string;
}
const router = useRouter();
const route = useRoute();
const projID = ref<number | null>(null);
const pagination = ref({
  current: 1,
  pageSize: 10,
});
const handleProto = () => {
  router.push({ name: 'prototype' });
};
const columns = ref([
  {
    title: '文件名称',
    key: 'fileName',
  },
  {
    title: '创建者',
    key: 'userName',
  },
  {
    title: '最近更新',
    key: 'lastEditTime',
    sorter: (row1: File, row2: File) => (row1.lastEditTime > row2.lastEditTime ? 1 : -1),
    render: (row: File) => h('span', row.lastEditTime?.slice(0, 10)),
  },
  {
    title: '操作',
    key: 'actions',
    render() {
      return h(NSpace, [
        h(
          NButton,
          {
            type: 'error',
            size: 'small',
            strong: true,
            secondary: true,
          },
          {
            default: '删除',
            icon: h(NIcon, { component: Trash }),
          }
        ),
        h(
          NButton,
          {
            type: 'success',
            size: 'small',
            strong: true,
            secondary: true,
          },
          {
            default: '打开',
            icon: h(NIcon, { component: ArrowRedo }),
          }
        ),
      ]);
    },
  },
]);

const files = ref([
  {
    fileID: 1,
    fileName: '项目1',
    userName: '张三',
    lastEditTime: '2020-01-01',
  },
]);
const getFileList = (id: number | null) => {
  readFile({
    fileID: id,
    teamID: null,
  }).then((res) => {
    console.log(res.data);
    files.value = [];
    res.data.sonList.forEach((item: any) => {
      if (item.fileType === 13) {
        files.value.push({
          fileID: item.fileID,
          fileName: item.fileName,
          userName: item.userName,
          lastEditTime: item.lastEditTime,
        });
      }
    });
  });
};
onMounted(() => {
  projID.value = parseInt(route.params.ProjID.toString());
  getFileList(projID.value);
});
</script>

<style scoped></style>
