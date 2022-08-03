<template>
  <div ref="area">
    <Vue3DraggableResizable :init-h="1000" :init-w="1000" :draggable="true" :resizable="true">
      <Vue3DraggableResizable @touchstart.stop="" @mousedown.stop="" :draggable="true" :resizable="true">
        <login-page />
      </Vue3DraggableResizable>
      <Vue3DraggableResizable @touchstart.stop="" @mousedown.stop="" :draggable="true" :resizable="true">
        <n-button class="h-full w-full">hello2</n-button>
      </Vue3DraggableResizable>
    </Vue3DraggableResizable>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Vue3DraggableResizable from 'vue3-draggable-resizable';
import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css';
import LoginPage from '../../views/login/LoginPage.vue';
function print(val: string) {
  console.log(val);
}
const stopPropergation = (e: Event) => {
  e.stopPropagation();
};
</script>
<style>
.parent {
  width: 200px;
  height: 200px;
  position: absolute;
  top: 100px;
  left: 100px;
  border: 1px solid #000;
  user-select: none;
}
</style>
