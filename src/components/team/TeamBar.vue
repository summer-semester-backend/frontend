<template>
  <div class="barBox">
    <div class="head">
      <n-select
        v-model:value="curTeamID"
        :options="options"
        label-field="teamName"
        value-field="teamID"
        style="width: 160px; font-weight: bold"
        @update:value="handleSelectUpdate"
      />
      <!-- <div class="titleBox">软工小学期</div> -->
      <n-button text @click="isCreateModalShow = true">
        <n-icon size="26" class="icon">
          <AddCircleOutlineFilled />
        </n-icon>
      </n-button>
      <!-- <n-icon size="30" class="icon">
        <MenuOpenRound />
      </n-icon> -->
    </div>

    <n-space vertical>
      <!-- <n-switch v-model:value="collapsed" /> -->
      <n-layout has-sider>
        <!-- <n-layout-sider
              bordered
              collapse-mode="width"
              :collapsed-width="64"
              :width="240"
              :collapsed="collapsed"
              show-trigger
              @collapse="collapsed = true"
              @expand="collapsed = false"
            > -->
        <n-layout>
          <n-menu
            v-model:value="activeKey"
            :collapsed="collapsed"
            :collapsed-width="64"
            :collapsed-icon-size="22"
            :options="menuOptions"
            :icon-size="26"
            style="width: 250px; font-size: 17px; font-weight: bold"
            @update:value="handleMenuUpdate"
          />
        </n-layout>
        <!-- </n-layout-sider> -->
        <!-- <n-layout>
              <span>内容</span>
            </n-layout> -->
      </n-layout>
    </n-space>
    <TeamAdd :isCreateModalShow="isCreateModalShow" @refresh="getTeams()" @close="isCreateModalShow = false" />
  </div>
</template>

<script setup>
import { defineComponent, h, ref, computed, onMounted, watch } from 'vue';
import { MenuOpenRound, AddCircleOutlineFilled } from '@vicons/material';
import { useRouter, RouterLink, useRoute } from 'vue-router';
import { getTeamList } from '@/api/team';
import { NIcon } from 'naive-ui';
import { AppstoreAddOutlined, SettingOutlined, ProfileOutlined } from '@vicons/antd';

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const router = useRouter();
const route = useRoute();
const activeKey = ref(router.currentRoute.value.name);
const collapsed = ref(false);
const isCreateModalShow = ref(false);

const curTeamID = ref(null);
const options = ref([
  {
    teamName: '软工小学期',
    teamID: 'ssss',
  },
]);

const menuOptions = [
  {
    label: '团队项目',
    key: 'teamProject',
    icon: renderIcon(AppstoreAddOutlined),
  },
  {
    label: '文档中心',
    key: 'documentCenter',
    icon: renderIcon(ProfileOutlined),
  },
  {
    label: '团队设置',
    key: 'teamDetail',
    icon: renderIcon(SettingOutlined),
  },
];

const getTeams = () => {
  getTeamList()
    .then((res) => {
      if (res.data.result == 0) {
        options.value = res.data.list;
      } else {
        window.$message.error(res.data.message);
      }
    })
    .then(() => {
      console.log(route.params.teamID);
      if (!route.params.teamID) {
        let tempTeamID = options.value[0].teamID;
        curTeamID.value = tempTeamID;
        router.push({ name: 'teamProject', params: { teamID: tempTeamID } });
        activeKey.value = 'teamProject';
      } else {
        console.log(options.value);
        curTeamID.value = parseInt(route.params.teamID.toString());
      }
    })
    .catch(() => {
      console.log('error');
    });
};

const handleSelectUpdate = (value) => {
  if (route.name == 'teamProject') {
    window.open('/team/' + value + '/project', '_self');
  } else if (route.name == 'teamDetail') {
    window.open('/team/' + value + '/', '_self');
  } else if (route.name == 'documentCenter') {
    window.open('/team/' + value + '/doc', '_self');
  }
};
const jumpTo = () => {};
const handleMenuUpdate = (value) => {
  if (value == 'teamProject') {
    router.push({ name: 'teamProject', params: { teamID: curTeamID.value } });
  } else if (value == 'teamDetail') {
    router.push({ name: 'teamDetail', params: { teamID: curTeamID.value } });
  } else if (value == 'documentCenter') {
    router.push({ name: 'documentCenter', params: { teamID: curTeamID.value } });
  }
};
onMounted(() => {
  getTeams();
});
</script>

<style lang="less" scoped>
.barBox {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 45px 35px;
  gap: 10px;

  position: relative;
  width: 270px;
  /* height: 754px; */
  height: 100%;

  background: #ffffff;
  border: 1px solid #d9d9d9;

  .head {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    width: 200px;
    height: 35px;

    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;

    padding-bottom: 10px;
    border-bottom: 2px solid #d9d9d9;
    .titleBox {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 700;
      font-size: 24px;
      line-height: 29px;
    }
    .icon {
      cursor: pointer;
    }
  }
}
</style>
