<template>
  <div class="section-container">
    <div class="section-title" @click="expanded = !expanded">
      <EditorIcon v-show="expanded" size="16px" icon="keyboard_arrow_down" />
      <EditorIcon v-show="!expanded" size="16px" icon="keyboard_arrow_right" />
      {{ section.title }}
    </div>
    <ObjectInspectorProperty
      v-if="expanded"
      v-for="property in section.properties"
      :key="property.name"
      :property="property"
      :object="object"
      @property-changed="(propertyChanged, newValue) => emit('property-changed', propertyChanged, newValue)"
    />
  </div>
</template>

<script setup lang="ts">
import { onUpdated, ref } from 'vue';
import ObjectInspectorProperty from './ObjectInspectorProperty.vue';
import { InspectorSection, ObjectProperty } from './types';

// The component props and events
// ------------------------------------------------------------------------------------------------------------------------
export interface ObjectInspectorSectionProps {
  object?: any;
  section: InspectorSection;
}

export interface ObjectInspectorSectionvents {
  (e: 'property-changed', property: ObjectProperty, newValue: any): void;
}

// Define props
const { object, section } = defineProps<ObjectInspectorSectionProps>();

// Define events
const emit = defineEmits<ObjectInspectorSectionvents>();
// ------------------------------------------------------------------------------------------------------------------------

onUpdated(() => {
  console.log('ObjectInspectorSection: onUpdated');
});

const expanded = ref(true);
</script>

<style scoped>
.section-container {
  width: 100%;
  height: auto;
  margin-bottom: 12px;
  user-select: none;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 4px;
  user-select: none;
  background-color: #515151;
  color: #dbdbdb;
  text-align: left;
  padding: 4px;
  cursor: pointer;
  margin-bottom: 4px;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
}
</style>
