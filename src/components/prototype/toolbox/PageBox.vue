<template>
  <div class="pagebox">
    <div class="pagebox-title" @click="expanded = !expanded" style="cursor: pointer">
      <n-text class="text-light-50">页面</n-text>
      <div style="flex-grow: 1; pointer-events: none"></div>
      <div>
        <EditorIcon v-show="expanded" size="16px" icon="keyboard_arrow_down" color="white" />
        <EditorIcon v-show="!expanded" size="16px" icon="keyboard_arrow_right" color="white" />
      </div>
    </div>
    <div class="pagebox-content">
      <n-config-provider :theme="darkTheme">
        <n-card v-if="expanded" :bordered="false" class="card">
          <PageBoxItem v-for="(p, i) in pages"> </PageBoxItem>
        </n-card>
      </n-config-provider>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { darkTheme } from 'naive-ui';
import { EditorTool, Item } from '../diagram-editor/types';
interface PageBoxEvents {
  (e: 'page-selected', toolType: EditorTool): void;
}
interface PageItem extends Item {}
const pages = ref<Array<PageItem>>([]);
const expanded = ref(true);
const emits = defineEmits<PageBoxEvents>();
</script>

<style scoped>
.pagebox {
  display: block;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}

.grid-item {
  width: 100%;
  height: 90px;
}

.pagebox::-webkit-scrollbar {
  width: 12px; /* width of the entire scrollbar */
}
.pagebox::-webkit-scrollbar-track {
  background: rgb(58, 58, 58); /* color of the tracking area */
}
.pagebox::-webkit-scrollbar-thumb {
  background-color: gray; /* color of the scroll thumb */
  border-radius: 20px; /* roundness of the scroll thumb */
  border: 3px; /* creates padding around scroll thumb */
}

.pagebox-title {
  display: flex;
  color: #ddd;
  padding: 8px 8px 2px 8px;
  text-align: center;
  font-size: 15px;
  line-height: 2;
  letter-spacing: 1px;
}

.pagebox-container {
  letter-spacing: 2px;
  display: flex;
  gap: 4px;
  margin-left: 8px;
}
</style>
