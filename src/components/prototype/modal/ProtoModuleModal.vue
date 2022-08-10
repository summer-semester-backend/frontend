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
          v-model:value="currentOption"
          @update-value="handleSelect"
        >
        </n-menu>
      </n-layout-sider>
      <n-layout>
        <n-carousel v-if="isSelected" :show-arrow="true" style="height: 100% width: 100%;">
          <img v-for="img in previewImages" class="carousel-img" :src="img" />
        </n-carousel>
        <n-empty v-else style="height: 700px" description="你什么也找不到"> </n-empty>
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
import { computed } from '@vue/reactivity';
const newFileName = ref('');
const selectFileID = ref<number | null>(-1);
const teamID = ref(-1);
const previewImagesMap: Map<string, Array<string>> = new Map();
const previewImages = ref<Array<string>>([]);
const route = useRoute();
const emits = defineEmits(['close', 'refresh']);
const projID = ref(-1);
const props = withDefaults(defineProps<{ isModuleModalShow: boolean }>(), {
  isModuleModalShow: false,
});
const currentOption = ref('');
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
          fatherID: projID.value,
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

const handleSelect = (key: string, item: any) => {
  console.log('menu key', key);
  previewImages.value = previewImagesMap.get(key) as Array<string>;
  selectFileID.value = parseInt(key);
};

const isSelected = computed(() => {
  return currentOption.value != '';
});
//获取通用模板
const reload = () => {
  getProtoCommonModule().then((res) => {
    res.data.prototypeList.forEach((item: any) => {
      moduleOptions.value.push({
        fileID: item.fileID,
        fileName: item.fileName,
      });
      previewImagesMap.set(item.fileID, item.previewImages);
    });
  });
  // .finally(() => {
  //   currentOption.value = moduleOptions.value[0].fileName;
  //   console.log(currentOption.value);
  // });
};
//异步加载
onMounted(() => {
  if (route.params.ProjID) {
    teamID.value = -1;
    projID.value = parseInt(route.params.ProjID as string);
  }
  reload();
});
</script>
<style scoped>
.carousel-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
