<template>
  <EditorIcon
    v-if="getObjectValue(object, property.name) === true"
    class="checker"
    @click="toggle"
    icon="check_box"
    color="#4af"
  />
  <EditorIcon v-else icon="check_box_outline_blank" class="checker" @click="toggle" color="#ddd" />
</template>

<script setup lang="ts">
import { ObjectProperty } from '../types';
import { getObjectValue, setObjectValue } from './utils';

// The component props and events
// ------------------------------------------------------------------------------------------------------------------------
export interface NumberEditorProps {
  object?: any;
  property: ObjectProperty;
}

export interface NumberEditorEvents {
  (e: 'property-changed', property: ObjectProperty, newValue: any): void;
}

// Define props
const { object, property } = defineProps<NumberEditorProps>();

// Define events
const emit = defineEmits<NumberEditorEvents>();
// ------------------------------------------------------------------------------------------------------------------------

function toggle(e: any) {
  let v = object[property.name] === true;

  setObjectValue(object, property.name, !v);
  emit('property-changed', property, v);
}
</script>

<style scoped>
.checker {
  cursor: pointer;
}
</style>
