<template>
  <div class="input">
    <n-input
      class="input-center"
      :placeholder="item.placeholder"
      :disabled="item.disabled"
      :type="item.inputType"
      :status="item.status"
      :round="item.round"
      v-model:value="item.value"
      @click.stop="handleLinkClick"
    >
    </n-input>
  </div>
</template>
<script setup lang="ts">
import { InputItem } from '../types';

const { item } = defineProps<{ item: InputItem }>();
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
.input {
  display: flex;
  width: 100%;
  height: 100%;
  max-width: 100%;
}
.input-center {
  width: 90%;
  height: 80%;
  margin: auto;
}
</style>
