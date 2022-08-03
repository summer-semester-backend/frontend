<template>
  <div class="container">
    <Header title="基本信息">
      <template #content>
        <TeamSetting />
      </template>
    </Header>
    <Header title="成员信息">
      <template #toolbar>
        <n-button v-if="!isInputShow" @click="showInput" quaternary circle>
          <template #icon>
            <n-icon size="20" color="rgb(100,100,100)"><search /></n-icon>
          </template>
        </n-button>
        <n-input-group v-else style="width: 200px">
          <n-input v-model:value="input" @blur="hideInput" round placeholder="搜索成员">
            <template #prefix>
              <n-icon size="20" :component="Search" />
            </template>
          </n-input>
          <n-button round secondary @click="handleSearch">搜索</n-button>
        </n-input-group>
        <n-button quaternary circle @click="handleInviteUser">
          <template #icon>
            <n-icon size="22" color="rgb(100,100,100)"><add /></n-icon>
          </template>
        </n-button>
        <n-button quaternary circle>
          <template #icon>
            <n-icon size="18" color="rgb(100,100,100)"><ReloadOutline /></n-icon>
          </template>
        </n-button>
      </template>
      <template #content>
        <MemberList ref="memberListRef" :table-data="tableData" :is-reloading="isReloading" />
      </template>
    </Header>
  </div>
</template>

<script setup lang="ts">
import { Search, Add, ReloadOutline } from '@vicons/ionicons5';
import { ref } from 'vue';
import MemberList from '@/components/team/MemberList.vue';
const isReloading = ref(false);
const memberListRef = ref<InstanceType<typeof MemberList> | null>(null);
const isInputShow = ref(false); //是否显示搜索框
const input = ref(''); //搜索关键字
const tableData = ref<Array<User.UserTableData>>([]);
//显示搜索
const showInput = () => {
  isInputShow.value = true;
};
//隐藏搜索
const hideInput = () => {
  isInputShow.value = false;
};

const handleSearch = () => {
  memberListRef.value?.handleFilterSearch(input.value);
};

const handleInviteUser = () => {
  memberListRef.value?.handleInviteUser();
};

const handleReload = () => {
  // isReloading.value = true;
  // getTeamMember(route.params.id as string).then((res) => {
  //   if (res.data.success) {
  //     tableData.value = res.data.Members.map((item: any, index: number) => {
  //       if (userID === item.id && item.isAdmin) {
  //         isAdmin.value = true;
  //       }
  //       return {
  //         ...item,
  //         key: index,
  //         identity: item.isAdmin ? '管理员' : '组员',
  //       };
  //     });
  //   }
  //   isReloading.value = false;
  // });
};
</script>

<style scoped>
.container {
  height: 100%;
  width: 100%;
  padding: 20px 20px;
  box-sizing: border-box;
}
</style>
