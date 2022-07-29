<template>
  <n-form ref="formRef" :model="model" size="large" :show-label="false">
    <n-form-item path="email">
      <n-input v-model:value="model.email" placeholder="请输入邮箱" />
    </n-form-item>
    <n-form-item path="passwd">
      <n-input v-model:value="model.passwd" type="password" show-password-on="click" placeholder="请输入密码" />
    </n-form-item>
    <n-space :vertical="true" :size="24">
      <n-button :text="true" @click="">忘记密码？</n-button>
      <n-button type="primary" size="large" :block="true" :round="true" @click="handleLogin"> 确定 </n-button>
    </n-space>
  </n-form>
</template>

<script setup lang="ts">
import { login } from '@/api/auth';
import { useAuthStore } from '@/store/auth';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const { signIn } = useAuthStore();
const router = useRouter();

const model = reactive({
  email: '',
  passwd: '',
});

const handleLogin = () => {
  login({ email: model.email, passwd: model.passwd }).then((res) => {
    if (res.data.status == 0) {
      localStorage.setItem('token', res.data.data.token);
      signIn(res.data.data.token);
      window.$message.info('登录成功');
      router.push({ name: 'homepage' });
    }
  });
};
</script>
