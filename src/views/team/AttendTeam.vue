<template></template>

<script setup lang="ts">
import { h, ref, computed, onMounted } from 'vue';
import { acceptInvitation } from '@/api/team';
import { useRoute, useRouter } from 'vue-router';
const router = useRouter();
const route = useRoute();

onMounted(() => {
  console.log(route.params.code + ' test');
  const inviteLink = route.params.code;

  acceptInvitation({ inviteCode: route.params.code as string })
    .then((res) => {
      router.push({ name: 'teamProject', params: { teamID: res.data.teamID } });
      console.log('1');
    })
    .catch((err) => {
      localStorage.setItem('inviteLink', route.params.code as string);
      console.log(err);
    });
});
</script>

<style scoped></style>
