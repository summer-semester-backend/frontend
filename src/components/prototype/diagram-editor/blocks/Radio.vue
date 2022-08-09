<template>
  <div class="radio" @click.stop="handleLinkClick">
    <n-radio class="radio-center" :checked="item.checked" name="basic-demo" :disabled="item.disabled">
      {{ item.value }}
    </n-radio>
  </div>
</template>
<script setup lang="ts">
import { RadioItem } from '../types';

const { item } = defineProps<{ item: RadioItem }>();
interface LinkClickEvents {
  (e: 'link-to-click', itemID: string): void;
}
const emits = defineEmits<LinkClickEvents>();
const handleLinkClick = () => {
  if (item.connection != undefined) {
    emits('link-to-click', item.connection.to.item);
  }
};
// const handleChange = () => {
//   if (item.checked === true) {
//     item.checked = false;
//   }
//   if (item.checked === false) {
//     item.checked = true;
//   }
// };
</script>

<style scoped>
.radio {
  display: flex;
  width: 100%;
  height: 100%;
  max-width: 100%;
}
.radio-center {
  width: 90%;
  height: 80%;
  margin: auto;
}
</style>
