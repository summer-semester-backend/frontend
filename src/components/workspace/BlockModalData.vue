<template>
  <!-- 块状格式 -->
  <n-grid :x-gap="30" :y-gap="18" :cols="6" style="width: 85%">
    <n-grid-item
      v-for="(item, index) in files.slice(
        (paginationBlock.current - 1) * paginationBlock.pageSize,
        paginationBlock.current * paginationBlock.pageSize
      )"
      :key="index"
    >
      <n-popover trigger="hover" :show-arrow="false">
        <span>进入编辑器</span>
        <template #trigger>
          <n-card
            :segmented="{
              content: true,
              footer: true,
            }"
            footer-style="padding: 0.2vw 0;"
            hoverable
            @click="emit('handleClickOpen', item)"
          >
            <template #cover>
              <div v-if="editButtonRef" style="position: absolute; top: 5px; right: 5px">
                <n-space>
                  <n-button
                    circle
                    ghost
                    type="error"
                    size="small"
                    color="rgba(208, 48, 80,0.85)"
                    @click.stop="emit('handleClickDelete', item)"
                  >
                    <n-icon size="20"><Trash /></n-icon>
                  </n-button>
                  <!-- <n-space vertical> -->
                  <n-button
                    circle
                    ghost
                    type="warning"
                    size="small"
                    color="rgba(240, 160, 32,0.85)"
                    @click.stop="emit('handleClickEdit', item)"
                  >
                    <n-icon size="20"><Create /></n-icon>
                  </n-button>
                  <n-button
                    circle
                    ghost
                    type="info"
                    size="small"
                    color="rgba(32, 128, 240,0.85)"
                    @click.stop="emit('handleClickCopy', item)"
                  >
                    <n-icon size="20"><Copy /></n-icon>
                  </n-button>
                  <!-- </n-space> -->
                </n-space>
              </div>

              <n-image
                v-if="fileType == 13"
                style="border-radius: 8px; height: 8vw; width: 100%"
                :src="item.fileImage"
                object-fit="cover"
                preview-disabled
              ></n-image>
              <div
                v-if="fileType == 12"
                class="imgBox"
                v-html="item.fileImage"
                style="padding: 10px; border-radius: 8px; height: 8vw; width: 100%"
              ></div>
            </template>
            <template #footer>
              <n-space>
                <n-icon size="20" style="padding-left: 15px; padding-top: 3px">
                  <slot name="icon"></slot>
                </n-icon>
                <n-ellipsis
                  :tooltip="true"
                  style="background-color: #fff; font-size: 14px; font-weight: 500; margin: 0 16px; max-width: 5vw"
                >
                  {{ item.fileName }}
                  <template #tooltip>
                    <div style="font-family: 'Mulish'">File：{{ item.fileName }}</div>
                  </template>
                </n-ellipsis>
              </n-space>
            </template>
          </n-card>
        </template>
      </n-popover>
    </n-grid-item>

    <!-- 最后一块 -->
    <n-grid-item>
      <n-card
        :segmented="{
          content: true,
          footer: true,
        }"
        footer-style="padding: 0.2vw ;"
        hoverable
        id="lastBlock"
        style="border: 1px dashed #b2b3b3"
        @click="emit('openModel')"
        v-if="parseInt((files.length / paginationBlock.pageSize + 1).toString()) == paginationBlock.current"
      >
        <template #cover>
          <div style="padding: 10px; border-radius: 8px 8px 0 0; height: 8vw; width: 100%">
            <n-space justify="center">
              <n-icon style="margin-top: 2vw" size="70">
                <add />
              </n-icon>
            </n-space>
          </div>
        </template>
        <template #footer>
          <n-space justify="center">
            <n-ellipsis style="background-color: #fff; font-size: 1rem; font-weight: 700; margin: 0 24px"
              >新建空白</n-ellipsis
            >
          </n-space>
        </template>
      </n-card>
    </n-grid-item>
  </n-grid>

  <!-- 分页 -->
  <n-grid :cols="3" style="width: 85%; margin-top: 20px">
    <n-gi></n-gi>
    <n-gi
      ><n-pagination
        style="justify-content: center"
        size="large"
        v-model:page="paginationBlock.current"
        :page-count="parseInt((files.length / paginationBlock.pageSize + 1).toString())"
    /></n-gi>
    <n-gi></n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { NButton, NIcon, NSpace, useDialog } from 'naive-ui';
import { h, ref, computed, onMounted } from 'vue';
import { Add, AddCircleOutline, Trash, ArrowRedo, Create, GridOutline, List, Copy } from '@vicons/ionicons5';

interface File {
  fileID: number;
  fileName: string;
  userName: string;
  lastEditTime: string;
  fileImage: string;
}

const emit = defineEmits(['handleClickOpen', 'handleClickDelete', 'handleClickEdit', 'handleClickCopy', 'openModel']);

const props = defineProps<{
  files: File[];
  paginationBlock: { current: number; pageSize: number };
  editButtonRef: boolean;
  fileType: number;
}>();
</script>

<style scoped>
.n-card {
  border-radius: 7px;
  border: 1px solid #b2b3b3;
  box-sizing: content-box;
  cursor: pointer;
}
.n-card:hover {
  transition: 0.2s;
  box-shadow: 0px 0px 5px 3px rgb(217, 217, 217);
  transform: scale(1.03);
}
</style>

<style>
svg {
  height: 100%;
  width: 100%;
}
</style>
