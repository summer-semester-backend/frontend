<template>
  <n-modal style="width: 70%" :show="isModuleModalShow" preset="card" @close="emits('close')">
    <template #header> 原型模板 </template>
    <template #action>
      <n-grid>
        <n-gi :span="22"> </n-gi>
        <n-gi>
          <n-button type="success" @click="handleCreate">使用模板</n-button>
        </n-gi>
      </n-grid>
    </template>
    <n-layout has-sider>
      <n-layout-sider bordered content-style="min-height: 70vh">
        <n-menu
          key-field="fileID"
          label-field="fileName"
          :options="moduleOptions"
          :on-update:selected-keys="handleSelect"
        >
        </n-menu>
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
import { copyFile, getProtoCommonModule } from '@/api/file';
import { h, onMounted, ref } from 'vue';
import { NDivider, NInput, NIcon } from 'naive-ui';
import { CreateOutline } from '@vicons/ionicons5';
import { useRoute } from 'vue-router';
const newFileName = ref('');
const selectFileID = ref<number | null>(-1);
const teamID = ref(-1);
const route = useRoute();
const emits = defineEmits(['close', 'refresh']);
const props = withDefaults(defineProps<{ isModuleModalShow: boolean }>(), {
  isModuleModalShow: false,
});
const moduleOptions = ref<Array<{ fileName: string; fileID: number }>>([]);
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
          fatherID: null,
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

const handleSelect = (key: string, item: any) => {};
//获取通用模板
const reload = () => {
  getProtoCommonModule().then((res) => {
    res.data.prototypeList.forEach((item: any) => {
      moduleOptions.value.push({
        fileID: item.fileID,
        fileName: item.fileName,
      });
    });
  });
};
//异步加载
onMounted(() => {
  if (route.params.teamID) {
    teamID.value = parseInt(route.params.teamID.toString());
  } else if (route.params.projID) {
    teamID.value = -1;
  }
  reload();
});
</script>
