<template>
  <div class="toolbar">
    <div class="btn" @click="zoomOut" title="缩小"><EditorIcon icon="zoom_out" /></div>
    <div class="zoom-info" title="Current Zoom">{{ zoomManager.getZoomFactor() * 100 }}%</div>
    <div class="btn" @click="zoomIn" title="放大"><EditorIcon icon="zoom_in" /></div>
    <div class="btn" @click="zoomReset" title="重置"><EditorIcon icon="center_focus_weak" /></div>
    <div class="mode-info" @click="emit('mode-changed')" title="模式切换">{{ editable ? '预览模式' : '编辑模式' }}</div>
  </div>
</template>

<script setup lang="ts">
import { IZoomManager } from '../ZoomManager';

// The component props and events
// ------------------------------------------------------------------------------------------------------------------------
interface ToolbarProps {
  zoomManager: IZoomManager;
  editable: boolean;
}

const { zoomManager, editable } = defineProps<ToolbarProps>();

interface ToolbarEvents {
  (e: 'zoom-changed', newZoomFactor: number, scrollViewerToCenter?: boolean): void;
  (e: 'mode-changed'): void;
}

const emit = defineEmits<ToolbarEvents>();
// ------------------------------------------------------------------------------------------------------------------------

function zoomReset() {
  const oldZoom = zoomManager.getZoomFactor();
  const newZoom = zoomManager.zoomReset();
  if (oldZoom !== newZoom) emit('zoom-changed', newZoom, true);
}

function zoomIn() {
  const oldZoom = zoomManager.getZoomFactor();
  const newZoom = zoomManager.zoomIn();
  if (oldZoom !== newZoom) emit('zoom-changed', newZoom, false);
}

function zoomOut() {
  const oldZoom = zoomManager.getZoomFactor();
  const newZoom = zoomManager.zoomOut();
  if (oldZoom !== newZoom) emit('zoom-changed', newZoom, false);
}

defineExpose({ zoomReset });
</script>

<style scoped>
.toolbar {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  width: auto;
  height: auto;
  background-color: #fefefe;
  border: 1px solid #ccc;
  box-shadow: 2px 2px 5px #ccc;
  gap: 0px;
  user-select: none;
}

.btn {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  width: 32px;
  height: 32px;
  text-align: center;
  background-color: #fefefe;
  color: #888;
}

.btn:hover {
  background-color: #efefef;
}

.mode-info {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  width: 64px;
  height: 32px;
  text-align: center;
  background-color: #fefefe;
  color: #888;
}

.mode-info :hover {
  background-color: #efefef;
}
.zoom-info {
  width: 40px;
  font-size: 12px;
  text-align: center;
}
</style>
