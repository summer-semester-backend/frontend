<template>
  <div id="my-content">
    <Header :title="teamId == null ? '我的项目' : '团队项目'">
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
        <n-dropdown :options="operates" @select="handleSelect">
          <n-button quaternary circle
            ><template #icon>
              <n-icon size="18" color="rgb(100,100,100)"><ellipsis-horizontal /></n-icon> </template
          ></n-button>
        </n-dropdown>
      </template>
      <template #content>
        <div id="my-box">
          <n-grid :x-gap="48" :y-gap="24" :cols="5">
            <n-gi v-for="(item, index) in dataFilter.slice((page - 1) * pageSize, page * pageSize)" :key="index">
              <n-tooltip :delay="500" placement="bottom-start">
                <template #trigger>
                  <n-card
                    :segmented="{
                      content: true,
                      footer: true,
                    }"
                    footer-style="padding: 0.5vw 0;"
                    hoverable
                    @click="jumpToProj(item.fileID)"
                  >
                    <template #cover>
                      <div v-if="isManage" style="position: absolute; top: 5px; right: 5px">
                        <n-space>
                          <n-button circle type="error" size="small" @click.stop="handleDelete(item.fileID)">
                            <n-icon size="20"><trash-outline /></n-icon
                          ></n-button>
                          <n-button circle type="info" size="small" @click.stop="handleEdit(item.fileID)">
                            <n-icon size="20"><create-outline /></n-icon
                          ></n-button>
                        </n-space>
                      </div>
                      <n-image
                        style="border-radius: 8px 8px 0 0; height: 8vw; width: 100%"
                        :src="item.fileImage"
                        object-fit="cover"
                        preview-disabled
                      ></n-image>
                    </template>
                    <template #footer>
                      <n-ellipsis style="background-color: #fff; font-size: 1rem; font-weight: 500">
                        {{ item.fileName }}
                      </n-ellipsis>
                    </template>
                  </n-card>
                </template>
                <template #default style="color: white">
                  <div>项目名称：{{ item.fileName }}</div>
                  <div>所属团队：{{ item.teamName }}</div>
                  <div>创建者：{{ item.userName }}</div>
                  <div>创建时间：{{ item.createTime.slice(0, 10) }}</div>
                </template>
              </n-tooltip>
            </n-gi>
            <!--添加项目卡片-->
            <n-gi v-if="page == parseInt((dataFilter.length / pageSize + 1).toString())">
              <n-card
                :segmented="{
                  footer: 'soft',
                }"
                footer-style="padding: 0.5vw 0;"
                :embedded="isEmbedded"
                hoverable
                @click="isCreateModalShow = true"
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
      </template>
    </Header>
  </div>
  <!--创建项目-->
  <create-modal
    :isCreateModalShow="isCreateModalShow"
    :team-id="teamId"
    @close="isCreateModalShow = false"
    @refresh="refresh"
  />
</template>
<script setup lang="ts">
import { ref, computed, reactive, defineProps, onMounted, h, watch } from 'vue';
import { Add, Search, EllipsisHorizontal, TrashOutline, ArchiveOutline, CreateOutline } from '@vicons/ionicons5';
import { deleteFile, editFile, readFile } from '@/api/file';
import { NIcon, NInput } from 'naive-ui';
import { useRouter } from 'vue-router';
import { useProjStore } from '@/store/proj';
interface Project {
  fileID: number;
  fileName: string;
  fileImage: string;
  createTime: string;
  lastVisitTime: string;
  teamName: string;
  userName: string;
}
type Props = {
  projects: Project[];
  teamId: number | null;
  pageSize: number;
};
const props = withDefaults(defineProps<Props>(), {
  projects: () => [
    {
      fileID: 2,
      fileName: '',
      fileImage: '/resource/image/project.jpg',
      createTime: '',
      lastVisitTime: '',
      teamName: '',
      userName: '',
    },
  ],
  teamId: null,
  pageSize: 10,
});

//传递事件
const emits = defineEmits(['refresh']);

