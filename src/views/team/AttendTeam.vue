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
  console.log(route.params.code + ' test');
  const inviteLink = route.params.code;

  acceptInvitation({ inviteCode: route.params.code as string })
    .then((res) => {
      router.push({ name: 'teamProject', params: { teamID: res.data.teamID } });
      message.success('加入团队成功');
    })
    .catch((err) => {
      localStorage.setItem('inviteLink', route.params.code as string);
      console.log(err);
      router.push({ name: 'ProjectDesktop' });
    });
});
</script>

<style scoped></style>
