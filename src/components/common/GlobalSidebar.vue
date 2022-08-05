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
        <n-icon class="flex m-auto cursor-pointer my-2" size="20">
          <question-circle-outlined class="text-gray-600 hover:text-gray-800"></question-circle-outlined>
        </n-icon>
        <n-button class="flex m-auto" :bordered="false" @click="handleLogout"> 登出</n-button>
      </n-space>
    </n-layout-footer>
  </n-layout-sider>
</template>

<script setup lang="tsx">
import { ref } from 'vue';
import { QuestionCircleOutlined } from '@vicons/antd';
import { People, SettingsOutline, PersonCircleOutline } from '@vicons/ionicons5';
import { ProjectOutlined } from '@vicons/antd';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';

const topValue = ref<string | null>(null);
const bottomValue = ref<string | null>(null);
const router = useRouter();
const { signOut } = useAuthStore();
function handleTopUpdate(key: string) {
  bottomValue.value = null;
  topValue.value = key;
}
function handleBottomUpdate(key: string) {
  topValue.value = null;
  bottomValue.value = key;
}

const handleLogout = () => {
  router.push({ name: 'login' });
  signOut();
};
</script>
