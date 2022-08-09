<template>
  <n-layout-sider :width="80" bordered>
    <n-layout-header class="mt-2" position="absolute">
      <n-space vertical>
        <n-avatar round class="flex m-auto"></n-avatar>
        <sidebar-button button-name="项目" route-name="ProjectDesktop" root-route="project">
          <project-outlined />
        </sidebar-button>
        <sidebar-button button-name="团队" route-name="team" root-route="team">
          <people />
        </sidebar-button>
        <sidebar-button button-name="个人" route-name="PersonInfo" root-route="user">
          <person-circle-outline />
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

<script setup lang="ts">
import { People, PersonCircleOutline } from '@vicons/ionicons5';
import { ProjectOutlined } from '@vicons/antd';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import { computed } from 'vue';

const avatar = computed(() => {
  const img = localStorage.getItem('avatar') as string;
  return img;
});
const router = useRouter();
const { signOut } = useAuthStore();

const handleLogout = () => {
  router.push({ name: 'login' });
  signOut();
};
</script>
