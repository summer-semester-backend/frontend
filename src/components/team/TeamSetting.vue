<template>
  <div class="container">
    <n-form style="width: 50%" :model="data">
      <n-grid>
        <n-grid-item span="12">
          <n-form-item label="团队名称" path="teamname">
            <n-input placeholder="请输入团队名称" v-model:value="data.teamname" />
          </n-form-item>
        </n-grid-item>
        <n-grid-item span="24">
          <n-form-item label="团队简介" path="summary">
            <n-input type="textarea" placeholder="请输入团队简介" v-model:value="data.summary" />
          </n-form-item>
        </n-grid-item>
      </n-grid>
      <n-space justify="end" :wrap="false">
        <n-button type="primary" @click="clickConfilmUpdate"> 确认修改 </n-button>
        <n-button type="warning" secondary @click="showQuitModal = true"> 退出团队 </n-button>
        <n-button type="error" secondary @click="showDeleteModal = true"> 解散团队 </n-button>
      </n-space>
    </n-form>
  </div>
  <n-modal
    v-model:show="showQuitModal"
    preset="dialog"
    title="确认退出"
    size="medium"
    positive-text="确认"
    negative-text="取消"
    @positive-click="handleQuitClick"
  >
    确认退出当前团队吗
  </n-modal>
  <n-modal
    v-model:show="showDeleteModal"
    preset="dialog"
    title="确认解散"
    size="medium"
    positive-text="确认"
    negative-text="取消"
    @positive-click="handleDeleteClick"
  >
    确认解散当前团队吗
  </n-modal>
</template>

<script setup lang="ts">
import { deleteTeam, getTeamDetail, leaveTeam, updateTeamDetail } from '@/api/team';
import { NButton, NSpace, NModal, NForm, NGrid, NGridItem, NFormItem, NAvatar, NH1, NInput } from 'naive-ui';
import { onMounted, ref, reactive } from 'vue';

import { useRouter, useRoute } from 'vue-router';
import type UploadButton from '../common/UploadButton.vue';
const router = useRouter();
const route = useRoute();
const isAdmin = ref(false);
const showQuitModal = ref(false);
const showDeleteModal = ref(false);
const upload = ref<InstanceType<typeof UploadButton> | null>(null);
const data = reactive({
  teamname: 'Loading...',
  summary: 'Loading...',
});
function reload() {
  getTeamDetail({ teamID: route.params.teamID as string }).then((res) => {
    if (res.data.result == 0) {
      data.teamname = res.data.teamname;
      data.summary = res.data.summary;
      isAdmin.value = res.data.isAdmin;
    }
  });
}
function clickConfilmUpdate() {
  updateTeamDetail({ teamID: route.params.teamID as string, teamname: data.teamname, summary: data.summary }).then(
    (res) => {
      if (res.data.result == 0) {
        window.$message.info(res.data.message);
      }
    }
  );
}

function handleQuitClick() {
  leaveTeam({ teamID: route.params.teamID as string }).then((res) => {
    if (res.data.result == 0) {
      router.push({ path: 'project' });
    }
  });
}
function handleDeleteClick() {
  deleteTeam({ teamID: route.params.teamID as string }).then((res) => {
    if (res.data.result == 0) {
      router.push({ name: 'project' });
    }
  });
}
onMounted(reload);
</script>
<style scoped>
.container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: left;
  box-sizing: border-box;
}
.avatar-container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
</style>
