<template>
  <n-space align="center" justify="center">
    <n-text class="pt-2">正在编辑：</n-text>
    <n-avatar-group :options="options" :size="30" :max="4">
      <template #avatar="{ option: { name, src } }">
        <n-tooltip>
          <template #trigger>
            <n-avatar :src="src" />
          </template>
          {{ name }}
        </n-tooltip>
      </template>
      <template #rest="{ options: restOptions, rest }">
        <n-dropdown :options="createDropdownOptions(restOptions)" placement="top">
          <n-avatar>+{{ rest }}</n-avatar>
        </n-dropdown>
      </template>
    </n-avatar-group>
  </n-space>
</template>
<script setup lang="ts">
import { getUserInfo } from '@/api/user';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { syncManager } from './SyncManager';
const route = useRoute();
const options = ref([
  {
    name: localStorage.getItem('userName') as string,
    src: localStorage.getItem('avatar') as string,
  },
]);
const createDropdownOptions = (options: Array<{ name: string; avatar: string }>) =>
  options.map((option) => ({
    key: option.name,
    label: option.name,
  }));

const userMap = new Map<number, string>();

onMounted(() => {
  var user = parseInt(localStorage.getItem('userID') as string);
  var file = parseInt(route.params.protoID as string);
  console.log('use syncManager');
  syncManager.registerOpen(user, file);
  syncManager.registerClose();
  syncManager.registerRegisterFunc((userID: number, fileID: number) => {
    window.$message.info('加入新用户!');
    getUserInfo({ userID: userID.toString() }).then((res) => {
      if (res.data.result == 0) {
        userMap.set(userID, res.data.data.username);
        options.value.push({ name: res.data.data.username, src: res.data.data.avatar });
      }
    });
  });
  syncManager.registerLeaveFunc((userID: number, fileID: number) => {
    var userIndex = options.value.findIndex((ele) => {
      return userMap.get(userID) == ele.name;
    });
    options.value.splice(userIndex, 1);
  });
});

onBeforeUnmount(() => {
  console.log('before onUnmounted');
  syncManager.closeWebSocket();
});
</script>
