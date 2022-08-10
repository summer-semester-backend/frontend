<template>
  <div id="workspace">
    <WorkBar id="workBar" @showUsers="activate" :users="users" :team-i-d="teamID"></WorkBar>
    <div style="padding: 20px 60px" id="drawer">
      <router-view></router-view>
    </div>

    <n-drawer
      v-model:show="active"
      :width="300"
      :placement="placement"
      :show-mask="false"
      :trap-focus="false"
      :block-scroll="false"
      :mask-closable="false"
      to="#drawer"
    >
      <n-drawer-content title="全部成员" closable>
        <div>
          <div id="usersDetail" v-for="(item, index) in teamUsers" :key="index">
            <n-popover placement="bottom-start" trigger="hover">
              <template #trigger>
                <div id="userDetail">
                  <n-avatar round :size="35" :src="item.avatar"></n-avatar>
                  <div>
                    {{ item.username }}
                  </div>
                  <n-icon size="30" color="#faad14" v-if="item.authority == '2'">
                    <CrownOutlined />
                  </n-icon>
                  <n-icon size="30" color="#52c41a" v-if="item.authority == '1'">
                    <CrownOutlined />
                  </n-icon>
                </div>
              </template>
              <div>成员：{{ item.username }}</div>
              <div v-if="item.authority == '2'">身份：团队创建人</div>
              <div v-if="item.authority == '1'">身份：管理员</div>
              <div v-if="item.authority == '0'">身份：普通成员</div>
              <div>邮箱：{{ item.email }}</div>
            </n-popover>
          </div>
        </div>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onMounted } from '@vue/runtime-core';
import { RouterView } from 'vue-router';
import { useRoute, useRouter } from 'vue-router';
import type { DrawerPlacement } from 'naive-ui';
import { projectToTeam } from '@/api/file';
import { CrownOutlined } from '@vicons/antd';
const active = ref(false);
const placement = ref<DrawerPlacement>('right');
const activate = () => {
  if (active.value == true) {
    active.value = false;
  } else {
    active.value = true;
  }
};
const route = useRoute();
const router = useRouter();
const users = ref<Array<any>>([]);
const teamID = ref('');
const teamUsers = ref([
  {
    userID: '',
    authority: '',
    username: '',
    email: '',
    avatar: '',
  },
]);

const getTeamUsers = (id: number | null) => {
  projectToTeam({ fileID: id }).then((res) => {
    if (res.data.result == 0) {
      teamUsers.value = res.data.userList;
      teamID.value = res.data.teamID;
      let i = 0;
      let length = teamUsers.value.length;
      for (i = 0; i < length; i++) {
        users.value.push({
          name: teamUsers.value.at(i)?.username as string,
          src: teamUsers.value.at(i)?.avatar as string,
        });
      }
    }
  });
};

onMounted(() => {
  if (!route.params.ProjID) {
    window.$message.error('项目不存在');
    router.back();
  }
  if (route.fullPath.split('/').length === 3) {
    router.replace(`/workspace/${route.params.ProjID}/doc`);
  }

  getTeamUsers(parseInt(route.params.ProjID.toString()));
});
</script>

<style scoped>
#workspace {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

#drawer {
  position: relative;
  width: 100%;
  height: 100%;
}

#usersDetail {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
}

#userDetail {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 0px;
  gap: 10px;

  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
}
</style>
