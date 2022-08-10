<template>
  <ToolBar :ancestors="ancestors" :team-i-d="teamID" :type="teamID == -1 ? 'proj' : 'team'">
    <template #toolbar>
      <n-dropdown :options="options" @select="handleSelect" trigger="click">
        <n-button strong secondary type="info" small size="small" @click="newFileAncestor = fileID">
          <template #icon>
            <n-icon size="20" class="icon">
              <AddCircleOutline />
            </n-icon>
          </template>
          在此处新建
        </n-button>
      </n-dropdown>
    </template>
  </ToolBar>
  <n-data-table
    :columns="columns"
    :data="files"
    :pagination="pagination"
    :cascade="false"
    :bordered="false"
    :row-key="(row) => row.fileID"
    :indent="10"
    allow-checking-not-loaded
    children-key="sonList"
    @load="onLoad"
  />
  <ModuleModal
    :father-i-d="newFileAncestor"
    :is-module-modal-show="isModuleModalShow"
    @close="handleClose"
    @refresh="reload"
  ></ModuleModal>

  <CopyModal
    :file-i-d="oriFileID"
    :file-name="oriFileName"
    :is-copy-modal-show="isCopyModalShow"
    @close="handleClose"
    @refresh="reload"
  ></CopyModal>
</template>

<script setup lang="ts">
import { NButton, NDivider, NDropdown, NIcon, NInput, NSpace, NText } from 'naive-ui';
import { h, ref, computed, onMounted, watch } from 'vue';
import {
  AddCircleOutline,
  Trash,
  ArrowRedo,
  CreateOutline,
  Create,
  Add,
  FolderOutline,
  DocumentTextOutline,
  Copy,
} from '@vicons/ionicons5';
import { ProjectOutlined, TeamOutlined } from '@vicons/antd';
import { copyFile, createFile, deleteFile, editFile, getAncestor } from '@/api/file';
import { readFile, readFileCenter } from '@/api/file';
import { formatDate } from '@/plugins/date';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import { ToolBar } from './components';
import router from '@/router';
interface File {
  fileID: number;
  fileName: string;
  userName: string;
  lastEditTime: string;
  isLeaf: boolean;
  fileType: number;
  isLoaded: boolean;
  sonList: File[];
}
var route = useRoute();
const newFileName = ref('');
const isModuleModalShow = ref(false);
const isCopyModalShow = ref(false);
const newFileAncestor = ref<number | null>(-1);
const oriFileID = ref<number>();
const oriFileName = ref<string>();
const teamID = ref<number | null>(null);
const fileID = ref<number | null>(null);
const { type } = withDefaults(defineProps<{ type: string }>(), { type: 'proj' });
const pagination = ref({
  current: 1,
  pageSize: 10,
});
const ancestors = ref<{ fileName: string; fileType: number; fileID: number }[]>([]);
//列表操作
const columns = ref([
  {
    title: '文件名称',
    width: '350px',
    key: 'fileName',
    render: (row: any) => {
      return h(
        NButton,
        {
          size: 'small',
          text: true,
          onClick: () => handleOpen(row),
        },
        {
          default: row.fileName,
          icon: h(NIcon, {
            component: () => {
              switch (row.fileType) {
                case 0:
                  return h(TeamOutlined);
                case 1:
                  return h(ProjectOutlined);
                case 2:
                  return h(FolderOutline);
                default:
                  return h(DocumentTextOutline);
              }
            },
            size: '18',
          }),
        }
      );
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
    render: (row: File) => h('span', formatDate(row.lastEditTime)),
  },
  {
    title: '操作',
    key: 'actions',
    render(row: any) {
      if (row.fileType > 2) {
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
                    row.isLoaded = false;
                    handleDelete(row.fileID);
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
                handleEdit(row);
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
                handleCopy(row);
              },
            },
            {
              default: '复制',
              icon: h(NIcon, { component: Copy }),
            }
          ),
        ]);
      } else if (row.fileType == 2) {
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
                    row.isLoaded = false;
                    handleDelete(row.fileID);
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
                handleEdit(row);
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
                handleCopy(row);
              },
            },
            {
              default: '复制',
              icon: h(NIcon, { component: Copy }),
            }
          ),
          h(
            NDropdown,
            {
              options: options.value,
              trigger: 'click',
              onSelect: handleSelect,
            },
            h(
              NButton,
              {
                type: 'success',
                size: 'small',
                strong: true,
                secondary: true,
                onClick: () => {
                  row.isLoaded = false;
                  newFileAncestor.value = row.fileID;
                },
              },
              {
                default: '新建',
                icon: h(NIcon, { component: Add }),
              }
            )
          ),
        ]);
      } else if (row.fileType == 1) {
        return h(NSpace, [
          h(
            NDropdown,
            {
              options: options.value,
              trigger: 'click',
              onSelect: handleSelect,
            },
            h(
              NButton,
              {
                type: 'success',
                size: 'small',
                strong: true,
                secondary: true,
                onClick: () => {
                  row.isLoaded = false;
                  newFileAncestor.value = row.fileID;
                },
              },
              {
                default: '新建',
                icon: h(NIcon, { component: Add }),
              }
            )
          ),
        ]);
      }
    },
  },
]);

