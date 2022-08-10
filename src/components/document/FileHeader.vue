<template>
  <div>
    <n-page-header subtitle="文档将实时保存" @back="handleBack">
      <template #header> </template>
      <template #title>
        {{ fileInfo.fileName }}
      </template>
      <template #footer> </template>
      <template #extra>
        <slot name="extra"></slot>
      </template>
    </n-page-header>
  </div>
</template>
<script setup lang="ts">
import { readFile } from '@/api/file';
import { computed, watch, ref } from 'vue';
import { useRouter } from 'vue-router';
const props = withDefaults(defineProps<{ fileID: number | null }>(), {
  fileID: null,
});
const router = useRouter();
const fileInfo = ref({
  fileName: '',
  fatherID: -1,
  fileType: -1,
});

const oriFileID = computed(() => {
  return props.fileID;
});

const handleBack = () => {
  router.back();
};

defineExpose({
  fileInfo,
});

watch(oriFileID, (val) => {
  console.log(val);
  if (val) {
    readFile({ fileID: val, teamID: null }).then((res) => {
      fileInfo.value.fileName = res.data.fileName;
      fileInfo.value.fatherID = res.data.fatherID;
      fileInfo.value.fileType = res.data.fileType;
    });
  }
});
</script>
<style scoped lang="less"></style>
