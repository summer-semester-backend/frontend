<template>
  <div class="toolbox">
    <div class="toolbox-title toolbox-title-drag-handle">工具箱</div>
    <div class="toolbox-content">
      <n-config-provider :theme="darkTheme">
        <n-card>
          <n-collapse>
            <n-collapse-item title="图形">
              <n-grid :x-gap="8" :y-gap="8" :cols="4">
                <n-gi v-for="t in shapes">
                  <ToolBoxItem
                    :tool-name="t.title"
                    :icon="t.iconComponent"
                    draggable="true"
                    @drag.stop=""
                    @mousedown="emits('tool-selected', t.type as EditorTool)"
                  ></ToolBoxItem>
                </n-gi>
              </n-grid>
            </n-collapse-item>
            <n-collapse-item title="基本">
              <n-grid :x-gap="8" :y-gap="8" :cols="4">
                <n-gi v-for="t in basic">
                  <ToolBoxItem
                    :tool-name="t.title"
                    :icon="t.iconComponent"
                    draggable="true"
                    @drag.stop=""
                    @mousedown="emits('tool-selected', t.type as EditorTool)"
                  ></ToolBoxItem>
                </n-gi>
              </n-grid>
            </n-collapse-item>
          </n-collapse>
        </n-card>
      </n-config-provider>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from '@vue/reactivity';
import { darkTheme } from 'naive-ui';
import { toolDefinitions, EditorTool, ToolBoxGroup } from '../diagram-editor/types';
interface ToolbarEvents {
  (e: 'tool-selected', toolType: EditorTool): void;
}
const emits = defineEmits<ToolbarEvents>();
const shapes = computed(() => {
  return toolDefinitions.filter((tool) => {
    return tool.group == ToolBoxGroup.SHAPE;
  });
});
const basic = computed(() => {
  return toolDefinitions.filter((tool) => {
    return tool.group == ToolBoxGroup.BASIC;
  });
});
</script>

<style>
.toolbox-title-drag-handle {
  cursor: move;
}
.toolbox-content {
  cursor: auto;
}
</style>

<style scoped>
.toolbox {
  background-color: #333;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}

.grid-item {
  width: 100%;
  height: 90px;
}

.toolbox::-webkit-scrollbar {
  width: 12px; /* width of the entire scrollbar */
}
.toolbox::-webkit-scrollbar-track {
  background: rgb(58, 58, 58); /* color of the tracking area */
}
.toolbox::-webkit-scrollbar-thumb {
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
}

.toolbox-container {
  letter-spacing: 2px;
  display: flex;
  gap: 4px;
  margin-left: 8px;
}
</style>
