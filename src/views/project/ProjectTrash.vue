<template>
  <ProjectBar id="projectBar"></ProjectBar>

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
import { h, ref, computed, onMounted } from 'vue';
import { Refresh, Trash, Search, EllipsisHorizontal } from '@vicons/ionicons5';
import { trashProjectList, recoverProject, deleteProject, clearBin } from '@/api/project';
type Project = {
  projectID: number;
  projectName: string;
  teamName: string;
  abandonTime: string;
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
    key: 'projectName',
    sorter: (row1: Project, row2: Project) => (row1.projectName > row2.projectName ? 1 : -1),
  },
  {
    title: '所属团队',
    key: 'teamName',
    sorter: (row1: Project, row2: Project) => (row1.teamName > row2.teamName ? 1 : -1),
  },
  {
    title: '删除时间',
    key: 'abandonTime',
    sorter: (row1: Project, row2: Project) => (row1.abandonTime > row2.abandonTime ? 1 : -1),
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
              recoverProject({ projectID: row.projectID }).then((res) => {
                if (res.data.result == 0) {
                  window.$message.success(res.data.message);
                  getProjectList();
                } else if (res.data.result == 1) {
                  window.$message.warning(res.data.message);
                } else if (res.data.result == 2) {
                  window.$message.error(res.data.message);
                }
              });
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
              deleteProject({ projectID: row.projectID }).then((res) => {
                if (res.data.result == 0) {
                  window.$message.success(res.data.message);
                  getProjectList();
                } else if (res.data.result == 1) {
                  window.$message.warning(res.data.message);
                } else if (res.data.result == 2) {
                  window.$message.error(res.data.message);
                }
              });
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
    projectID: 1,
    projectName: '项目1',
    teamName: '团队1',
    abandonTime: '2022-8-3',
  },
  {
    projectID: 2,
    projectName: '项目2',
    teamName: '团队2',
    abandonTime: '2022-8-2',
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
    clearBin().then((res) => {
      if (res.data.result == 0) {
        window.$message.success(res.data.message);
        getProjectList();
      } else if (res.data.result == 1) {
        window.$message.warning(res.data.message);
      } else if (res.data.result == 2) {
        window.$message.error(res.data.message);
      }
    });
  }
};

const getProjectList = () => {
  trashProjectList()
    .then((res) => {
      trashs.value = res.data.list;
    })
    .catch((err) => {
      console.log(err);
    });
};
onMounted(() => {
  getProjectList();
});

//搜索
const dataFilter = computed(() => {
  return trashs.value.filter((data) => {
    return !input.value || data.projectName.toLowerCase().includes(input.value.toLowerCase());
  });
});
</script>
<style scope lang="less">
#projectBar
{
    float: left;
    height: 100%;
}

#content {
  padding: 40px 60px;
  position: relative;
}
</style>
