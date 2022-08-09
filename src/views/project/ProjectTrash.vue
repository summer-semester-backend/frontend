<template>
  <div style="padding: 35px 60px">
    <Header title="回收站">
      <template #toolbar>
        <n-button v-if="!isInputShow" @click="showInput" quaternary circle>
          <template #icon>
            <n-icon size="18" color="rgb(100,100,100)"><search /></n-icon>
          </template>
        </n-button>
        <n-input v-model:value="input" v-else round placeholder="搜索名称" @blur="hideInput" style="width: 200px">
          <template #suffix>
            <n-icon size="18" :component="Search" />
          </template>
        </n-input>
        <n-button @click="handleClear" quaternary
          ><template #icon>
            <n-icon size="18" color="rgb(100,100,100)"><trash-outline /></n-icon> </template
          >清空回收站</n-button
        >
      </template>
      <template #content>
        <n-tabs size="small" animated v-model:value="tabName">
          <n-tab-pane name="proj" tab="项目">
            <n-data-table :columns="columns" :data="dataFilter" :pagination="pagination" :bordered="false" />
          </n-tab-pane>
          <n-tab-pane name="doc" tab="文档">
            <n-data-table :columns="columns" :data="dataFilter" :pagination="pagination" :bordered="false" />
          </n-tab-pane>
        </n-tabs>
      </template>
    </Header>
  </div>
</template>
<script setup lang="ts">
import { NButton, NIcon, NSpace } from 'naive-ui';
import { h, ref, computed, onMounted } from 'vue';
import {
  Refresh,
  TrashOutline,
  Trash,
  Search,
  EllipsisHorizontal,
  FolderOutline,
  DocumentTextOutline,
} from '@vicons/ionicons5';
import { binList, recoverFile, deleteFile, clearBin } from '@/api/file';
import { useRoute } from 'vue-router';
type Project = {
  fileID: number;
  fileType: number;
  fileName: string;
  userName: string;
  abandonTime: string;
};

const route = useRoute();
const isInputShow = ref(false); //是否显示搜索框
const input = ref(''); //搜索关键字
const tabName = ref('proj');
const options = ref([
  {
    label: '清空回收站',
    key: 'delete',
  },
]);
const columns = ref([
  {
    title: () => (tabName.value == 'proj' ? '项目名称' : '文档名称'),
    key: 'fileName',
    render: (row: any) =>
      h(
        NSpace,
        {
          size: 4,
        },
        [
          h(NIcon, {
            size: '18',
            component: () => {
              switch (row.fileType) {
                case 2:
                  return h(FolderOutline);
                case 14:
                  return h(DocumentTextOutline);
              }
            },
          }),
          h('span', {}, row.fileName),
        ]
      ),
  },
  {
    title: '创建者',
    key: 'userName',
  },
  {
    title: '删除时间',
    key: 'abandonTime',
    sorter: (row1: Project, row2: Project) => (row1.abandonTime > row2.abandonTime ? 1 : -1),
    render: (row: Project) => h('span', row.abandonTime.slice(0, 10)),
  },
  {
    title: '操作',
    key: 'actions',
    render(row: Project) {
      return h(NSpace, [
        h(
          NButton,
          {
            type: 'primary',
            size: 'small',
            strong: true,
            secondary: true,
            onClick(e) {
              console.log(row);
              recoverFile({ fileID: row.fileID }).then((res) => {
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
            default: '恢复',
            icon: h(NIcon, { component: Refresh }),
          }
        ),
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
const teamID = ref<number>();
const trashs = ref<Project[]>([]);
const pagination = ref({
  current: 1,
  pageSize: 10,
});

//显示搜索
const showInput = () => {
  isInputShow.value = true;
};
//隐藏搜索
const hideInput = () => {
  isInputShow.value = false;
};
//清空回收站
const handleClear = () => {
  window.$dialog.error({
    title: '提示',
    content: '是否彻底删除所有项目和文件？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      clearBin({ fileID: -1, teamID: teamID.value || -1 }).then((res) => {
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
  });
};

const getProjectList = () => {
  binList({ fileID: -1, teamID: teamID.value || -1 })
    .then((res) => {
      trashs.value = res.data.list;
    })
    .catch((err) => {
      console.log(err);
    });
};
onMounted(() => {
  teamID.value = parseInt(route.params.teamID.toString());
  getProjectList();
});

//搜索
const dataFilter = computed(() => {
  return trashs.value.filter((data) => {
    return (
      (tabName.value == 'proj' ? data.fileType == 1 : data.fileType > 1) &&
      (!input.value || data.fileName.toLowerCase().includes(input.value.toLowerCase()))
    );
  });
});
</script>
<style scope lang="less"></style>
