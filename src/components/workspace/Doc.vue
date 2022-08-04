<template>
  <div id="content">
    <Header title="我的文档">
      <template #toolbar>
        <n-button quaternary>
          <template #icon>
            <div style="width: 100px">
              <n-icon size="25" color="rgb(100,100,100)"><AddCircleOutline /></n-icon>
            </div>
          </template>
        </n-button>
      </template>
      <template #content>
        <n-data-table :columns="columns" :data="dataFilter" :pagination="pagination" :bordered="false" />
      </template>
    </Header>
  </div>
</template>
<script setup lang="ts">
import { NButton, NIcon, NSpace } from 'naive-ui';
import { h, ref, computed, onMounted } from 'vue';
import { Refresh, Trash, Search, EllipsisHorizontal, AddCircleOutline } from '@vicons/ionicons5';
import { binList, recoverFile, deleteFile, clearBin } from '@/api/file';
type Project = {
  fileID: number;
  fileName: string;
  teamName: string;
  abandonTime: string;
};

const isInputShow = ref(false); //是否显示搜索框
const input = ref(''); //搜索关键字
const options = ref([
  {
    label: '清空回收站',
    key: 'delete',
  },
]);
const columns = ref([
  {
    title: '文件名',
    key: 'fileName',
    sorter: (row1: Project, row2: Project) => (row1.fileName > row2.fileName ? 1 : -1),
  },
  {
    title: '创建者',
    key: 'teamName',
    sorter: (row1: Project, row2: Project) => (row1.teamName > row2.teamName ? 1 : -1),
  },
  {
    title: '最近更新',
    key: 'abandonTime',
    sorter: (row1: Project, row2: Project) => (row1.abandonTime > row2.abandonTime ? 1 : -1),
  },
  {
    title: '操作',
    key: 'actions',
    render(row: Project) {
      return h(NSpace, [
        h(
          NButton,
          {
            type: 'error',
            size: 'small',
            strong: true,
            secondary: true,
            onClick(e) {
              console.log(row);
              deleteFile({ fileID: row.fileID }).then((res) => {
                if (res.data.result == 0) {
                  window.$message.success(res.data.message);
                  getProjectList();
                } else if (res.data.result == 1) {
                  window.$message.warning(res.data.message);
                } else if (res.data.result == 2) {
                  window.$message.error(res.data.message);
                }
              });
            },
          },
          {
            default: '删除',
            icon: h(NIcon, { component: Trash }),
          }
        ),
      ]);
    },
  },
]);
const trashs = ref([
  {
    fileID: 1,
    fileName: '项目名称',
    teamName: '所属团队',
    abandonTime: '1970-1-1',
  },
]);
const pagination = ref({
  current: 1,
  pageSize: 10,
});

//选择操作
const handleSelect = (key: string | number) => {
  console.log(key);
  if (key === 'delete') {
    console.log('delete');
    clearBin().then((res) => {
      if (res.data.result == 0) {
        window.$message.success(res.data.message);
        getProjectList();
      } else if (res.data.result == 1) {
        window.$message.warning(res.data.message);
      } else if (res.data.result == 2) {
        window.$message.error(res.data.message);
      }
    });
  }
};

const getProjectList = () => {
  binList({ fileID: null })
    .then((res) => {
      trashs.value = res.data.list;
    })
    .catch((err) => {
      console.log(err);
    });
};
onMounted(() => {
  getProjectList();
});
</script>
<style scope lang="less">
#content {
  padding: 40px 60px;
  position: relative;
}
</style>
