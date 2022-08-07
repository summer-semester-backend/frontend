<template>
  <n-form ref="formRef" :model="model" size="large" :show-label="false">
    <n-form-item path="email">
      <n-input v-model:value="model.email" placeholder="请输入邮箱" />
    </n-form-item>
    <n-form-item path="passwd">
      <n-input v-model:value="model.password" type="password" show-password-on="click" placeholder="请输入密码" />
    </n-form-item>
    <n-space :vertical="true" :size="24">
      <n-button :text="true" @click="emits('forget')">忘记密码？</n-button>
      <n-button type="primary" size="large" :block="true" :round="true" @click="handleLogin"> 确定 </n-button>
    </n-space>
  </n-form>
</template>

<script setup lang="ts">
import { login } from '@/api/auth';
import { useAuthStore } from '@/store/auth';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const emits = defineEmits(['forget']);
const { signIn } = useAuthStore();
const router = useRouter();

const model = reactive({
  email: '',
  password: '',
});

const handleLogin = () => {
  login({ email: model.email, password: model.password }).then((res) => {
    if (res.data.result == 0) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userID', res.data.userID);
      localStorage.setItem('userName', res.data.username);
      signIn(res.data.token);
      window.$message.info('登录成功');
      console.log(localStorage.getItem('inviteLink'));
      if (localStorage.getItem('inviteLink')) {
        router.push({ name: 'AttendTeam', params: { code: localStorage.getItem('inviteLink') } });
      } else {
        router.push({ name: 'ProjectDesktop' });
      }
    }
  });
};
</script>
