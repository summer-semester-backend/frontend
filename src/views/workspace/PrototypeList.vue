<template>
  <ToolBar title="原型">
    <template #toolbar>
      <n-space>
        <n-button text @click="setBlockModel">
          <n-icon size="26" class="icon">
            <GridOutline />
          </n-icon>
        </n-button>
        <n-button text @click="setListModel">
          <n-icon size="26" class="icon">
            <UnorderedListOutlined />
          </n-icon>
        </n-button>
        <n-button :disabled="showListRef" strong secondary type="info" small size="small" @click="changeButtonState">
          <template #icon>
            <n-icon size="20" class="icon">
              <EditOutlined />
            </n-icon>
          </template>
          {{ buttonText }}
        </n-button>
        <n-button strong secondary type="info" small size="small" @click="handleClickCreate">
          <template #icon>
            <n-icon size="20" class="icon">
              <AddCircleOutline />
            </n-icon>
          </template>
          新建
        </n-button>
      </n-space>
    </template>
  </ToolBar>
  <!--列表视图-->
  <n-data-table v-if="showListRef" :columns="columns" :data="files" :pagination="pagination" :bordered="false" />
  <!--块状视图-->
  <BlockModalData
    v-if="!showListRef"
    :files="files"
    :paginationBlock="paginationBlock"
    :editButtonRef="editButtonRef"
    :fileType="12"
    @handleClickOpen="handleClickOpen"
    @handleClickDelete="handleClickDelete"
    @handleClickEdit="handleClickEdit"
    @handleClickCopy="handleClickCopy"
    @openModel="handleClickCreate"
  >
    <template #icon>
      <FileImageFilled color="#E26E0D" />
    </template>
  </BlockModalData>
</template>

<script setup lang="ts">
import { NButton, NDivider, NIcon, NInput, NSpace } from 'naive-ui';
import { h, ref, computed, onMounted } from 'vue';
import { AddCircleOutline, Trash, ArrowRedo, CreateOutline, Create, GridOutline, Copy } from '@vicons/ionicons5';
import { UnorderedListOutlined, EditOutlined, FileImageFilled } from '@vicons/antd';
import { copyFile, createFile, deleteFile, editFile } from '@/api/file';
import { readFile } from '@/api/file';
import { useRoute, useRouter } from 'vue-router';
import { ToolBar } from './components';
interface File {
  fileID: number;
  fileName: string;
  userName: string;
  lastEditTime: string;
  fileImage: string;
}
const router = useRouter();
const route = useRoute();
const projID = ref<number | null>(null);
const pagination = ref({
  current: 1,
  pageSize: 8,
});
const paginationBlock = ref({
  current: 1,
  pageSize: 18,
});
const newFileName = ref('');
const files = ref<File[]>([]);
//当前操作的文件(至少drawio需要这个)
const fileOnOpen = ref<File | null>(null);

//编辑按钮状态切换
const buttonText = ref('编辑');
const editButtonRef = ref(false);
const changeButtonState = () => {
  if (editButtonRef.value == false) {
    editButtonRef.value = true;
    buttonText.value = '取消编辑';
  } else {
    editButtonRef.value = false;
    buttonText.value = '编辑';
  }
};

// 展示模式切换
const showListRef = ref(false);
const setListModel = () => {
  showListRef.value = true;
};
const setBlockModel = () => {
  showListRef.value = false;
};

//删除文件
const handleClickDelete = (item: any) => {
  deleteFile({ fileID: item.fileID })
    .then((res) => {
      if (res.data.result == 0) {
        window.$message.success('删除成功');
        getFileList(projID.value);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
//修改项目名称
const handleClickEdit = (item: any) => {
  window.$dialog.info({
    title: '修改文件名称',
    content: () => {
      return h('div', {}, [
        h(NDivider, { style: 'margin-top: 10px;' }),
        h(NInput, {
          style: 'width: 100%;',
          placeholder: '请输入文件名称',
          value: item.fileName,
          onInput: (e: any) => {
            console.log(e);
            item.fileName = e;
          },
        }),
      ]);
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
const handleClickCreate = () => {
  window.$dialog.info({
    title: '新建文件',
    content: () => {
      return h('div', {}, [
        h(NDivider, { style: 'margin-top: 10px;' }),
        h(NInput, {
          style: 'width: 100%;',
          placeholder: '请输入文件名称',
          onInput: (e: any) => {
            newFileName.value = e;
          },
        }),
      ]);
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
        createFile({
          teamID: null,
          fileName: newFileName.value,
          fileType: 13,
          fileImage: '',
          fatherID: projID.value,
        }).then((res) => {
          if (res.data.result == 0) {
            window.$message.success('创建成功');
            getFileList(projID.value);
          }
        });
      } else {
        window.$message.warning('请输入文件名称');
      }
    },
    onNegativeClick: () => {},
  });
};
//复制文件
const handleClickCopy = (item: any) => {
  newFileName.value = item.fileName + '-副本';
  window.$dialog.info({
    title: '复制文件',
    content: () => {
      return h('div', {}, [
        h(NDivider, { style: 'margin-top: 10px;' }),
        h(NInput, {
          style: 'width: 100%;',
          value: newFileName.value,
          onInput: (e: any) => {
            console.log(e);
            newFileName.value = e;
          },
        }),
      ]);
    },
    positiveText: '确定',
    negativeText: '取消',
    maskClosable: false,
    onPositiveClick: () => {
      if (newFileName.value.length > 0) {
        copyFile({
          fileID: item.fileID as number,
          fatherID: projID.value as number,
          teamID: null,
          newName: newFileName.value,
        }).then((res) => {
          if (res.data.result == 0) {
            window.$message.success('复制成功');
            getFileList(projID.value);
          }
        });
      } else {
        window.$message.warning('请输入文件名称');
      }
    },
    onNegativeClick: () => {},
  });
};
//打开文件
const handleClickOpen = (item: any) => {
  window.open(`/prototype/${item.fileID}`, '_blank');
};

const columns = ref([
  {
    title: '文件名称',
    key: 'fileName',
    render(row: any) {
      return h(NButton, { text: true, onClick: () => handleClickOpen(row) }, { default: row.fileName });
    },
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
                  handleClickDelete(row.fileID);
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
            type: 'warning',
            size: 'small',
            strong: true,
            secondary: true,
            onClick(e) {
              handleClickEdit(row);
            },
          },
          {
            default: '修改',
            icon: h(NIcon, { component: Create }),
          }
        ),
        h(
          NButton,
          {
            type: 'info',
            size: 'small',
            strong: true,
            secondary: true,
            onClick(e) {
              handleClickCopy(row);
            },
          },
          {
            default: '复制',
            icon: h(NIcon, { component: Copy }),
          }
        ),
      ]);
    },
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
        files.value?.push({
          fileID: item.fileID,
          fileName: item.fileName,
          userName: item.userName,
          lastEditTime: item.lastEditTime,
          fileImage: item.fileImage,
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
