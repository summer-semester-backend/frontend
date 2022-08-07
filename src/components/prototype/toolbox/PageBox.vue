<template>
  <div class="pagebox">
    <div class="pagebox-title" @click="expanded = !expanded" style="cursor: pointer">
      <n-text class="text-light-50">页面</n-text>
      <div style="flex-grow: 1; pointer-events: none"></div>
      <div>
        <EditorIcon v-show="expanded" size="16px" icon="keyboard_arrow_down" color="white" />
        <EditorIcon v-show="!expanded" size="16px" icon="keyboard_arrow_right" color="white" />
      </div>
    </div>
    <div class="pagebox-content">
      <n-card v-if="expanded" :bordered="false" class="card">
        <n-menu :options="pageOptions" class="w-full" @update-value="handleUpdateValue" v-model:value="page"></n-menu>
        <n-button class="w-full" @click="emits('page-create', newPageName)">
          <template #icon>
            <n-icon><Add /></n-icon>
          </template>
        </n-button>
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { darkTheme, MenuOption } from 'naive-ui';
import { Add } from '@vicons/ionicons5';
import { PageItem } from '../diagram-editor/types';
interface PageBoxEvents {
  (e: 'page-selected', pageItem: PageItem): void;
  (e: 'page-create', pageName: string): void;
}
const props = defineProps<{ pages: Array<PageItem>; selectedPage: string }>();
const pageOptions = ref<Array<{ key: string; label: string }>>([]);
const pagesMap = new Map<string, PageItem>();
const page = ref('');
const newPageName = computed(() => '页面' + (pageOptions.value.length + 1));
const expanded = ref(true);
const emits = defineEmits<PageBoxEvents>();
const handleUpdateValue = (key: string, option: MenuOption) => {
  var selectedPage = pagesMap.get(key);
  if (selectedPage !== undefined) {
    emits('page-selected', selectedPage);
  }
};
watch(
  () => props.pages,
  (newPage: Array<PageItem>) => {
    pagesMap.clear();
    pageOptions.value = newPage.map((ele) => {
      pagesMap.set(ele.id, ele);
      return {
        key: ele.id,
        label: ele.pageName,
      };
    });
  },
  {
    immediate: true,
    deep: true,
  }
);

watch(
  () => props.selectedPage,
  (selectedPage: string) => {
    page.value = selectedPage;
  }
);
</script>

<style scoped>
.pagebox {
  display: block;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}

.grid-item {
  width: 100%;
  height: 90px;
}

.pagebox::-webkit-scrollbar {
  width: 12px; /* width of the entire scrollbar */
}
.pagebox::-webkit-scrollbar-track {
  background: rgb(58, 58, 58); /* color of the tracking area */
}
.pagebox::-webkit-scrollbar-thumb {
  background-color: gray; /* color of the scroll thumb */
  border-radius: 20px; /* roundness of the scroll thumb */
  border: 3px; /* creates padding around scroll thumb */
}

.pagebox-title {
  display: flex;
  color: #ddd;
  padding: 8px 8px 2px 8px;
  text-align: center;
  font-size: 15px;
  line-height: 2;
  letter-spacing: 1px;
}

.pagebox-container {
  letter-spacing: 2px;
  display: flex;
  gap: 4px;
  margin-left: 8px;
}
</style>
