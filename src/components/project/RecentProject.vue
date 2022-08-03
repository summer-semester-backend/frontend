<template>
  <div id="recent-content">
    <n-text>最近</n-text>
    <div id="recent-box">
      <n-grid x-gap="30" :cols="6">
        <n-gi v-for="(item, index) in projects" :key="index">
          <n-card
            :segmented="{
              content: true,
              footer: 'soft',
            }"
            footer-style="padding: 0.5vw 0;"
            hoverable
          >
            <template #cover>
              <n-image style="border-radius: 8px 8px 0 0" :src="item.url" object-fit="cover" preview-disabled></n-image>
            </template>
            <template #footer>
              <n-ellipsis style="background-color: #fff; font-size: 1rem; font-weight: 400">
                {{ item.name }}
              </n-ellipsis>
            </template>
          </n-card>
        </n-gi>
      </n-grid>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
const projects = ref([
  {
    name: 'project1project1project1project1',
    description: 'description1',
    url: '/resource/image/project1.jpeg',
  },
  {
    name: 'project1',
    description: 'description1',
    url: '/resource/image/project1.jpeg',
  },
  {
    name: 'project1',
    description: 'description1',
    url: '/resource/image/project1.jpeg',
  },
  {
    name: 'project1',
    description: 'description1',
    url: '/resource/image/project1.jpeg',
  },
  {
    name: 'project1',
    description: 'description1',
    url: '/resource/image/project1.jpeg',
  },
  {
    name: 'project1',
    description: 'description1',
    url: '/resource/image/project1.jpeg',
  },
]);
</script>

<style scoped lang="less">
#recent-content {
  background: #f5f5f5;
  padding: 30px 60px 30px 60px;
  .n-text {
    font-size: 24px;
    font-weight: bold;
  }
  #recent-box {
    margin-top: 20px;
    .n-card {
      height: 10vw;
      border-radius: 10px;
      border: 2px solid rgba(0, 0, 0, 0.3);
      overflow: hidden;
      box-sizing: content-box;
    }
    .n-card:hover {
      cursor: pointer;
    }
  }
}
</style>
