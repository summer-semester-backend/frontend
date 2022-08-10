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
        <n-scrollbar style="max-height: 200px">
          <n-menu :options="pageOptions" class="w-full" @update-value="handleUpdateValue" v-model:value="page"></n-menu>
          <n-button-group v-if="editable" class="w-full ml-2 my-1 h-10">
            <n-button class="w-5/7 h-full" @click="emits('page-create', newPageName, currentResolution)">
              <template #icon>
                <n-icon><Add /></n-icon>
              </template>
              {{ currentResolution }}
            </n-button>
            <n-button class="w-22/100 h-full">
              <n-dropdown trigger="click" :options="resolutionOptions" @select="handleSelectResolution">
                <n-icon><ChevronDownOutline /></n-icon>
              </n-dropdown>
            </n-button>
          </n-button-group>
        </n-scrollbar>
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Component, computed, ref, watch, h } from 'vue';
import { MenuOption, NIcon } from 'naive-ui';
import { Add, ChevronDownOutline, PhonePortraitOutline, TabletPortraitOutline, LaptopOutline } from '@vicons/ionicons5';
import { PageItem } from '../diagram-editor/types';
interface PageBoxEvents {
  (e: 'page-selected', pageItem: PageItem): void;
  (e: 'page-create', pageName: string, pageResolution: string): void;
}
const props = defineProps<{ pages: Array<PageItem>; selectedPage: string; editable: boolean }>();
const pageOptions = ref<Array<{ key: string; label: string }>>([]);
const renderIcon = (icon: Component) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon),
    });
  };
};
const currentResolution = ref('1080x720');
const resolutionOptions = [
  {
    label: '电脑',
    key: 'key',
    icon: renderIcon(LaptopOutline),
    children: [
      {
        label: '1920x1080 px',
        key: '1920x1080',
      },
      {
        label: '1440x900 px',
        key: '1440x900',
      },
      {
        label: '1280x800 px',
        key: '1280x800',
      },
      {
        label: '1080x720 px',
        key: '1080x720',
      },
      {
        label: '1024x768 px',
        key: '1024x768',
      },
    ],
  },
  {
    label: '手机',
    key: 'phone',
    icon: renderIcon(PhonePortraitOutline),
    children: [
      {
        label: '428x926 px',
        key: '428x926',
      },
      {
        label: '414x896 px',
        key: '414x896',
      },
      {
        label: '390x844 px',
        key: '390x844',
      },
      {
        label: '375x812 px',
        key: '375x812',
      },
    ],
  },
  {
    label: '平板',
    key: 'tablet',
    icon: renderIcon(TabletPortraitOutline),
    children: [
      {
        label: '1024x1366 px',
        key: '1024x1366',
      },
      {
        label: '834x1112 px',
        key: '834x1112',
      },
      {
        label: '834x1194 px',
        key: '834x1194',
      },
      {
        label: '768x1024 px',
        key: '768x1024',
      },
    ],
  },
];
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
const handleSelectResolution = (key: string) => {
  currentResolution.value = key;
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
