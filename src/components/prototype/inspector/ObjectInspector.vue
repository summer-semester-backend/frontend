<template>
  <div class="object-inspector">
    <div class="inspector-title" @click="expanded = !expanded" style="cursor: pointer">
      <n-text>查看器</n-text>
      <div style="flex-grow: 1; pointer-events: none"></div>
      <div>
        <EditorIcon v-show="expanded" size="16px" icon="keyboard_arrow_down" color="white" />
        <EditorIcon v-show="!expanded" size="16px" icon="keyboard_arrow_right" color="white" />
      </div>
    </div>
    <div v-if="expanded && (object === null || object === undefined)">
      <div style="color: #aaa; font-size: 12px; text-align: center; margin-bottom: 8px; font-style: italic">
        暂无选择的物体
      </div>
    </div>
    <template v-else>
      <div v-if="schema !== null" v-show="expanded" class="tab-container">
        <ObjectInspectorTab
          v-for="(tab, index) in schema.tabs"
          :key="tab.title"
          :tab="tab"
          :object="object"
          :selected="currentTab > schema.tabs.length - 1 ? index === 0 : index === currentTab"
          @click="currentTab = index"
        />
      </div>

      <ObjectInspectorSection
        v-if="schema !== null"
        v-show="expanded"
        v-for="(section, index) in schema.tabs[currentTab > schema.tabs.length - 1 ? 0 : currentTab].sections"
        :key="section.name"
        :section="section"
        :object="object"
        @property-changed="(changedProperty, newValue) => emit('property-changed', changedProperty, newValue)"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onUpdated, ref } from 'vue';
import { registerPredefinedEditors } from './helpers';
import ObjectInspectorSection from './ObjectInspectorSection.vue';
import ObjectInspectorTab from './ObjectInspectorTab.vue';
import { ObjectInspectorModel, ObjectProperty } from './types';

// The component props and events
// ------------------------------------------------------------------------------------------------------------------------
export interface ObjectInspectorProps {
  object?: any;
  schema: ObjectInspectorModel | null;
}

export interface ObjectInspectorEvents {
  (e: 'drag', event: any): void;
  (e: 'property-changed', property: ObjectProperty, newValue: any): void;
}

// Define props
const { schema } = defineProps<ObjectInspectorProps>();

// Define events
const emit = defineEmits<ObjectInspectorEvents>();
// ------------------------------------------------------------------------------------------------------------------------

onBeforeMount(() => {
  console.log('ObjectInspector.vue: onBeforeMount');
  registerPredefinedEditors();
});

onUpdated(() => {
  console.log('ObjectInspector.vue: onUpdated');
});

const expanded = ref(true);
const currentTab = ref(0);
// const selectedTab = computed(() => {
//     if(!schema) return 0;

//     console.log('ObjectInspector.vue: selectedTab', currentTab.value, schema.tabs.length);
//     return currentTab.value > schema.tabs.length - 1 ? 0 : currentTab.value;
// })

function getTabSections() {
  console.log('ObjectInspector.vue: getTabSections', schema, currentTab.value);

  if (!schema) return [];
  if (currentTab.value > schema.tabs.length - 1) currentTab.value = 0;
  return schema.tabs[currentTab.value].sections;
}
</script>

<style scoped>
.object-inspector {
  width: 100%;
  height: 100%;
  max-height: 100%;

  background-color: #494949;

  overflow-x: hidden;
  overflow-y: auto;
}

.object-inspector::-webkit-scrollbar {
  width: 12px; /* width of the entire scrollbar */
}
.object-inspector::-webkit-scrollbar-track {
  background: rgb(174, 174, 174); /* color of the tracking area */
}
.object-inspector::-webkit-scrollbar-thumb {
  background-color: #717171; /* color of the scroll thumb */
  border-radius: 20px; /* roundness of the scroll thumb */
  border: 3px solid rgb(174, 174, 174); /* creates padding around scroll thumb */
}

.inspector-title {
  display: flex;
  color: #ddd;
  padding: 8px 8px 2px 8px;
  text-align: center;
  font-size: 15px;
  line-height: 2;
  letter-spacing: 1px;
}

.tab-container {
  letter-spacing: 2px;
  display: flex;
  gap: 4px;
  margin-left: 8px;
}
</style>
