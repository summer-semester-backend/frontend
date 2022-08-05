<template>
  <n-modal
    :show="isCreateModalShow"
    preset="dialog"
    title="新建团队"
    size="medium"
    positive-text="确认"
    negative-text="取消"
    @positive-click="handlePositiveClick"
    @negative-click="handleClose"
    @close="handleClose"
  >
    <n-divider style="margin: 15px auto" />
    <n-input v-model:value="newTeamName" type="text" placeholder="请输入团队名称"> </n-input>
    <n-input
      v-model:value="newTeamProfile"
      type="textarea"
      placeholder="请输入团队简介"
      maxlength="200"
      show-count
      style="margin-top: 15px"
    >
    </n-input>
  </n-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { createTeam } from '@/api/team.js';

const emits = defineEmits(['close', 'refresh']);
const props = withDefaults(defineProps<{ isCreateModalShow: boolean }>(), { isCreateModalShow: false });
const newTeamName = ref('');
const newTeamProfile = ref('');

function handlePositiveClick() {
  if (newTeamName.value == '') {
    window.$message.warning('组织名不能为空');
    return false;
  }
  if (newTeamProfile.value == '') {
    window.$message.warning('组织简介不能为空');
    return false;
  }
  createTeam({
    teamname: newTeamName.value,
    summary: newTeamProfile.value,
  })
    .then((res) => {
      if (res.data.result == 0) {
        emits('refresh');
        emits('close');
        window.$message.success('创建成功');
      } else {
        window.$message.error(res.data.message);
      }
    })
    .finally(() => {
      newTeamName.value = '';
      newTeamProfile.value = '';
    });
}

function handleClose() {
  emits('close');
}
</script>

<style scoped></style>
