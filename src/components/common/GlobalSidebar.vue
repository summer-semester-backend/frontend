<template>
  <n-layout-sider :width="80" bordered>
    <n-layout-header class="mt-2" position="absolute">
      <n-space vertical>
        <n-avatar round class="flex m-auto"></n-avatar>
        <sidebar-button button-name="项目" route-name="project">
          <project-outlined />
        </sidebar-button>
        <sidebar-button button-name="团队" route-name="team">
          <people />
        </sidebar-button>
        <sidebar-button button-name="个人" route-name="user">
          <person-circle-outline />
        </sidebar-button>
      </n-space>
    </n-layout-header>
    <n-layout-footer class="mb-2" position="absolute">
      <n-space vertical>
        <n-icon class="flex m-auto cursor-pointer my-2" size="20">
          <question-circle-outlined class="text-gray-600 hover:text-gray-800"></question-circle-outlined>
        </n-icon>
        <n-avatar round class="flex m-auto"></n-avatar>
      </n-space>
    </n-layout-footer>
  </n-layout-sider>
        <!-- <n-button strong secondary type="info" @click="showUserBar()" style="position: fixed;top:0px;left:0px;z-index:99999">
        user
        </n-button>
        <n-button strong secondary type="info" @click="showProjectBar()" style="position: fixed;top:30px;left:0px;z-index:99999">
        project
        </n-button> -->
</template>

<script setup lang="tsx">
import { ref } from 'vue';
import { QuestionCircleOutlined } from '@vicons/antd';
import { People, SettingsOutline, PersonCircleOutline } from '@vicons/ionicons5';
import { ProjectOutlined } from '@vicons/antd';
import { barState } from '../../store/auth';
import {useRouter} from 'vue-router';

const router = useRouter();
const topValue = ref<string | null>(null);
const bottomValue = ref<string | null>(null);

const barstate = barState();
const showUserBar = () => {
    barstate.openUserBar();
}
const showProjectBar = () => {
    barstate.openProjectBar();
}
const showTeamBar = () => {
    barstate.openTeamBar();
}

function handleTopUpdate(key: string) {
  bottomValue.value = null;
  topValue.value = key;
}
function handleBottomUpdate(key: string) {
  topValue.value = null;
  bottomValue.value = key;
}
</script>
