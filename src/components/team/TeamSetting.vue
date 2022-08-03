<template>
  <div class="container">
    <n-form style="width: 50%" :model="data">
      <n-grid>
        <n-grid-item span="12">
          <n-form-item label="团队名称" path="name">
            <n-input placeholder="请输入团队名称" v-model:value="data.name" />
          </n-form-item>
          <n-form-item label="团队ID" path="id">
            {{ route.params.teamID }}
          </n-form-item>
        </n-grid-item>
        <n-grid-item span="24">
          <n-form-item label="团队简介" path="profile">
            <n-input type="textarea" placeholder="请输入团队简介" v-model:value="data.profile" />
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
  avatar: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg',
  name: 'Loading...',
  profile: 'Loading...',
});
function clickUploadAvatar() {
  const formData = new FormData();
  formData.append('avatar', upload.value?.file as File);
  // updateOrganization(formData, route.params.id as string).then(() => {
  //   upload.value?.clearFile()
  // })
}
function reload() {
  // getOrganization(route.params.id as string).then((res) => {
  //   if (res.data.success) {
  //     data.avatar = res.data.avatar
  //       ? 'https://phoenix.matrix53.top/api/v1/' + res.data.avatar
  //       : 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg'
  //     data.name = res.data.name
  //     data.profile = res.data.profile
  //     isAdmin.value = res.data.isAdmin
  //   }
  // })
}
function clickConfilmUpdate() {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('profile', data.profile);
  // updateOrganization(formData, route.params.id as string);
}

function handleQuitClick() {
  // quitOrganization({ id: route.params.id as string }).then((res) => {
  //   if (res.data.success) {
  //     router.push({ path: '/profile' });
  //   }
  // });
}
function handleDeleteClick() {
  // deleteOrganization(route.params.id as string).then((res) => {
  //   if (res.data.success) {
  //     router.push({ path: '/team' });
  //   }
  // });
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
