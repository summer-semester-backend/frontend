<template>
  <div class="button">
    <n-button
      :bordered="item.bordered"
      :circle="item.circle"
      :type="item.isPrimary ? 'primary' : 'default'"
      :ghost="item.isPrimary ? false : true"
      :color="item.useColor ? item.color : undefined"
      class="button-center"
      @click.stop="handleLinkClick"
    >
      {{ item.value }}
    </n-button>
  </div>
</template>
<script setup lang="ts">
import { ButtonItem } from '../types';
interface LinkClickEvents {
  (e: 'link-to-click', itemID: string): void;
}
const emits = defineEmits<LinkClickEvents>();
const props = defineProps<{ item: ButtonItem }>();
const handleLinkClick = () => {
  if (props.item.connection != undefined) {
    emits('link-to-click', props.item.connection.to.item);
  }
};
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
