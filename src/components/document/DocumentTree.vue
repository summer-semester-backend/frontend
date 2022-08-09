<template>
  <div>
    <n-card title="文件列表">
      <n-scrollbar style="height: 70vh">
        <n-tree
          :data="treeData"
          key-field="fileID"
          label-field="fileName"
          children-field="sonList"
          :on-load="handleLoad"
          :on-update:selected-keys="handleSelect"
          :cancelable="false"
          :default-selected-keys="[parseInt($route.params.id.toString())]"
        ></n-tree>
      </n-scrollbar>
    </n-card>
  </div>
</template>
<script setup lang="ts">
import { createFile, readFileCenter } from '@/api/file';
import { ProjectOutlined, TeamOutlined } from '@vicons/antd';
import { AddCircleOutline, CreateOutline, DocumentTextOutline, FolderOutline } from '@vicons/ionicons5';
import { computed, watch, ref, h } from '@vue/runtime-core';
import { NButton, NDivider, NIcon, NInput } from 'naive-ui';
import { useRouter } from 'vue-router';

type File = {
  fileName: string;
  fileID: number;
  fileType: number;
  sonList: File[] | null;
  isLeaf: boolean;
  prefix: any;
};
//父组件参数
const props = withDefaults(defineProps<{ fatherID: number | null }>(), {
  fatherID: -1,
});
var oriID = computed(() => {
  return props.fatherID;
});
watch(oriID, (newVal, oldVal) => {
  getFileList(newVal, -1, treeData.value, true);
});
//定义变量
const treeData = ref<File[]>([]);
const fatherID = ref();
const router = useRouter();
//获取文件列表
const getFileList = (fileID: number | null, teamID: number | null, dad: File[], isEnter: boolean) => {
  readFileCenter({
    fileID: fileID,
    teamID: teamID,
  })
    .then((res) => {
      if (isEnter) {
        fatherID.value = res.data.fatherID;
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

//选择
const handleSelect = (keys: Array<any>, rows: Array<any>) => {
  if (keys.length == 0) return;
  if (rows[0].fileType == -1) {
    treeData.value = [];
    getFileList(fatherID.value, -1, treeData.value, false);
  } else if (rows[0].fileType == 14) {
    router.replace({
      name: 'editor',
      params: {
        id: rows[0].fileID,
      },
    });
  }
};
</script>
<style scoped lang="less"></style>
