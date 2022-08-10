<template>
  <div>
    <n-card>
      <template #header>
        {{ dirName == '项目文档' ? '文档中心' : dirName }}
      </template>
      <template #header-extra>
        <n-dropdown :options="options" @select="handleCreateSelect" trigger="click">
          <n-button size="small" @click="newFileAncestor = oriID || -1">
            <template #icon>
              <n-icon size="20" class="icon">
                <Add />
              </n-icon>
            </template>
          </n-button>
        </n-dropdown>
      </template>
      <n-scrollbar style="height: 70vh">
        <n-tree
          block-line
          :data="treeData"
          key-field="fileID"
          label-field="fileName"
          children-field="sonList"
          :on-load="handleLoad"
          :on-update:selected-keys="handleFileSelect"
          :default-selected-keys="[parseInt($route.params.id.toString())]"
        ></n-tree>
      </n-scrollbar>
    </n-card>
    <ModuleModal
      :father-i-d="newFileAncestor"
      :is-module-modal-show="isModuleModalShow"
      @close="isModuleModalShow = false"
      @refresh="
        () => {
          treeData = [];
          getFileList(oriID, -1, treeData, true);
        }
      "
    ></ModuleModal>
  </div>
</template>
<script setup lang="ts">
import { createFile, readFileCenter } from '@/api/file';
import { ProjectOutlined, TeamOutlined } from '@vicons/antd';
import { Add, AddCircleOutline, CreateOutline, DocumentTextOutline, FolderOutline } from '@vicons/ionicons5';
import { computed, watch, ref, h } from '@vue/runtime-core';
import { NButton, NDivider, NDropdown, NIcon, NInput } from 'naive-ui';
import { useRouter } from 'vue-router';

type File = {
  fileName: string;
  fileID: number;
  fileType: number;
  sonList: File[] | null;
  isLeaf: boolean;
  prefix: any;
  suffix: any;
};
//父组件参数
const props = withDefaults(defineProps<{ fatherID: number | null }>(), {
  fatherID: -1,
});
var oriID = computed(() => {
  return props.fatherID;
});
watch(oriID, (newVal, oldVal) => {
  if (oldVal == -1) getFileList(newVal, -1, treeData.value, true);
});
//定义变量
const treeData = ref<File[]>([]);
const fatherID = ref(); //当前文件夹的上一级文件夹ID
const dirName = ref(''); //当前文件夹名称
const newFileAncestor = ref<number>(-1); //新建文件的父文件夹ID
const newFileName = ref(''); //新建文件的名称
const isModuleModalShow = ref(false);
const router = useRouter();
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
//获取文件列表
const getFileList = (fileID: number | null, teamID: number | null, dad: File[], isEnter: boolean) => {
  readFileCenter({
    fileID: fileID,
    teamID: teamID,
  })
    .then((res) => {
      if (isEnter) {
        fatherID.value = res.data.fatherID;
        dirName.value = res.data.fileName;
      }
      res.data.sonList.forEach((item: any) => {
        if (item.fileType > 2 && item.fileType != 14) return;
        dad.push({
          fileID: item.fileID,
          fileName: item.fileName,
          fileType: item.fileType,
          sonList: null,
          isLeaf: item.fileType <= 2 ? false : true,
          prefix: () => {
            return h(NIcon, {
              component: () => {
                switch (item.fileType) {
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
            });
          },
          suffix: () => {
            if (item.fileType == 14 || item.fileType == 0) return null;
            return h(
              NDropdown,
              {
                options: options.value,
                trigger: 'click',
                onSelect: handleCreateSelect,
              },
              h(
                NButton,
                {
                  text: true,
                  circle: true,
                  onClick: () => {
                    newFileAncestor.value = item.fileID;
                  },
                },
                {
                  icon: h(NIcon, { component: AddCircleOutline }),
                }
              )
            );
          },
        });
      });
    })
    .then(() => {
      console.log(fatherID.value);
      if (treeData.value[0].fileType != 0 && treeData.value[0].fileType != -1) {
        treeData.value.unshift({
          fileID: -1,
          fileName: '..',
          fileType: -1,
          sonList: [],
          isLeaf: true,
          prefix: () => h(NIcon, { component: () => h(FolderOutline) }),
          suffix: () => {},
        });
      }
    });
};

//异步加载
const handleLoad = (row: any) => {
  console.log(row);
  return new Promise<void>((resolve) => {
    if (row.sonList != null) {
      resolve();
    } else {
      row.sonList = [];
      getFileList(row.fileID, null, row.sonList, false);
      resolve();
    }
  });
};

//选择打开文件
const handleFileSelect = (keys: Array<any>, rows: Array<any>) => {
  if (keys.length == 0) return;
  if (rows[0].fileType == -1) {
    treeData.value = [];
    getFileList(fatherID.value, -1, treeData.value, true);
  } else if (rows[0].fileType == 14) {
    router.replace({
      name: 'editor',
      params: {
        id: rows[0].fileID,
      },
    });
  }
};
//选择新建类型
const handleCreateSelect = (key: string) => {
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
          teamID: -1,
          fileName: newFileName.value,
          fileType: fileType,
          fileImage: '',
          fatherID: fatherID,
        })
          .then((res) => {
            if (res.data.result == 0) {
              window.$message.success('创建成功');
              treeData.value = [];
              getFileList(oriID.value, -1, treeData.value, true);
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
</script>
<style scoped lang="less"></style>
