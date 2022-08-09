<template>
  <n-space v-if="showEditing" align="center" justify="start" class="ml-2 pt-2">
    <n-text class="pt-2 text-15px text-light-50">正在编辑：</n-text>
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
import { getUserAvatar, getUserInfo } from '@/api/user';
import { computed, onBeforeMount, onBeforeUnmount, onMounted, ref } from 'vue';
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

const showEditing = computed(() => {
  return options.value.length != 0;
});

const userMap = new Map<number, string>();
onBeforeMount(() => {
  syncManager.openWebSocket();
});

onMounted(() => {
  var userIDString = localStorage.getItem('userID');
  var user: number;
  if (userIDString) {
    user = parseInt(userIDString as string);
  } else {
    user = -1;
    options.value.length = 0;
  }
  console.log('proto userID', user);
  var file = parseInt(route.params.protoID as string);
  console.log('use syncManager');
  syncManager.registerOpen(user, file);
  syncManager.registerClose();
  syncManager.registerRegisterFunc((userID: number, fileID: number) => {
    if (userID != -1) {
      window.$message.info('加入新用户!');
      getUserAvatar({ userID: userID }).then((res) => {
        if (res.data.result == 0) {
          userMap.set(userID, res.data.username);
          options.value.push({ name: res.data.username, src: res.data.avatar });
        }
      });
    }
  });
  syncManager.registerLeaveFunc((userID: number, fileID: number) => {
    var userIndex = options.value.findIndex((ele) => {
      return userMap.get(userID) == ele.name;
    });
    options.value.splice(userIndex, 1);
  });
});

onBeforeUnmount(() => {
  syncManager.closeWebSocket();
});
</script>
