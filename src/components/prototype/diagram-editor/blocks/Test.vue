<template>
  <div>123</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Item } from '../types';

const { item } = defineProps<{ item: Item }>();
</script>

<style scoped>
.star-container {
  position: relative;
  width: 100%;
  height: 100%;
}
.star {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;

  overflow: visible;
}

.star-text {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
