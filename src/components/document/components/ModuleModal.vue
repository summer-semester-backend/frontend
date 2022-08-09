<template>
  <n-modal style="width: 70%" :show="isModuleModalShow" preset="card" @close="emits('close')">
    <template #header> 文档模板 </template>
    <template #action>
      <n-grid>
        <n-gi :span="22"> </n-gi>
        <n-gi>
          <n-button type="info" @click="handleCreate">使用模板</n-button>
        </n-gi>
      </n-grid>
    </template>
    <n-layout has-sider>
      <n-layout-sider bordered content-style="min-height: 70vh">
        <n-tree
          block-line
          :data="treeData"
          key-field="fileID"
          label-field="fileName"
          children-field="sonList"
          :on-load="handleLoad"
          :on-update:selected-keys="handleSelect"
        >
        </n-tree>
      </n-layout-sider>
      <n-layout>
        <n-scrollbar x-scrollable style="max-height: 70vh">
          <div id="container"></div>
        </n-scrollbar>
      </n-layout>
    </n-layout>
  </n-modal>
</template>
<script setup lang="ts">
import { copyFile, getCommonModule, getTeamModule, readFile, readModule } from '@/api/file';
import { useRoute } from 'vue-router';
import { h, onMounted, ref } from 'vue';
import { NDivider, NIcon, NInput } from 'naive-ui';
import { CreateOutline } from '@vicons/ionicons5';
type Module = {
  fileName: string;
  fileID: number;
  fileType: number;
  sonList: Module[] | null;
  isLeaf: boolean;
};
const props = withDefaults(defineProps<{ isModuleModalShow: boolean; fatherID: number | null }>(), {
  isModuleModalShow: false,
});
const route = useRoute();
const emits = defineEmits(['close', 'refresh']);
const treeData = ref<Module[]>([]);
const teamID = ref<number | null>(-1);
const selectFileID = ref<number | null>(-1);
const newFileName = ref<string>('');

//获取通用模板
const getCommonModuleList = (fileID: number | null, dad: any) => {
  getCommonModule({ fileID: fileID }).then((res) => {
    res.data.sonList.forEach((item: any) => {
      dad.push({
        fileID: item.fileID,
        fileName: item.fileName,
        fileType: item.fileType,
        sonList: null,
        isLeaf: item.fileType == 2 ? false : true,
      });
    });
  });
};
//获取团队模板
const getTeamModuleList = (teamID: number | null, fileID: number | null) => {
  let teamModule: Module = {
    fileName: '团队模板',
    fileID: -1,
    fileType: -1,
    sonList: [],
    isLeaf: false,
  };
  getTeamModule({ teamID: teamID, fileID: fileID }).then((res) => {
    res.data.sonList.forEach((item: any) => {
      teamModule.sonList?.push({
        fileID: item.fileID,
        fileName: item.fileName,
        fileType: item.fileType,
        sonList: null,
        isLeaf: true,
      });
    });
    treeData.value.push(teamModule);
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
      getCommonModuleList(row.fileID, row.sonList);
      resolve();
    }
  });
};

//预览
const handleSelect = (keys: Array<number | string>, rows: Array<any>) => {
  if (keys.length > 0 && (rows[0].fileType == 14 || rows[0].fileType == 15)) {
    selectFileID.value = parseInt(keys[0].toString());
    readModule({ fileID: parseInt(keys[0].toString()) }).then((res) => {
      const tempNode = document.createElement('div');
      const container = document.getElementById('container') || tempNode;
      container.innerHTML = res.data.data;
    });
  } else {
    selectFileID.value = -1;
  }
};

const handleCreate = () => {
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
      if (selectFileID.value == -1) {
        window.$message.warning('请选择模板');
      } else if (newFileName.value.length == 0) {
        window.$message.warning('请输入文件名称');
      } else if (newFileName.value.length > 0) {
        copyFile({
          fileID: selectFileID.value,
          teamID: teamID.value,
          fatherID: props.fatherID,
          newName: newFileName.value,
        }).then((res) => {
          if (res.data.result == 0) {
            window.$message.success('创建成功');
            emits('close');
            emits('refresh');
          }
        });
      }
    },
    onNegativeClick: () => {},
  });
};

onMounted(() => {
  getCommonModuleList(-1, treeData.value);
  if (route.params.teamID) {
    teamID.value = parseInt(route.params.teamID.toString());
    getTeamModuleList(teamID.value, -1);
  } else if (route.params.projID) {
    teamID.value = -1;
    getTeamModuleList(-1, parseInt(route.params.projID.toString()));
  } else {
    teamID.value = -1;
  }
});
</script>
<style lang="less" scoped></style>
