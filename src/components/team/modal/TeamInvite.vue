<template>
  <n-modal
    v-model:show="show"
    preset="dialog"
    title="添加成员"
    size="medium"
    positive-text="确认"
    negative-text="取消"
    @positive-click="handlePositiveClick"
  >
    <n-divider style="margin: 15px auto" />
    <n-space>
      <n-input v-model:value="userEmail" type="text" placeholder="请输入添加的成员邮箱" style="width: 375px" />
    </n-space>
  </n-modal>
</template>

<script setup lang="ts">
import { inviteTeamMember } from '@/api/team';

import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const userEmail = ref('');
const show = ref(false);

function handlePositiveClick() {
  inviteTeamMember({ teamID: route.params.teamID as string, email: userEmail.value }).then((res) => {
    if (res.data.result == 0) {
      window.$message.info('邀请成功');
    }
  });
}
function open() {
  show.value = true;
}

defineExpose({ open });
</script>
