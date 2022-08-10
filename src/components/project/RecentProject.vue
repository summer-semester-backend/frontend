<template>
  <div id="recent-content" v-if="projects.length != 0">
    <n-text>最近</n-text>
    <div id="recent-box">
      <n-grid x-gap="30" :cols="6">
        <n-gi v-for="(item, index) in projects" :key="index">
          <n-tooltip :delay="500" placement="bottom-start">
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
                    style="border-radius: 8px 8px 0 0; height: 7vw; width: 100%"
                    :src="item?.fileImage"
                    object-fit="cover"
                    preview-disabled
                  ></n-image>
                </template>
                <template #footer>
                  <n-ellipsis :tooltip="false" style="background-color: #fff; font-size: 1rem; font-weight: 400">
                    {{ item?.fileName }}
                  </n-ellipsis>
                </template>
              </n-card>
            </template>
            <template #default style="color: white">
              <div>项目名称：{{ item.fileName }}</div>
              <div>所属团队：{{ item.teamName }}</div>
              <div>创建者：{{ item.userName }}</div>
              <div>创建时间：{{ formatDate(item.createTime) }}</div>
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
import { formatDate } from '@/plugins/date';
import { useRouter } from 'vue-router';
const router = useRouter();
const projects = ref([
  {
    fileID: 1,
    fileName: '',
    fileImage: '',
    createTime: '',
    lastVisitTime: '',
    teamName: '',
    userName: '',
  },
]);

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
  router.push({
    name: 'workspace',
    params: {
      ProjID: fileID,
    },
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
