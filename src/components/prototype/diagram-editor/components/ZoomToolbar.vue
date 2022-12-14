<template>
  <div class="toolbar">
    <div class="btn" @click="zoomOut" title="缩小"><EditorIcon icon="zoom_out" /></div>
    <div class="zoom-info" title="Current Zoom">{{ props.zoomManager.getZoomFactor() * 100 }}%</div>
    <div class="btn" @click="zoomIn" title="放大"><EditorIcon icon="zoom_in" /></div>
    <div class="btn" @click="zoomReset" title="重置"><EditorIcon icon="center_focus_weak" /></div>
    <div v-if="showModeChange" class="mode-info" @click="emit('mode-changed')" title="模式切换">
      {{ editable ? '预览模式' : '编辑模式' }}
    </div>
    <div v-if="showModeChange" class="btn" @click="shareLink" title="分享预览">
      <EditorIcon icon="share" />
    </div>
    <div v-if="showModeChange" class="btn" @click="closeLink" title="关闭预览">
      <EditorIcon icon="person_off" />
    </div>
  </div>

  <n-modal
    v-model:show="show"
    id="copy"
    preset="dialog"
    title="通过链接分享预览页"
    size="medium"
    positive-text="复制"
    negative-text="取消"
    :data-clipboard-text="code"
    @positive-click="handlePositiveClick"
  >
    <n-divider style="margin: 15px auto" />
    <n-space>
      链接（7天内有效）
      <n-input v-model:value="code" type="text" placeholder="" style="width: 375px" :disabled="true" />
    </n-space>
  </n-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IZoomManager } from '../ZoomManager';
import Clipboard from 'clipboard';
import { closeSharePrototype, getPrototypeShareCode } from '@/api/file';
import { useRoute } from 'vue-router';
import { OperationType, syncManager } from '../synchronous/SyncManager';
// The component props and events
// ------------------------------------------------------------------------------------------------------------------------
interface ToolbarProps {
  zoomManager: IZoomManager;
  editable: boolean;
  showModeChange?: boolean;
}

const props = withDefaults(defineProps<ToolbarProps>(), { showModeChange: true });

interface ToolbarEvents {
  (e: 'zoom-changed', newZoomFactor: number, scrollViewerToCenter?: boolean): void;
  (e: 'mode-changed'): void;
}

const emit = defineEmits<ToolbarEvents>();
// ------------------------------------------------------------------------------------------------------------------------

const show = ref(false);
const code = ref('');
const route = useRoute();
const handlePositiveClick = () => {
  var clipboard = new Clipboard('#copy');
  clipboard.on('success', (e) => {
    console.log('复制成功');
    clipboard.destroy();
  });
  clipboard.on('error', (e) => {
    console.log('该浏览器不支持自动复制');
    clipboard.destroy();
  });
};
function zoomReset() {
  const oldZoom = props.zoomManager.getZoomFactor();
  const newZoom = props.zoomManager.zoomReset();
  if (oldZoom !== newZoom) emit('zoom-changed', newZoom, true);
}

function zoomSet(zoomFactor: number) {
  const oldZoom = props.zoomManager.getZoomFactor();
  const newZoom = props.zoomManager.zoomSet(zoomFactor);
  if (oldZoom !== zoomFactor) emit('zoom-changed', newZoom, false);
}

function zoomIn() {
  const oldZoom = props.zoomManager.getZoomFactor();
  const newZoom = props.zoomManager.zoomIn();
  if (oldZoom !== newZoom) emit('zoom-changed', newZoom, false);
}

function zoomOut() {
  const oldZoom = props.zoomManager.getZoomFactor();
  const newZoom = props.zoomManager.zoomOut();
  if (oldZoom !== newZoom) emit('zoom-changed', newZoom, false);
}

function shareLink() {
  let currentFileID = route.params.protoID as string;
  getPrototypeShareCode({ fileID: parseInt(currentFileID) }).then((res) => {
    if (res.data.result == 0) {
      code.value = window.location.origin + '/prototype/' + currentFileID + '?shareCode=' + res.data.shareCode;
      show.value = true;
    }
  });
}

function closeLink() {
  let currentFileID = route.params.protoID as string;
  closeSharePrototype({ fileID: parseInt(currentFileID) }).then((res) => {
    window.$message.info('已关闭所有分享链接');
  });
  syncManager.sendMessage(OperationType.CLOSE_SHARE, { teamID: currentFileID });
}
defineExpose({ zoomReset, zoomSet });
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

.mode-info:hover {
  background-color: #efefef;
}
.zoom-info {
  width: 40px;
  font-size: 12px;
  text-align: center;
}
</style>
