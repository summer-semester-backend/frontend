<template>
  <n-modal
    v-model:show="show"
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
    <n-input v-model:value="newTeamProfile" type="textarea" placeholder="请输入团队简介" style="margin-top: 15px">
    </n-input>
  </n-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { createTeam } from '@/api/team.js';

const emits = defineEmits(['update:team-created', 'close']);
const props = withDefaults(defineProps<{ show: boolean }>(), { show: false });
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
  }).then((res) => {
    if (res.data.success) {
      emits('update:team-created');
    }
  });
}

function handleClose() {
  emits('close');
}
</script>

<style scoped></style>
