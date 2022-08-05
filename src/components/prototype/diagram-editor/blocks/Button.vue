<template>
  <div class="button">
    <n-button
      :disabled="item.disabled"
      :bordered="item.bordered"
      :circle="item.circle"
      :type="item.type"
      :color="item.color"
      class="button-center"
    >
      {{ item.value }}
    </n-button>
  </div>
</template>
<script setup lang="ts">
import { ButtonItem } from '../types';

const { item } = defineProps<{ item: ButtonItem }>();
</script>

<style scoped>
.button {
  display: flex;
  width: 100%;
  height: 100%;
  max-width: 100%;
}
.button-center {
  width: 90%;
  height: 80%;
  margin: auto;
}
</style>
