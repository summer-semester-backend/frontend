<template>
  <ToolBar title="原型">
    <template #toolbar>
      <n-button text>
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
import { useRoute } from 'vue-router';
import { ToolBar } from './components';
import { useProjStore } from '@/store/proj';
interface File {
  fileID: number;
  fileName: string;
  userName: string;
  lastEditTime: string;
}
const route = useRoute();
const { getProjID } = useProjStore();
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
    res.data.sonList.forEach((item) => {
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
  projID.value = getProjID();
  getFileList(getProjID());
});
</script>

<style scoped></style>
