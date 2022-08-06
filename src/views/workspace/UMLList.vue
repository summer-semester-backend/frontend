<template>
  <ToolBar title="UML">
    <template #toolbar>
      <n-button text @click="openModel">
        <n-icon size="26" class="icon">
          <AddCircleOutline />
        </n-icon>
      </n-button>
    </template>
  </ToolBar>
  <n-data-table :columns="columns" :data="files" :pagination="pagination" :bordered="false" />

  <n-modal v-model:show="showModel">
    <n-card
      style="width: 600px"
      title="新建文件"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
      header-style="text-align:center"
    >
      <template #default>
        <n-form ref="formRef" label-placement="left" require-mark-placement="left">
          <n-form-item label="&emsp;文件名：" path="email">
            <n-input v-model:value="fileNameRef" placeholder="请输入" clearable style="width: 350px" />
          </n-form-item>
        </n-form>
      </template>
      <template #footer>
        <n-space justify="center" :size="50">
          <n-button type="info" @click="create">确定</n-button>
          <n-button type="default" @click="closeModel">取消</n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>

  <n-modal v-model:show="showModelEdit">
    <n-card
      style="width: 600px"
      title="更改文件名"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
      header-style="text-align:center"
    >
      <template #default>
        <n-form ref="formRef" label-placement="left" require-mark-placement="left">
          <n-form-item label="&emsp;文件名：" path="email">
            <n-input v-model:value="fileNameRef" placeholder="请输入" clearable style="width: 350px" />
          </n-form-item>
        </n-form>
      </template>
      <template #footer>
        <n-space justify="center" :size="50">
          <n-button type="info" @click="editFileName">确定</n-button>
          <n-button type="default" @click="closeModelEdit">取消</n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { NButton, NIcon, NSpace, useDialog } from 'naive-ui';
import { h, ref, computed, onMounted } from 'vue';
import { AddCircleOutline, Trash, ArrowRedo, Create } from '@vicons/ionicons5';
import { readFile, createFile, editFile, deleteFile } from '@/api/file';
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

const fileNameRef = ref<string>('');
const showModel = ref(false);
const openModel = () => {
  showModel.value = true;
};
const closeModel = () => {
  showModel.value = false;
  fileNameRef.value = '';
};
const showModelEdit = ref(false);
const openModelEdit = () => {
  showModelEdit.value = true;
};
const closeModelEdit = () => {
  showModelEdit.value = false;
  fileNameRef.value = '';
};

const route = useRoute();
const message = useMessage();
const dialog = useDialog();
const projID = ref<number | null>(null);
const pagination = ref({
  current: 1,
  pageSize: 10,
});
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
              dialog.warning({
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
              fileOnOpen.value = row;
              // console.log(fileOnOpen.value.fileImage);
              openDeskWithFile(fileOnOpen.value.fileImage);
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
              fileOnOpen.value = row;
              fileNameRef.value = fileOnOpen.value.fileName;
              openModelEdit();
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

const files = ref([{}]);
const fileOnOpen = ref<File | null>(null);

const getFileList = (id: number | null) => {
  readFile({
    fileID: id,
    teamID: null,
  }).then((res) => {
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
  //只修改了数据，其他名字等还不支持

  editFile(file)
    .then((res) => {
      if (res.data.result == 0) {
        window.$message.success('修改成功');
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

onMounted(() => {
  projID.value = parseInt(route.params.ProjID.toString());
  getFileList(projID.value);
});

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
  openDrawio();
};

// 携带参数的打开
const openDeskWithFile = (svgStream: any) => {
  if (openDrawio == null || openDrawio.isLoaded() == false) {
    message.loading('UML编辑器正在初始化……');
    return;
  }
  openDrawio(svgStream);
};
</script>

<style scoped></style>
