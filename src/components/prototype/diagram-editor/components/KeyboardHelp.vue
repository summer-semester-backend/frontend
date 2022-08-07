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
  ['S', '选中'],
  ['C', '连接'],
  // ['I', 'Show / Hide inspector'],
  ['K', '显示 / 收起 快捷键提示面板'],
  ['', ''],
  ['Backspace / Delete', '删除选中实体/连接'],
  ['方向键', '按1px移动物体'],
  ['SHIFT+方向键', '按10px移动物体'],
  ['', ''],
  ['SHIFT', '调整大小时，保持纵横比，旋转时将旋转45度'],
  ['ESC', '在连接创建期间取消操作'],
  ['SHIFT+拖动鼠标', '拖动画板'],
  ['CTRL+滚动鼠标滚轮', '放大/缩小'],
  ['左键双击', '编辑实体文字'],
];

// Replace 'CMD' with 'CTRL' is user is using not a Mac
const isMac = navigator.userAgent.toLowerCase().includes('macintosh');
if (!isMac) for (let k of shortcuts) k[0] = k[0].replace('CMD', 'CTRL');
</script>

<style scoped>
.container {
  background-color: #333333;

  color: #333333;
  width: 700px;
  height: auto;
  max-height: 80%;
  padding: 16px 24px;
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
