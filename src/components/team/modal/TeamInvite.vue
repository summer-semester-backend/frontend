<template>
  <n-modal
    v-model:show="show"
    preset="dialog"
    title="通过链接邀请成员"
    size="medium"
    positive-text="复制"
    negative-text="取消"
    @positive-click="handlePositiveClick"
  >
    <n-divider style="margin: 15px auto" />
    <n-space>
      链接（7天内有效）
      <n-input v-model:value="code" type="text" placeholder="" style="width: 375px" :disabled="true" />
    </n-space>
  </n-modal>
</template>

<script setup lang="ts">
import { inviteTeamMember } from '@/api/team';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const code = ref('');
const show = ref(false);

const handlePositiveClick = async () => {
  navigator.clipboard.writeText(code.value);
};

function open() {
  inviteTeamMember({ teamID: route.params.teamID as string }).then((res) => {
    if (res.data.result == 0) {
      code.value = window.location.origin + '/attendTeam/' + res.data.inviteCode;
    }
  });
  show.value = true;
}

defineExpose({ open });
</script>
