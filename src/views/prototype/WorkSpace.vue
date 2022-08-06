<template>
  <div style="width: 100%; height: 100%; margin: 0 auto">
    <DiagramEditor :elements="elements" :customWidgets="true" :editable="true" />
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import DiagramEditor from '@/components/prototype/diagram-editor/DiagramEditor.vue';
import { type DiagramElement } from '@/components/prototype/diagram-editor/types';

const elements = ref<DiagramElement[]>([]);

onBeforeMount(() => {
  let string = localStorage.getItem('proto') as string;
  if (string != null) {
    elements.value = JSON.parse(string) as DiagramElement[];
  } else {
    elements.value = [
      // createPageItem()
    ];
  }
});
</script>
