<template>
  <div class="toolbox">
    <div class="toolbox-title" @click="expanded = !expanded" style="cursor: pointer">
      <n-text class="text-light-50">工具箱</n-text>
      <div style="flex-grow: 1; pointer-events: none"></div>
      <div>
        <EditorIcon v-show="expanded" size="16px" icon="keyboard_arrow_down" color="white" />
        <EditorIcon v-show="!expanded" size="16px" icon="keyboard_arrow_right" color="white" />
      </div>
    </div>
    <div class="toolbox-content">
      <n-card v-if="expanded" :bordered="false" class="card">
        <n-tabs default-value="component" type="bar" size="small">
          <n-tab-pane name="component" tab="组件">
            <n-collapse class="mt-3">
              <n-collapse-item title="图形">
                <n-grid :x-gap="8" :y-gap="8" :cols="4">
                  <n-gi v-for="t in shapes">
                    <ToolBoxItem
                      :tool-name="t.title"
                      :icon="t.iconComponent"
                      :is-editor-icon="false"
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
                      :is-editor-icon="false"
                      draggable="true"
                      @drag.stop=""
                      @mousedown="emits('tool-selected', t.type as EditorTool)"
                    ></ToolBoxItem>
                  </n-gi>
                </n-grid>
              </n-collapse-item>
            </n-collapse>
          </n-tab-pane>
          <n-tab-pane name="icon" tab="图标">
            <n-scrollbar style="max-height: 550px" class="mt-3">
              <n-grid :x-gap="8" :y-gap="8" :cols="3">
                <n-gi v-for="t in popularIcons">
                  <ToolBoxItem
                    :tool-name="t"
                    :is-editor-icon="true"
                    draggable="true"
                    @drag.stop=""
                    @mousedown="emits('icon-selected', t)"
                  ></ToolBoxItem>
                </n-gi>
              </n-grid>
            </n-scrollbar>
          </n-tab-pane>
        </n-tabs>
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { popularIcons } from '../diagram-editor/components/icons';
import { toolDefinitions, EditorTool, ToolBoxGroup } from '../diagram-editor/types';
interface ToolbarEvents {
  (e: 'tool-selected', toolType: EditorTool): void;
  (e: 'icon-selected', icon: string): void;
}
const expanded = ref(true);
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

<style scoped>
:deep(.n-card) {
  margin-top: 3px;
  margin-bottom: 3px;
}
.toolbox {
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
  font-size: 15px;
  line-height: 2;
  letter-spacing: 1px;
}

.toolbox-container {
  letter-spacing: 2px;
  display: flex;
  gap: 4px;
  margin-left: 8px;
}
</style>
