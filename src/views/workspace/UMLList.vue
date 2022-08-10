<template>
  <ToolBar title="UML">
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
        <n-button strong secondary type="info" small size="small" @click="openModel">
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

  <!-- 列表格式 -->
  <n-data-table v-if="showListRef" :columns="columns" :data="files" :pagination="pagination" :bordered="false" />

  <!-- 块状格式 -->
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
    @openModel="openModel"
  >
    <template #icon>
      <FileImageFilled color="#E26E0D" />
    </template>
  </BlockModalData>

  <!-- 新建弹窗 -->
  <n-modal
    v-model:show="showModel"
    preset="dialog"
    title="新建文件"
    size="medium"
    positive-text="确认"
    negative-text="取消"
    @positive-click="create"
    @negative-click="closeModel"
  >
    <n-divider style="margin: 15px auto" />
    <n-space>
      <n-input v-model:value="fileNameRef" placeholder="请输入文件名" clearable style="width: 350px" />
    </n-space>
  </n-modal>

  <!-- 改名弹窗 -->
  <n-modal
    v-model:show="showModelEdit"
    preset="dialog"
    title="更改文件名"
    size="medium"
    positive-text="确认"
    negative-text="取消"
    @positive-click="editFileName"
    @negative-click="closeModelEdit"
  >
    <n-divider style="margin: 15px auto" />
    <n-space>
      <n-input v-model:value="fileNameRef" placeholder="请输入文件名" clearable style="width: 350px" />
    </n-space>
  </n-modal>

  <!-- 复制弹窗 -->
  <n-modal
    v-model:show="showModelCopy"
    preset="dialog"
    title="复制文件"
    size="medium"
    positive-text="确认"
    negative-text="取消"
    @positive-click="copy"
    @negative-click="closeModelCopy"
  >
    <n-divider style="margin: 15px auto" />
    <n-space>
      <n-input v-model:value="fileNameRef" placeholder="请输入文件名" clearable style="width: 350px" />
    </n-space>
  </n-modal>
</template>

<script setup lang="ts">
import { NButton, NIcon, NSpace, useDialog } from 'naive-ui';
import { h, ref, computed, onMounted } from 'vue';
import { Add, AddCircleOutline, Trash, ArrowRedo, Create, GridOutline, List, Copy } from '@vicons/ionicons5';
import { UnorderedListOutlined, EditOutlined, FileImageFilled } from '@vicons/antd';
import { readFile, createFile, editFile, deleteFile, copyFile } from '@/api/file';
import { useRoute } from 'vue-router';
import { ToolBar } from './components';
import { useMessage } from 'naive-ui';
import drawioEmbed from 'drawio-embed';

interface File {
  fileID: number;
  fileName: string;
  userName: string;
  lastEditTime: string;
  fileImage: string;
}

interface FileEdit {
  fileID: number;
  fileName: string;
  fileImage: string;
  fatherID: number;
  data: any;
}

//
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

// 新建或准备更改的名字
const fileNameRef = ref<string>('');
//新建
const showModel = ref(false);
const openModel = () => {
  fileNameRef.value = '';
  showModel.value = true;
};
const closeModel = () => {
  showModel.value = false;
  fileNameRef.value = '';
};
//更改
const showModelEdit = ref(false);
const openModelEdit = () => {
  fileNameRef.value = '';
  showModelEdit.value = true;
};
const closeModelEdit = () => {
  showModelEdit.value = false;
  fileNameRef.value = '';
};
//复制
const showModelCopy = ref(false);
const openModelCopy = () => {
  fileNameRef.value = fileOnOpen.value?.fileName + '-副本';
  showModelCopy.value = true;
};
const closeModelCopy = () => {
  showModelCopy.value = false;
  fileNameRef.value = '';
};

