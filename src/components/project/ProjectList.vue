<template>
  <div id="my-content">
    <Header :title="title">
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
              <n-card
                :segmented="{
                  content: true,
                  footer: 'soft',
                }"
                footer-style="padding: 0.5vw 0;"
                hoverable
                @click="isCreateModalShow = true"
              >
                <template #cover>
                  <div v-if="isManage" style="position: absolute; top: 5px; right: 5px">
                    <n-space>
                      <n-button circle type="error" size="small"
                        ><n-icon size="20" @click.stop=""><trash-outline /></n-icon
                      ></n-button>
                      <n-button circle type="info" size="small"
                        ><n-icon size="20" @click.stop=""><create-outline /></n-icon
                      ></n-button>
                    </n-space>
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
  <n-modal v-model:show="isCreateModalShow" preset="dialog" :show-icon="false">
    <template #header> 创建项目 </template>
    <template #default>
      <n-form :rules="rules" :model="porjModel" label-placement="left">
        <n-form-item label="项目名称" path="name">
          <n-input v-model:value="porjModel.name" placeholder=""></n-input>
        </n-form-item>
        <n-form-item label="所属团队" path="teamId">
          <n-select v-model:value="porjModel.teamId" :options="teams" placeholder="请选择" />
        </n-form-item>
        <n-form-item label="上传封面&nbsp;&nbsp;">
          <n-upload
            directory-dnd
            action="http://43.138.77.8:8000/api/upload"
            :max="1"
            :with-credentials="true"
            @finish="handleUploadFinish"
            list-type="image-card"
          >
            <n-upload-dragger>
              <div style="margin-bottom: 12px">
                <n-icon size="48" :depth="3">
                  <archive-outline />
                </n-icon>
              </div>
            </n-upload-dragger>
          </n-upload>
        </n-form-item>
      </n-form>
    </template>
    <template #action>
      <n-space>
        <n-button></n-button>
        <n-button></n-button>
      </n-space>
    </template>
    <template #icon> </template>
  </n-modal>
</template>
<script setup lang="ts">
import { ref, computed, reactive, defineProps, onMounted } from 'vue';
import type { InputInst, FormRules, FormItemRule, UploadFileInfo } from 'naive-ui';
import { Add, Search, EllipsisHorizontal, TrashOutline, ArchiveOutline, CreateOutline } from '@vicons/ionicons5';

interface Project {
  id: number;
  name: string;
  url: string;
}
//父组件传参
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

const title = ref('我的项目'); //页面标题
const isEmbedded = ref(true); //卡片是否灰色
const isInputShow = ref(false); //是否显示搜索框
const isCreateModalShow = ref(false); //是否显示创建项目弹窗
const page = ref(1); //当前页
const pageSize = ref(10); //每页元素数
const isManage = ref(false); //是否进入删除状态
const input = ref(''); //搜索关键字
const porjModel = ref({
  name: '',
  teamId: -1,
  url: '',
});
//操作
const operates = ref([
  {
    label: '按创建时间排序',
    key: 'sort',
  },
  {
    label: '管理',
    key: 'manage',
  },
]);
//团队列表
const teams = ref([
  {
    label: 'team1',
    key: 1,
  },
  {
    label: 'team2',
    key: 2,
  },
]);
//表单校验规则
const rules = ref<FormRules>({
  name: [
    {
      required: true,
      validator(rule: FormItemRule, value: string) {
        if (!value) {
          return new Error('请输入项目名称');
        } else if (Number(value) > 50) {
          return new Error('不超过50个字');
        }
        return true;
      },
      trigger: ['input', 'blur'],
    },
  ],
  teamId: [
    {
      required: true,
      message: '请选择团队',
    },
  ],
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
  if (key === 'manage') {
    console.log('manage');
    isManage.value = true;
    operates.value[1] = {
      label: '取消管理',
      key: 'cancel',
    };
  } else if (key === 'sort') {
    console.log('sort');
  } else if (key === 'cancel') {
    console.log('cacel');
    isManage.value = false;
    operates.value[1] = {
      label: '管理',
      key: 'manage',
    };
  }
};

//文件上传完成回调
const handleUploadFinish = ({ file, event }: { file: UploadFileInfo; event?: ProgressEvent }) => {
  let ret = JSON.parse((event?.target as XMLHttpRequest).response);
  porjModel.value.url = ret.url;
  return file;
};

//搜索
const dataFilter = computed(() => {
  return projects.filter((data) => {
    return !input.value || data.name.toLowerCase().includes(input.value.toLowerCase());
  });
});

onMounted(() => {
  if (teamId != -1) {
    porjModel.value.teamId = teamId;
    title.value = '团队项目';
  }
});
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
