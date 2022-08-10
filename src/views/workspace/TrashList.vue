<template>
  <div id="content">
    <ToolBar title="回收站">
      <template #toolbar>
        <n-button v-if="!isInputShow" @click="showInput" quaternary circle>
          <template #icon>
            <n-icon size="20" color="rgb(100,100,100)"><search /></n-icon>
          </template>
        </n-button>
        <n-input v-model:value="input" v-else round placeholder="搜索名称" @blur="hideInput" style="width: 200px">
          <template #suffix>
            <n-icon size="20" :component="Search" />
          </template>
        </n-input>
        <n-button quaternary @click="handleClear"
          ><template #icon>
            <n-icon size="20" color="rgb(100,100,100)"><trash-outline /></n-icon> </template
          >清空回收站</n-button
        >
      </template>
    </ToolBar>
    <n-data-table :columns="columns" :data="dataFilter" :pagination="pagination" :bordered="false" />
  </div>
</template>
<script setup lang="ts">
import { NButton, NIcon, NSpace, NText } from 'naive-ui';
import { h, ref, computed, onMounted } from 'vue';
import { Refresh, Trash, Search, EllipsisHorizontal, TrashOutline } from '@vicons/ionicons5';
import { binList, recoverFile, deleteFile, clearBin } from '@/api/file';
import { formatDate } from '@/plugins/date';
import { ToolBar } from './components';
import { useRoute } from 'vue-router';
type Trash = {
  fileID: number;
  fileName: string;
  fileType: number;
  abandonTime: string;
};
const isInputShow = ref(false); //是否显示搜索框
const input = ref(''); //搜索关键字
const projID = ref();
const route = useRoute();
const options = ref([
  {
    label: '清空回收站',
    key: 'delete',
  },
]);
const columns = ref([
  {
    title: '文件名称',
    key: 'fileName',
  },
  {
    title: '文件类型',
    key: 'teamName',
    render: (row: any) =>
      h(NText, {}, () => {
        switch (row.fileType) {
          case 2:
            return '文件夹';
          case 12:
            return 'UML图';
          case 13:
            return '原型图';
          case 14:
            return '文档';
        }
      }),
  },
  {
    title: '删除时间',
    key: 'abandonTime',
    sorter: (row1: Trash, row2: Trash) => (row1.abandonTime > row2.abandonTime ? 1 : -1),
    render: (row: Trash) => h('span', formatDate(row.abandonTime)),
  },
  {
    title: '操作',
    key: 'actions',
    render(row: Trash) {
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
              recoverFile({ fileID: row.fileID })
                .then((res) => {
                  if (res.data.result == 0) {
                    window.$message.success(res.data.message);
                    getProjectList(projID.value);
                  } else if (res.data.result == 1) {
                    window.$message.warning(res.data.message);
                  } else if (res.data.result == 2) {
                    window.$message.error(res.data.message);
                  }
                })
                .catch((err) => {
                  console.log(err);
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
                  getProjectList(projID.value);
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
const trashs = ref();
const pagination = ref({
  current: 1,
  pageSize: 8,
});

//显示搜索
const showInput = () => {
  isInputShow.value = true;
};
//隐藏搜索
const hideInput = () => {
  isInputShow.value = false;
};
//选择操作
const handleClear = () => {
  window.$dialog.error({
    title: '提示',
    content: '是否彻底删除所有文件？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      clearBin({ fileID: projID.value, teamID: -1 }).then((res) => {
        if (res.data.result == 0) {
          window.$message.success(res.data.message);
          getProjectList(projID.value);
        } else if (res.data.result == 1) {
          window.$message.warning(res.data.message);
        } else if (res.data.result == 2) {
          window.$message.error(res.data.message);
        }
      });
    },
  });
};

const getProjectList = (id: number) => {
  binList({ fileID: id, teamID: -1 })
    .then((res) => {
      trashs.value = res.data.list;
    })
    .catch((err) => {
      console.log(err);
    });
};
onMounted(() => {
  projID.value = parseInt(route.params.ProjID.toString());
  getProjectList(projID.value);
});

//搜索
const dataFilter = computed(() => {
  return trashs.value?.filter((data: any) => {
    return !input.value || data.fileName.toLowerCase().includes(input.value.toLowerCase());
  });
});
</script>
<style scope lang="less"></style>
