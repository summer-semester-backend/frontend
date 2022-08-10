<template>
  <n-layout-sider :width="80" bordered>
    <n-layout-header class="mt-2" position="absolute">
      <n-space vertical>
        <div
          style="
            width: 100%;
            display: flex;
            align-items: center;
            flex-direction: row;
            justify-content: center;
            margin-top: 20px;
            margin-bottom: 15px;
          "
        >
          <n-image :src="logo" preview-disabled></n-image>
        </div>

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
        <n-avatar object-fit="cover" round size="large" class="flex m-auto" :src="avatar"></n-avatar>
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
import logo from '/resource/logo2.png';

const { signOut, getAvatar } = useAuthStore();

var avatar = computed(() => {
  const img = getAvatar();
  return img;
});
const router = useRouter();

const handleLogout = () => {
  router.push({ name: 'login' });
  signOut();
};
</script>
