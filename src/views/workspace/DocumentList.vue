<template>
  <ToolBar title="文档">
    <template #toolbar>
      <n-button text @click="handleCreate">
        <n-icon size="26" class="icon">
          <AddCircleOutline />
        </n-icon>
      </n-button>
    </template>
  </ToolBar>
  <n-data-table :columns="columns" :data="files" :pagination="pagination" :bordered="false" />
</template>

<script setup lang="ts">
import { NButton, NIcon, NInput, NSpace } from 'naive-ui';
import { h, ref, computed, onMounted } from 'vue';
import { AddCircleOutline, Trash, ArrowRedo, CreateOutline, Create } from '@vicons/ionicons5';
import { createFile, deleteFile, editFile } from '@/api/file';
import { readFile } from '@/api/file';
import { useRoute } from 'vue-router';
import { ToolBar } from './components';
import router from '@/router';
interface File {
  fileID: number;
  fileName: string;
  userName: string;
  lastEditTime: string;
}
const route = useRoute();
const newFileName = ref('');
const projID = ref<number | null>(null);
const pagination = ref({
  current: 1,
  pageSize: 10,
});
//列表操作
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
    render(row: any) {
      return h(NSpace, [
        h(
          NButton,
          {
            type: 'error',
            size: 'small',
            strong: true,
            secondary: true,
            onClick(e) {
              window.$dialog.warning({
                title: '警告',
                content: '你确定要删除这个文件吗？',
                positiveText: '确定',
                negativeText: '取消',
                onPositiveClick: () => {
                  deleFlie(row.fileID);
                },
                onNegativeClick: () => {},
              });
            },
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
            onClick(e) {
              console.log(row);
              router.push({
                name: 'editor',
                params: {
                  id: row.fileID,
                },
              });
            },
          },
          {
            default: '打开',
            icon: h(NIcon, { component: ArrowRedo }),
          }
        ),
        h(
          NButton,
          {
            type: 'warning',
            size: 'small',
            strong: true,
            secondary: true,
            onClick(e) {
              handleEdit(row);
            },
          },
          {
            default: '修改',
            icon: h(NIcon, { component: Create }),
          }
        ),
      ]);
    },
  },
]);

const files = ref();
const getFileList = (id: number | null) => {
  readFile({
    fileID: id,
    teamID: null,
  }).then((res) => {
    console.log(res.data);
    files.value = [];
    res.data.sonList.forEach((item: any) => {
      if (item.fileType === 14) {
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
//删除文件
const deleFlie = (fileID: number) => {
  deleteFile({ fileID: fileID })
    .then((res) => {
      if (res.data.result == 0) {
        window.$message.success('删除成功');
        getFileList(projID.value);
      } else if (res.data.result == 1) {
        window.$message.warning(res.data.message);
      } else if (res.data.result == 2) {
        window.$message.error(res.data.message);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
//修改项目名称
const handleEdit = (item: any) => {
  window.$dialog.info({
    title: '修改文件名称',
    content: () => {
      return h(NInput, {
        style: 'width: 100%;',
        placeholder: '请输入文件名称',
        value: item.fileName,
        onInput: (e: any) => {
          console.log(e);
          item.fileName = e;
        },
      });
    },
    icon: () => {
      return h(NIcon, {
        component: CreateOutline,
      });
    },
    positiveText: '确定',
    negativeText: '取消',
    maskClosable: false,
    onPositiveClick: () => {
      if (item.fileName.length > 0) {
        editFile({
          fileID: item.fileID,
          fileName: item.fileName,
          fileImage: null,
          fatherID: null,
          data: null,
        }).then((res) => {
          if (res.data.result == 0) {
            window.$message.success('修改成功');
          } else if (res.data.result == 1) {
            window.$message.warning(res.data.message);
          } else if (res.data.result == 2) {
            window.$message.error(res.data.message);
          }
        });
      } else {
        window.$message.warning('请输入文件名称');
      }
    },
    onNegativeClick: () => {},
  });
};
//新建文件
const handleCreate = () => {
  window.$dialog.info({
    title: '新建文件',
    content: () => {
      return h(NInput, {
        style: 'width: 100%;',
        placeholder: '请输入文件名称',
        onInput: (e: any) => {
          newFileName.value = e;
        },
      });
    },
    icon: () => {
      return h(NIcon, {
        component: CreateOutline,
      });
    },
    positiveText: '确定',
    negativeText: '取消',
    maskClosable: false,
    onPositiveClick: () => {
      if (newFileName.value.length > 0) {
        createFile({ teamID: null, fileName: newFileName.value, fileType: 14, fileImage: '', fatherID: projID.value })
          .then((res) => {
            if (res.data.result == 0) {
              window.$message.success('创建成功');
              getFileList(projID.value);
            } else if (res.data.result == 1) {
              window.$message.warning(res.data.message);
            } else if (res.data.result == 2) {
              window.$message.error(res.data.message);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        window.$message.warning('请输入文件名称');
      }
    },
    onNegativeClick: () => {},
  });
};
onMounted(() => {
  projID.value = parseInt(route.params.ProjID.toString());
  getFileList(projID.value);
});
</script>

<style scoped></style>
