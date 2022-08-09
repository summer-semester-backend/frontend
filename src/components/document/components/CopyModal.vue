<template>
  <n-modal style="width: 35%" preset="card" :show="isCopyModalShow" @close="emits('close')">
    <template #header> 选择复制位置 </template>
    <template #action>
      <n-grid>
        <n-gi :span="22"> </n-gi>
        <n-gi>
          <n-button type="info" @click="handleCopy">复制</n-button>
        </n-gi>
      </n-grid>
    </template>
    <n-scrollbar style="height: 35vh">
      <n-tree
        block-line
        :data="treeData"
        key-field="fileID"
        label-field="fileName"
        children-field="sonList"
        :on-load="handleLoad"
        :on-update:selected-keys="handleSelect"
      ></n-tree>
    </n-scrollbar>
  </n-modal>
</template>
<script setup lang="ts">
import { copyFile, readFile, readFileCenter } from '@/api/file';
import { ProjectOutlined, TeamOutlined } from '@vicons/antd';
import { FolderOutline } from '@vicons/ionicons5';
import { NIcon } from 'naive-ui';
import { h, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
type File = {
  fileName: string;
  fileID: number;
  fileType: number;
  sonList: File[] | null;
  isLeaf: boolean;
  prefix: any;
};

//父组件传参
const props = withDefaults(defineProps<{ fileID: number | null; isCopyModalShow: boolean; fileName: string }>(), {
  fileID: -1,
  isCopyModalShow: false,
  fileName: '',
});

const emits = defineEmits(['close', 'refresh']);

const route = useRoute();
const treeData = ref<File[]>([]);
const type = ref('team');
const targetID = ref<number>(-1);
//将后端请求的数据放入文件列表
const pushFile = (res: any, dad: File[] | null) => {
  res.data.sonList.forEach((item: any) => {
    if (item.fileType > 2) return;
    dad?.push({
      fileID: item.fileID,
      fileName: item.fileName,
      fileType: item.fileType,
      isLeaf: item.fileType <= 2 ? false : true,
      sonList: null,
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
            }
          },
        });
      },
    });
  });
};
//获取文件列表
const getFileList = (fileID: number | null, teamID: number | null, dad?: File[] | null) => {
  if (type.value === 'team') {
    readFileCenter({
      fileID: fileID,
      teamID: teamID,
    }).then((res) => {
      console.log(res.data);
      pushFile(res, dad || null);
    });
  } else {
    readFile({
      fileID: fileID,
      teamID: teamID,
    }).then((res) => {
      console.log(res.data);
      pushFile(res, dad || null);
    });
  }
};
//异步加载
const handleLoad = (row: any) => {
  return new Promise<void>((resolve) => {
    if (row.sonList) {
      resolve();
    } else {
      row.sonList = [];
      getFileList(row.fileID, null, row.sonList);
      resolve();
    }
  });
};

//选择文件
const handleSelect = (keys: Array<any>, rows: Array<any>) => {
  if (rows[0].fileType == 0) {
    targetID.value = -1;
    return;
  }
  targetID.value = keys[0];
};

const handleCopy = () => {
  if (targetID.value === -1) {
    window.$message.warning('请选择复制位置');
    return;
  }
  copyFile({ fatherID: targetID.value, fileID: props.fileID, teamID: -1, newName: props.fileName }).then((res: any) => {
    if (res.data.result <= 1) {
      window.$message.success('复制成功');
      emits('close');
      emits('refresh');
    }
  });
};

onMounted(() => {
  if (route.params.teamID) {
    type.value = 'team';
    getFileList(-1, parseFloat(route.params.teamID.toString()), treeData.value);
  } else if (route.params.projID) {
    type.value = 'proj';
    getFileList(parseFloat(route.params.projID.toString()), -1, treeData.value);
  }
});
</script>
<style scoped lang="less"></style>
