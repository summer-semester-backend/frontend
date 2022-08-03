<template>
  <div id="content">
    <Header title="回收站">
      <template #toolbar>
        <n-button v-if="!isInputShow" @click="showInput" quaternary circle>
          <template #icon>
            <n-icon size="18" color="rgb(100,100,100)"><search /></n-icon>
          </template>
        </n-button>
        <n-input v-model:value="input" v-else round placeholder="搜索名称" @blur="hideInput" style="width: 200px">
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
      </template>
      <template #content>
        <n-data-table :columns="columns" :data="dataFilter" :pagination="pagination" :bordered="false" />
      </template>
    </Header>
  </div>
</template>
<script setup lang="ts">
import { NButton, NIcon, NSpace } from 'naive-ui';
import { h, ref, computed } from 'vue';
import { Refresh, Trash, Search, EllipsisHorizontal } from '@vicons/ionicons5';
type Project = {
  id: number;
  name: string;
  team: string;
};

const isInputShow = ref(false); //是否显示搜索框
const input = ref(''); //搜索关键字
const options = ref([
  {
    label: '清空回收站',
    key: 'delete',
  },
]);
const columns = ref([
  {
    title: '项目名称',
    key: 'name',
    sorter: (row1: Project, row2: Project) => (row1.name > row2.name ? 1 : -1),
  },
  {
    title: '所属团队',
    key: 'team',
    sorter: (row1: Project, row2: Project) => (row1.team > row2.team ? 1 : -1),
  },
  {
    title: '操作',
    key: 'actions',
    render(row: Project) {
      return h(NSpace, [
        h(
          NButton,
          {
            type: 'primary',
            size: 'small',
            strong: true,
            secondary: true,
            onClick(e) {
              console.log(row);
            },
          },
          {
            default: '恢复',
            icon: h(NIcon, { component: Refresh }),
          }
        ),
        h(
          NButton,
          {
            type: 'error',
            size: 'small',
            strong: true,
            secondary: true,
            onClick(e) {
              console.log(row);
            },
          },
          {
            default: '删除',
            icon: h(NIcon, { component: Trash }),
          }
        ),
      ]);
    },
  },
]);
const trashs = ref([
  {
    name: '123',
    team: '123',
  },
  {
    name: '456',
    team: '456',
  },
]);
const pagination = ref({
  current: 1,
  pageSize: 10,
});

//显示搜索
const showInput = () => {
  isInputShow.value = true;
};
//隐藏搜索
const hideInput = () => {
  isInputShow.value = false;
};
//选择操作
const handleSelect = (key: string | number) => {
  console.log(key);
  if (key === 'delete') {
    console.log('delete');
  }
};

//搜索
const dataFilter = computed(() => {
  return trashs.value.filter((data) => {
    return !input.value || data.name.toLowerCase().includes(input.value.toLowerCase());
  });
});
</script>
<style scope lang="less">
#content {
  padding: 40px 60px;
  position: relative;
}
</style>
