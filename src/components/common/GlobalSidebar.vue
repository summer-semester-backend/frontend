<template>
  <n-layout-sider :width="80" bordered>
    <n-layout-header class="mt-2" position="absolute">
      <n-space vertical>
        <n-avatar round class="flex m-auto"></n-avatar>
        <sidebar-button button-name="个人" route-name="ProjectDesktop" root-route="user">
          <person-circle-outline />
        </sidebar-button>
        <sidebar-button button-name="团队" route-name="team" root-route="team">
          <people />
        </sidebar-button>
      </n-space>
    </n-layout-header>
    <n-layout-footer class="mb-2" position="absolute">
      <n-space vertical>
        <n-avatar round size="large" class="flex m-auto" :src="avatar"></n-avatar>
        <n-button class="flex m-auto" :bordered="false" @click="handleLogout"> 登出</n-button>
      </n-space>
    </n-layout-footer>
  </n-layout-sider>
</template>

<script setup lang="tsx">
import { onMounted, ref } from 'vue';
import { People, PersonCircleOutline } from '@vicons/ionicons5';
import { ProjectOutlined } from '@vicons/antd';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import { getUserInfo } from '@/api/user';

const avatar = ref('');
const router = useRouter();
const { signOut } = useAuthStore();

const handleLogout = () => {
  router.push({ name: 'login' });
  signOut();
};

onMounted(() => {
  getUserInfo({ userID: localStorage.getItem('userID') as string }).then((res) => {
    if (res.data.result == 0) {
      avatar.value = res.data.data.avatar;
      localStorage.setItem('avatar', res.data.data.avatar);
    }
  });
});
</script>
