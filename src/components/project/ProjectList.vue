<template>
  <div id="my-content">
    <n-el tag="div" id="toolbar" style="position: absolute; right: 60px; top: 35px; z-index: 2">
      <n-button v-if="!isInputShow" @click="showInput" quaternary circle>
        <template #icon>
          <n-icon size="18" color="rgb(100,100,100)"><search /></n-icon>
        </template>
      </n-button>
      <n-input
        v-model:value="input"
        v-else
        round
        placeholder="搜索名称"
        @blur="hideInput"
        :style="{ width: inputWidth }"
      >
        <template #suffix>
          <n-icon size="18" :component="Search" />
        </template>
      </n-input>
      <n-dropdown :options="options" @select="handleSelect">
        <n-button quaternary circle
          ><template #icon>
            <n-icon size="18" color="rgb(100,100,100)"><ellipsis-horizontal /></n-icon> </template
        ></n-button>
      </n-dropdown>
    </n-el>
    <n-tabs type="line" animated>
      <n-tab-pane name="project" :tab="title">
        <div id="my-box">
          <n-grid :x-gap="48" :y-gap="24" :cols="5">
            <n-gi v-for="(item, index) in dataFilter.slice((page - 1) * pageSize, page * pageSize)" :key="index">
              <n-card
                :segmented="{
                  content: true,
                  footer: 'soft',
                }"
                footer-style="padding: 0.5vw 0;"
                hoverable
              >
                <template #cover>
                  <div v-if="isDelete" style="position: absolute; top: 5px; right: 5px">
                    <n-button text type="error" size="small"
                      ><n-icon size="20" color="red" @click.stop=""><trash-outline /></n-icon
                    ></n-button>
                  </div>
                  <n-image
                    style="border-radius: 8px 8px 0 0"
                    :src="item.url"
                    object-fit="cover"
                    preview-disabled
                  ></n-image>
                </template>
                <template #footer>
                  <n-ellipsis style="background-color: #fff; font-size: 1rem; font-weight: 500">
                    {{ item.name }}
                  </n-ellipsis>
                </template>
              </n-card>
            </n-gi>
            <n-gi v-if="page == parseInt((dataFilter.length / pageSize + 1).toString())">
              <n-card
                :segmented="{
                  footer: 'soft',
                }"
                footer-style="padding: 0.5vw 0;"
                :embedded="isEmbedded"
                hoverable
              >
                <template #cover>
                  <n-icon style="margin: 10px 0 0 10px" size="40">
                    <add />
                  </n-icon>
                </template>
                <template></template>
                <template #footer>
                  <n-ellipsis style="background-color: #fff; font-size: 1rem; font-weight: 500"> 创建项目 </n-ellipsis>
                </template>
              </n-card>
            </n-gi>
          </n-grid>
        </div>
        <div style="margin-top: 15px">
          <n-grid :cols="3">
            <n-gi></n-gi>
            <n-gi
              ><n-pagination
                style="justify-content: center"
                v-model:page="page"
                size="large"
                :page-count="parseInt((dataFilter.length / pageSize + 1).toString())"
            /></n-gi>
            <n-gi></n-gi>
          </n-grid>
        </div>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, reactive, defineProps } from 'vue';
import type { InputInst } from 'naive-ui';
import { Add, Search, EllipsisHorizontal, TrashOutline } from '@vicons/ionicons5';

interface Project {
  id: number;
  name: string;
  url: string;
}
const {
  projects = [
    {
      id: 1,
      name: 'project1project1project1project1',
      url: '/resource/image/project1.jpeg',
    },
  ],
  teamId = -1,
} = defineProps<{
  projects?: Project[];
  teamId?: number;
}>();

const isEmbedded = ref(true); //卡片是否灰色
const inputWidth = ref('0');
const isInputShow = ref(false); //是否显示搜索框
const page = ref(1); //当前页
const pageSize = ref(10); //每页元素数
const isDelete = ref(false); //是否进入删除状态
const input = ref(''); //搜索关键字

const options = ref([
  {
    label: '按创建时间排序',
    key: 'sort',
  },
  {
    label: '删除',
    key: 'delete',
  },
]);
//显示搜索
const showInput = () => {
  isInputShow.value = true;
  inputWidth.value = '200px';
};
//隐藏搜索
const hideInput = () => {
  isInputShow.value = false;
  inputWidth.value = '0';
};

//选择操作
const handleSelect = (key: string | number) => {
  console.log(key);
  if (key === 'delete') {
    console.log('delete');
    isDelete.value = true;
    options.value[1] = {
      label: '取消删除',
      key: 'cancel',
    };
  } else if (key === 'sort') {
    console.log('sort');
  } else if (key === 'cancel') {
    console.log('delete');
    isDelete.value = false;
    options.value[1] = {
      label: '删除',
      key: 'delete',
    };
  }
};

//搜索
const dataFilter = computed(() => {
  return projects.filter((data) => {
    return !input.value || data.name.toLowerCase().includes(input.value.toLowerCase());
  });
});
const title = computed(() => {
  return teamId === -1 ? '我的项目' : '团队项目';
});
</script>
<style scoped lang="less">
#my-content {
  padding: 15px 60px 30px 60px;
  position: relative;
  .n-tabs {
    #my-box {
      padding-right: 10px;
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

  #toolbar {
    .n-input {
      transition: width 1s;
    }
  }
}
</style>
