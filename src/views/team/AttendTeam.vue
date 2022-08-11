<template></template>

<script setup lang="ts">
import { h, ref, computed, onMounted } from 'vue';
import { acceptInvitation } from '@/api/team';
import { useRoute, useRouter } from 'vue-router';
import { useMessage } from 'naive-ui';
const router = useRouter();
const route = useRoute();
const message = useMessage();

onMounted(() => {
  const inviteLink = route.params.code;

  acceptInvitation({ inviteCode: route.params.code as string })
    .then((res) => {
      if (res.data.result == 0) {
        router.push({ name: 'teamProject', params: { teamID: res.data.teamID } });
        message.success('加入团队成功');
        window.localStorage.removeItem('inviteLink');
      }
    })
    .catch((err) => {
      console.log(err);
      localStorage.setItem('inviteLink', route.params.code as string);
      router.push({ name: 'login' });
    });
});
</script>

<style scoped></style>
