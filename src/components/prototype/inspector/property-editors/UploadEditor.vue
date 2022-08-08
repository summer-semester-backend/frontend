<template>
  <n-upload
    directory-dnd
    action="http://43.138.77.8:8000/api/upload"
    :max="1"
    :with-credentials="true"
    @finish="handleUploadFinish"
    list-type="image-card"
  >
    <n-button text size="tiny">上传图片</n-button>
  </n-upload>
</template>

<script setup lang="ts">
import { UploadFileInfo } from 'naive-ui';
import { onUpdated } from 'vue';
import { ObjectProperty } from '../types';
import { getObjectValue, setObjectValue } from './utils';

// The component props and events
// ------------------------------------------------------------------------------------------------------------------------
export interface UploadEditorProps {
  object?: any;
  property: ObjectProperty;
}

export interface UploadEditorEvents {
  (e: 'property-changed', property: ObjectProperty, newValue: any): void;
}

// Define props
const { object, property } = defineProps<UploadEditorProps>();

// Define events
const emit = defineEmits<UploadEditorEvents>();
// ------------------------------------------------------------------------------------------------------------------------
onUpdated(() => {
  console.log('UploadEditor: onUpdated');
});

function onChange(e: any) {
  setObjectValue(object, property.name, e.target.value);
  emit('property-changed', property, e.target.value);
}

function handleUploadFinish({ file, event }: { file: UploadFileInfo; event?: ProgressEvent }) {
  let ret = JSON.parse((event?.target as XMLHttpRequest).response);
  setObjectValue(object, property.name, ret.url);
  emit('property-changed', property, ret.url);
  return file;
}
</script>

<style scoped>
.editor {
  width: calc(100% - 8px);
}
</style>