const route = useRoute();
const message = useMessage();
const dialog = useDialog();
const projID = ref<number | null>(null);
const pagination = ref({
  current: 1,
  pageSize: 8,
});
const paginationBlock = ref({
  current: 1,
  pageSize: 18,
});

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
    render(row: File) {
      return h(NSpace, [
        h(
          NButton,
          {
            type: 'error',
            size: 'small',
            strong: true,
            secondary: true,
            onClick(e) {
              handleClickDelete(row);
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

const files = ref<File[]>([]);
//当前操作的文件(至少drawio需要这个)
const fileOnOpen = ref<File | null>(null);

const emits = defineEmits(['refresh']);
const handleClickOpen = (file: any) => {
  fileOnOpen.value = file;
  // console.log(fileOnOpen.value.fileImage);
  openDeskWithFile(fileOnOpen.value!.fileImage);
};
const handleClickEdit = (file: any) => {
  fileOnOpen.value = file;
  fileNameRef.value = fileOnOpen.value!.fileName;
  openModelEdit();
};
const handleClickCopy = (file: any) => {
  fileOnOpen.value = file;
  openModelCopy();
};

const handleClickDelete = (file: any) => {
  dialog.warning({
    title: '警告',
    content: '你确定要删除这个文件吗？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      deleFlie(file.fileID);
    },
    onNegativeClick: () => {},
  });
};

const getFileList = (id: number | null) => {
  readFile({
    fileID: id,
    teamID: null,
  })
    .then((res) => {
      files.value = [];
      res.data.sonList.forEach((item: any) => {
        if (item.fileType === 12) {
          files.value.push({
            fileID: item.fileID,
            fileName: item.fileName,
            userName: item.userName,
            lastEditTime: item.lastEditTime,
            fileImage: item.fileImage,
          });
        }
      });
    })
    .finally(() => {
      emits('refresh');
    });
};

const create = () => {
  if (fileNameRef.value == null || fileNameRef.value == '') {
    message.warning('文件名不能为空!');
    return;
  }
  createFile({ teamID: null, fileName: fileNameRef.value, fileType: 12, fileImage: '', fatherID: projID.value })
    .then((res) => {
      if (res.data.result == 0) {
        window.$message.success('创建成功');
        closeModel();
      } else if (res.data.result == 1) {
        window.$message.warning(res.data.message);
      } else if (res.data.result == 2) {
        window.$message.error(res.data.message);
      }
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      getFileList(projID.value);
    });
};

const getFileInfo = (file: File) => {
  readFile({ fileID: file.fileID, teamID: null })
    .then((res) => {
      if (res.data.result == 0) {
        window.$message.success('获取成功');
        // return res.data.fileImage;
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

const edit = (file: FileEdit) => {
  editFile(file)
    .then((res) => {
      if (res.data.result == 0) {
        window.$message.success('修改成功');
      } else if (res.data.result == 1) {
        window.$message.warning(res.data.message);
      } else if (res.data.result == 2) {
        window.$message.error(res.data.message);
      }
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      getFileList(projID.value);
    });
};

const editFileName = () => {
  if (fileNameRef.value == null || fileNameRef.value == '') {
    message.warning('文件名不能为空!');
    return;
  }
  let fileEdit: FileEdit = {
    fileID: fileOnOpen.value?.fileID as number,
    fileName: fileNameRef.value,
    fileImage: fileOnOpen.value?.fileImage as string,
    fatherID: projID.value as number,
    data: null,
  };
  edit(fileEdit);
  closeModelEdit();
};

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

const copy = () => {
  if (fileNameRef.value == null || fileNameRef.value == '') {
    message.warning('文件名不能为空!');
    return;
  }

  copyFile({
    fileID: fileOnOpen.value?.fileID as number,
    fatherID: projID.value as number,
    teamID: null,
    newName: fileNameRef.value,
  })
    .then((res) => {
      if (res.data.result == 0) {
        window.$message.success('复制成功');
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

onMounted(() => {
  projID.value = parseInt(route.params.ProjID.toString());
  getFileList(projID.value);
});

//以下是Drawio部分
// 初始化
const openDrawio = drawioEmbed('http://43.138.71.3:8070/');

//监听返回的图片数据
window.addEventListener('drawioImageCreated', (evt: any) => {
  const { imageType, imageContent } = evt;
  if (imageType == 'svg') {
    let fileEdit: FileEdit = {
      fileID: fileOnOpen.value?.fileID as number,
      fileName: fileOnOpen.value?.fileName as string,
      fileImage: imageContent,
      fatherID: projID.value as number,
      data: null,
    };
    if (fileEdit.fileID == null || fileEdit.fileName == null) return;
    edit(fileEdit);
    // console.log(imageContent);
    // svgDom.innerHTML = imageContent;
    // str = imageContent;
  }
});

// 监听是否预加载完成
window.addEventListener('drawioLoaded', (evt) => {
  message.success('UML编辑器初始化完成！');
  // console.log("Drawio is Ready !");
  // state.value = "Ready!"
});

// 在需要时打开 drawio 开始编辑
const openDesk = () => {
  if (openDrawio == null || openDrawio.isLoaded() == false) {
    message.loading('UML编辑器正在初始化……');
    return;
  }
  openDrawio().catch(() => {
    message.loading('UML编辑器正在初始化……');
  });
};

// 携带参数的打开
const openDeskWithFile = (svgStream: any) => {
  if (openDrawio == null || openDrawio.isLoaded() == false) {
    message.loading('UML编辑器正在初始化……');
    return;
  }
  openDrawio(svgStream).catch(() => {
    message.loading('UML编辑器正在初始化……');
  });
};
</script>

<style scoped></style>

<style></style>
