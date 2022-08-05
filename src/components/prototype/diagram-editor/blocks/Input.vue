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
    >
    </n-input>
  </div>
</template>
<script setup lang="ts">
import { InputItem } from '../types';

const { item } = defineProps<{ item: InputItem }>();
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
