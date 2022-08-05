<template>
  <div class="radio">
    <n-radio class="radio-center" :checked="item.checked" name="basic-demo" :disabled="item.disabled">
      {{ item.value }}
    </n-radio>
  </div>
</template>
<script setup lang="ts">
import { RadioItem } from '../types';

const { item } = defineProps<{ item: RadioItem }>();

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
