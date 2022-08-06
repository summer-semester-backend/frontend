<template>
  <file-header :file-i-d="fileID"> </file-header>
  <AmEditor></AmEditor>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router';
import { onMounted, ref } from '@vue/runtime-core';
const route = useRoute();
const fileID = ref<number | null>(null);
onMounted(() => {
  fileID.value = parseInt(route.params.id.toString());
});
</script>
