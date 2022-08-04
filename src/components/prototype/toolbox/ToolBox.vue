<template>
  <div class="object-toolbox">
    <div class="toolbox-title toolbox-title-drag-handle">ToolBox</div>
    <n-grid :x-gap="8" :y-gap="8" :cols="2">
      <n-gi v-for="t in toolDefinitions">
        <ToolBoxItem draggable="true" @mousedown="emits('tool-selected', t.type as EditorTool)"></ToolBoxItem>
      </n-gi>
    </n-grid>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { toolDefinitions, EditorTool } from '../diagram-editor/types';
interface ToolbarEvents {
  (e: 'tool-selected', toolType: EditorTool): void;
}
const emits = defineEmits<ToolbarEvents>();
</script>

<style>
.toolbox-title-drag-handle {
  cursor: move;
}
</style>

<style scoped>
.object-toolbox {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}

.grid-item {
  width: 100%;
  height: 90px;
}

.object-toolbox::-webkit-scrollbar {
  width: 12px; /* width of the entire scrollbar */
}
.object-toolbox::-webkit-scrollbar-track {
  background: rgb(58, 58, 58); /* color of the tracking area */
}
.object-toolbox::-webkit-scrollbar-thumb {
  background-color: gray; /* color of the scroll thumb */
  border-radius: 20px; /* roundness of the scroll thumb */
  border: 3px; /* creates padding around scroll thumb */
}

.toolbox-title {
  display: flex;
  color: #ddd;
  padding: 8px 8px 2px 8px;
  text-align: center;
  font-size: 11px;
  line-height: 1;
  letter-spacing: 1px;
  background-color: #333;
}

.toolbox-container {
  letter-spacing: 2px;
  display: flex;
  gap: 4px;
  margin-left: 8px;
}
</style>
