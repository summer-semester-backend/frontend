<template>
  <div class="container">
    <div class="title">键盘快捷键</div>
    <div class="key" v-for="k in shortcuts" :style="{ 'margin-bottom': k[0] === '' ? '16px' : '2px' }">
      <div class="key-shortcut">{{ k[0] }}</div>
      <div class="key-help">{{ k[1] }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const shortcuts = [
  ['CMD+C', '复制选中实体'],
  ['CMD+X', '剪切选中实体'],
  ['CMD+V', '粘贴'],
  ['', ''],
  ['CMD+Z', '撤销'],
  ['SHIFT+CMD+Z', '重做'],
  ['', ''],
  ['S', 'Selection tool'],
  ['C', 'Connection tool'],
  ['T', 'Text tool'],
  ['R', 'Rectangle tool'],
  ['I', 'Show / Hide inspector'],
  ['K', 'Show / Hide keyboard shortcuts'],
  ['', ''],
  ['Backspace / Delete', 'Delete selected item / connection'],
  ['Arrows', 'Move selected item by 1 pixel'],
  ['SHIFT+Arrows', 'Move selected item by 10 pixels'],
  ['', ''],
  ['SHIFT', 'While resizing keep the aspect ratio. In rotation will rotate by 45 deg'],
  ['ESC', 'Cancel operation during connection creation'],
  ['SHIFT+Mouse drag', '拖动画板'],
  ['CTRL+Mouse wheel', 'Zoom in / out'],
  ['Double Click', 'Edit item text'],
];

// Replace 'CMD' with 'CTRL' is user is using not a Mac
const isMac = navigator.userAgent.toLowerCase().includes('macintosh');
if (!isMac) for (let k of shortcuts) k[0] = k[0].replace('CMD', 'CTRL');
</script>

<style scoped>
.container {
  background-color: #18181c;

  color: #18181c;
  width: 700px;
  height: auto;
  max-height: 80%;
  padding: 16px 24px;
  box-shadow: 3px 3px 5px #bbb;
  overflow-x: hidden;
  overflow-y: auto;
}

.title {
  text-align: center;
  text-transform: uppercase;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #4af;
}

.key {
  margin-bottom: 8px;
  display: flex;
  align-items: flex-start;
  font-size: 16px;
  padding-bottom: 2px;
  color: #ddd;
}

.key-shortcut {
  min-width: 200px;
  font-family: 'Courier New', Courier, monospace;
  font-size: 16px;
  color: #ccc;
}

.key-help {
  flex-grow: 1;
}
</style>