const title = ref('我的项目'); //页面标题
const isEmbedded = ref(true); //卡片是否灰色
const isInputShow = ref(false); //是否显示搜索框
const isCreateModalShow = ref(false); //是否显示创建项目弹窗
const page = ref(1); //当前页
const isManage = ref(false); //是否进入删除状态
const input = ref(''); //搜索关键字
const newFileName = ref(''); //新命名项目名称
const router = useRouter();
const { setProjID } = useProjStore();
//操作列表
const operates = ref([
  {
    label: '按创建时间排序',
    key: 'sortByCreateTime',
  },
  {
    label: '按访问时间排序',
    key: 'sortByVisitTime',
  },
  {
    label: '管理',
    key: 'manage',
  },
]);
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
  if (key === 'manage') {
    console.log('manage');
    isManage.value = true;
    operates.value[2] = {
      label: '取消管理',
      key: 'cancel',
    };
  } else if (key === 'sortByCreateTime') {
    console.log('sort');
    sortByCreateTime();
  } else if (key === 'sortByVisitTime') {
    console.log('sort');
    sortByVisitTime();
  } else if (key === 'cancel') {
    console.log('cancel');
    isManage.value = false;
    operates.value[2] = {
      label: '管理',
      key: 'manage',
    };
  }
};

//删除项目
const handleDelete = (fileID: number) => {
  window.$dialog.error({
    title: '删除项目',
    content: '是否确定删除该项目，删除后可以从回收站恢复',
    positiveText: '删除',
    negativeText: '取消',
    maskClosable: false,
    onPositiveClick: () => {
      deleteFile({ fileID: fileID }).then((res) => {
        if (res.data.result == 0) {
          window.$message.success('删除成功');
          emits('refresh');
        } else if (res.data.result == 1) {
          window.$message.warning(res.data.message);
        } else if (res.data.result == 2) {
          window.$message.error(res.data.message);
        }
      });
    },
    onNegativeClick: () => {},
  });
};

//修改项目名称
const handleEdit = (fileID: number) => {
  window.$dialog.info({
    title: '修改项目名称',
    content: () => {
      return h(NInput, {
        style: 'width: 100%;',
        placeholder: '请输入项目名称',
        onInput: (e: any) => {
          newFileName.value = e;
          console.log(newFileName.value);
        },
      });
    },
    icon: () => {
      return h(NIcon, {
        component: CreateOutline,
      });
    },
    positiveText: '确定',
    negativeText: '取消',
    maskClosable: false,
    onPositiveClick: () => {
      if (newFileName.value.length > 0) {
        editFile({ fileID: fileID, fileName: newFileName.value, fileImage: null, fatherID: null, data: null }).then(
          (res) => {
            if (res.data.result == 0) {
              window.$message.success('修改成功');
              emits('refresh');
            } else if (res.data.result == 1) {
              window.$message.warning(res.data.message);
            } else if (res.data.result == 2) {
              window.$message.error(res.data.message);
            }
          }
        );
      } else {
        window.$message.warning('请输入项目名称');
      }
    },
    onNegativeClick: () => {},
  });
};

//刷新列表
const refresh = () => {
  emits('refresh');
};

//按创建时间排序
const sortByCreateTime = () => {
  props.projects.sort((a, b) => {
    return formatDate(b.createTime) > formatDate(a.createTime) ? 1 : -1;
  });
};

//按访问时间排序
const sortByVisitTime = () => {
  props.projects.sort((a, b) => {
    return formatDate(b.lastVisitTime) > formatDate(a.lastVisitTime) ? 1 : -1;
  });
};

//搜索
const dataFilter = computed(() => {
  return props.projects.filter((data) => {
    return !input.value || data.fileName.toLowerCase().includes(input.value.toLowerCase());
  });
});

//将"yyyy-mm-dd"格式的字符串转换为日期对象
const formatDate = (date: string) => {
  return new Date(Date.parse(date.replace(/-/g, '/')));
};

//跳转到指定项目
const jumpToProj = (fileID: number) => {
  setProjID(fileID);
  router.push({
    path: '/workspace',
  });
};
</script>
<style scoped lang="less">
#my-content {
  padding: 15px 60px 30px 60px;
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
}
</style>
