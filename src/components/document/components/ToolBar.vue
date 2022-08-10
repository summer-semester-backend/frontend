<template>
  <n-page-header style="margin-bottom: 20px">
    <template #title>
      <n-breadcrumb v-if="title == ''">
        <n-breadcrumb-item v-if="teamID != -1" @click="$router.push('/team/' + teamID + '/doc')"
          >文档中心</n-breadcrumb-item
        >
        <n-breadcrumb-item
          v-for="(item, index) in ancestors"
          :key="index"
          @click="jumpTo(item.fileID, item.fileType)"
          >{{ item.fileName }}</n-breadcrumb-item
        >
      </n-breadcrumb>
      <n-h1 v-else>{{ title }}</n-h1>
    </template>
    <template #extra>
      <slot name="toolbar"></slot>
    </template>
  </n-page-header>
</template>
<script setup lang="ts">
import { withDefaults } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
type ancestor = {
  fileName: string;
  fileType: number;
  fileID: number;
};
type Props = {
  teamID: number | null;
  title: string;
  ancestors: ancestor[];
  type: string;
};
const props = withDefaults(defineProps<Props>(), {
  teamID: -1,
  title: '',
  ancestors: () => [],
  type: 'proj',
});

const jumpTo = (fileID: number, fileType: number) => {
  if (props.type == 'proj') {
    if (fileType == 2) {
      router.push('/workspace/' + props.ancestors[0].fileID + '/dir/' + fileID);
    } else {
      router.push('/workspace/' + props.ancestors[0].fileID + '/doc');
    }
  } else {
    router.push('/team/' + props.teamID + '/dir/' + fileID);
  }
};
</script>
<style lang="scss" scoped></style>
