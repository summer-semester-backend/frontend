<template>
  <div
    class="material-symbols-outlined"
    :style="{
      color: item.textColor,
      fontSize: item.h + 'px',
      borderRadius: item.borderRadius + 'px',
      opacity: item.opacity / 100,
      textShadow: item.shadow ? '3px 3px 5px #aaa' : 'none',
    }"
    @click.stop="handleLinkClick"
  >
    {{ item.title }}
  </div>
</template>

<script setup lang="ts">
import { Item } from '../types';

const { item } = defineProps<{ item: Item }>();
interface LinkClickEvents {
  (e: 'link-to-click', itemID: string): void;
}
const emits = defineEmits<LinkClickEvents>();
const handleLinkClick = () => {
  if (item.connection != undefined) {
    emits('link-to-click', item.connection.to.item);
  }
};
</script>

<style scoped>
.shape {
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 8px;
}
.shape div.diagram-item-inline-edit {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
  padding: 0px;
}
</style>