const options = ref([
  {
    label: '空白文档',
    key: 'empty',
  },
  {
    label: '模板文档',
    key: 'module',
  },
  {
    label: '文件夹',
    key: 'dir',
  },
]);

const files = ref([] as File[]);
//将后端请求的数据放入文件列表
const pushFile = (res: any, dad?: File | null) => {
  res.data.sonList.forEach((item: any) => {
    if (item.fileType > 2 && item.fileType != 14) return;
    if (dad) {
      dad.sonList.push({
        fileID: item.fileID,
        fileName: item.fileName,
        userName: item.userName,
        lastEditTime: item.lastEditTime,
        fileType: item.fileType,
        isLeaf: item.fileType <= 2 ? false : true,
        isLoaded: false,
        sonList: [],
      });
    } else {
      files.value.push({
        fileID: item.fileID,
        fileName: item.fileName,
        userName: item.userName,
        lastEditTime: item.lastEditTime,
        fileType: item.fileType,
        isLeaf: item.fileType <= 2 ? false : true,
        isLoaded: false,
        sonList: [],
      });
    }
  });
};
//获取文件列表
const getFileList = (fileID: number | null, teamID: number | null, dad?: File | null) => {
  if (type === 'team') {
    readFileCenter({
      fileID: fileID,
      teamID: teamID,
    }).then((res) => {
      console.log(res.data);
      pushFile(res, dad);
    });
  } else {
    readFile({
      fileID: fileID,
      teamID: teamID,
    }).then((res) => {
      console.log(res.data);
      pushFile(res, dad);
    });
  }
};
//选择新建类型
const handleSelect = (key: string) => {
  switch (key) {
    case 'empty':
      handleCreate(14, newFileAncestor.value);
      break;
    case 'module':
      isModuleModalShow.value = true;
      break;
    case 'dir':
      handleCreate(2, newFileAncestor.value);
      break;
  }
};
//删除文件
const handleDelete = (id: number) => {
  deleteFile({ fileID: id })
    .then((res) => {
      if (res.data.result == 0) {
        window.$message.success('删除成功');
        files.value = [];
        getFileList(fileID.value, teamID.value);
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
//修改文件名称
const handleEdit = (item: any) => {
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
const handleCreate = (fileType: number, fatherID: number | null) => {
  window.$dialog.info({
    title: fileType == 2 ? '新建文件夹' : '新建文件',
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
          teamID: teamID.value,
          fileName: newFileName.value,
          fileType: fileType,
          fileImage: '',
          fatherID: fatherID,
        })
          .then((res) => {
            if (res.data.result == 0) {
              window.$message.success('创建成功');
              files.value = [];
              getFileList(fileID.value, teamID.value);
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
//打开文件
const handleOpen = (row: any) => {
  if (row.fileType > 2) {
    router.push({
      name: 'editor',
      params: {
        id: row.fileID,
      },
    });
  } else if (row.fileType > 0 && type === 'team') {
    router.push({
      name: 'directory',
      params: {
        dirID: row.fileID,
        teamID: teamID.value,
      },
    });
  } else if (row.fileType > 0) {
    router.replace({
      name: 'DirList',
      params: {
        dirID: row.fileID,
        projID: fileID.value,
      },
    });
  }
};
//复制文件
const handleCopy = (row: any) => {
  oriFileID.value = row.fileID;
  oriFileName.value = row.fileName;
  isCopyModalShow.value = true;
};

//关闭模态框
const handleClose = () => {
  isModuleModalShow.value = false;
  isCopyModalShow.value = false;
};

//异步加载文件
const onLoad = (row: any) => {
  return new Promise<void>((resolve) => {
    if (row.isLoaded) {
      resolve();
    } else {
      row.isLoaded = true;
      getFileList(row.fileID, null, row);
      resolve();
    }
  });
};

//重新加载当前文件
const reload = () => {
  if (route.params.teamID) {
    teamID.value = parseInt(route.params.teamID.toString());
  } else {
    teamID.value = -1;
  }
  if (route.params.dirID) {
    console.log(route.params.dirID);
    fileID.value = parseInt(route.params.dirID.toString());
    //teamID.value = -1;
  } else if (route.params.ProjID) {
    fileID.value = parseInt(route.params.ProjID.toString());
    teamID.value = -1;
  } else {
    fileID.value = -1;
  }
  if (teamID.value > -1 || fileID.value > -1) {
    files.value = [];
    getFileList(fileID.value, teamID.value, null);
  }
  ancestors.value = [];
  if (fileID.value > -1) {
    getAncestorList();
  }
};

//获取祖先文件
const getAncestorList = () => {
  getAncestor({ fileID: fileID.value }).then((res) => {
    res.data.list.forEach((item: any) => {
      ancestors.value.push({
        fileID: item.fileID,
        fileName: item.fileName,
        fileType: item.fileType,
      });
    });
  });
};

watch(route, () => {
  reload();
});

onMounted(() => {
  reload();
});
</script>

<style scoped></style>
