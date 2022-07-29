<template>
  <n-form ref="formRef" :model="model" size="large" :show-label="false">
    <n-form-item path="email">
      <n-input v-model:value="model.email" placeholder="邮箱地址" />
    </n-form-item>
    <n-form-item path="code">
      <div class="flex-y-center">
        <n-input v-model:value="model.code" placeholder="验证码" />
        <div class="w-18px"></div>
        <n-button size="large" @click="handleGetCaptcha"> 获取验证码 </n-button>
      </div>
    </n-form-item>
    <n-form-item path="passwd">
      <n-input v-model:value="model.passwd" type="password" show-password-on="click" placeholder="密码" />
    </n-form-item>
    <n-form-item path="confirmpasswd">
      <n-input v-model:value="model.confirmpasswd" type="password" show-password-on="click" placeholder="确认密码" />
    </n-form-item>
    <n-button type="primary" size="large" :block="true" :round="true" @click="handleSubmit">确定</n-button>
  </n-form>
</template>

<script setup lang="ts">
import { getCaptcha, register } from '@/api/auth';
import { reactive } from 'vue';
const emits = defineEmits(['finish-register']);

const model = reactive({
  email: '',
  code: '',
  passwd: '',
  confirmpasswd: '',
});

const handleGetCaptcha = () => {
  if (model.email == '') window.$message.warning('输入邮箱不能为空');
  getCaptcha({ email: model.email });
};

const handleSubmit = () => {
  if (model.passwd != model.confirmpasswd) {
    window.$message.warning('两次输入密码不同！');
  }
  register({ email: model.email, passwd: model.passwd, code: model.code }).then((res) => {
    if (res.data.status == 0) {
      window.$message.info('注册成功');
      emits('finish-register');
    }
  });
};
</script>
