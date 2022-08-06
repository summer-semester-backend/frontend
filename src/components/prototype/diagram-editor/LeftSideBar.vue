<template>
  <n-button size="large" text text-color="white" secondary @click="handleBackToWorkspace">
    <template #icon>
      <n-icon>
        <chevron-back />
      </n-icon>
    </template>
    返回项目
  </n-button>
  <div>
    <PageBox />
    <ToolBox @tool-selected="handleToolBoxSelect" />
  </div>
</template>
<script setup lang="ts">
import { ChevronBack } from '@vicons/ionicons5';
import { useRouter } from 'vue-router';
import { EditorTool } from './types';

export interface SideBarEvents {
  (e: 'tool-selected', toolType: EditorTool): void;
  (e: 'page-selected'): void;
  (e: 'page-create'): void;
}

const router = useRouter();
const emits = defineEmits<SideBarEvents>();
function handleBackToWorkspace() {
  router.push({ name: 'PrototypeList' });
}
const handleToolBoxSelect = (selectedTool: EditorTool) => {
  emits('tool-selected', selectedTool);
};
</script>
