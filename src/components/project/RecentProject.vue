<template>
  <div id="recent-content">
    <n-text>最近</n-text>
    <div id="recent-box">
      <n-grid x-gap="30" :cols="6">
        <n-gi v-for="(item, index) in projects" :key="index">
          <n-tooltip :delay="500" placement="bottom-start" @update:show="handleUpdateShow(item?.fileID)">
            <template #trigger>
              <n-card
                :segmented="{
                  content: true,
                  footer: 'soft',
                }"
                footer-style="padding: 0.5vw 0;"
                hoverable
                @click="jumpToProj(item.fileID)"
              >
                <template #cover>
                  <n-image
                    style="border-radius: 8px 8px 0 0; height: 6vw"
                    :src="item?.fileImage"
                    object-fit="cover"
                    preview-disabled
                  ></n-image>
                </template>
                <template #footer>
                  <n-ellipsis style="background-color: #fff; font-size: 1rem; font-weight: 400">
                    {{ item?.fileName }}
                  </n-ellipsis>
                </template>
              </n-card>
            </template>
            <template #default style="color: white">
              <div>项目名称：{{ currentProject.fileName }}</div>
              <div>所属团队：{{ currentProject.teamName }}</div>
              <div>创建者：{{ currentProject.userName }}</div>
              <div>创建时间：{{ currentProject.createTime }}</div>
            </template>
          </n-tooltip>
        </n-gi>
      </n-grid>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { readFile, recentProjectList } from '@/api/file';
import { useRouter } from 'vue-router';
import { useProjStore } from '@/store/proj';
const router = useRouter();
const { setProjID } = useProjStore();
const projects = ref([
  {
    fileID: 1,
    fileName: 'project',
    fileImage: '',
    createTime: '2020-01-01',
    lastVisitTime: '2020-01-01',
  },
]);
const currentProject = ref({
  fileName: '项目名称',
  teamName: '团队名称',
  userName: '创建者',
  createTime: '1970-1-1',
}); //当前项目信息

//显示项目信息
const handleUpdateShow = (fileID: number) => {
  readFile({ fileID: fileID, teamID: -1 }).then((res) => {
    if (res.data.result == 0) {
      currentProject.value.fileName = res.data?.fileName;
      currentProject.value.createTime = res.data?.createTime.slice(0, 10);
      currentProject.value.teamName = res.data?.teamName;
      currentProject.value.userName = res.data?.userName;
    }
  });
};

const getProjectList = () => {
  recentProjectList()
    .then((res) => {
      projects.value = res.data.list;
    })
    .catch((err) => {
      console.log(err);
    });
};

//跳转到指定项目
const jumpToProj = (fileID: number) => {
  setProjID(fileID);
  router.push({
    path: '/workspace',
  });
};

onMounted(() => {
  getProjectList();
});
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
      height: 8vw;
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
