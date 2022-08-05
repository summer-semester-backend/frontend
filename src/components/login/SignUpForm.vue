<template>
  <n-form ref="formRef" :model="model" size="large" :show-label="false">
    <n-form-item path="name">
      <n-input v-model:value="model.username" placeholder="用户名" />
    </n-form-item>
    <n-form-item path="email">
      <n-input v-model:value="model.email" placeholder="邮箱地址" />
    </n-form-item>
    <n-form-item path="code">
      <div class="flex-y-center">
        <n-input v-model:value="model.code" placeholder="验证码" />
        <div class="w-18px"></div>
        <n-button
          size="large"
          :type="valid ? 'primary' : 'default'"
          :disabled="!valid"
          secondary
          @click="handleRegisterCode"
        >
          获取验证码
          <n-countdown
            v-if="!valid"
            :duration="60000"
            :active="!valid"
            @finish="valid = !valid"
            :render="renderCountdown"
          />
        </n-button>
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
import { applyRegisterCode, register } from '@/api/auth';
import { reactive, ref } from 'vue';
import type { CountdownProps } from 'naive-ui';
import { isValid } from 'date-fns';
const emits = defineEmits(['finish-register']);
const valid = ref(true);
const model = reactive({
  username: '',
  email: '',
  code: '',
  passwd: '',
  confirmpasswd: '',
});

const handleRegisterCode = () => {
  if (model.email == '') {
    window.$message.warning('输入邮箱不能为空');
    return;
  }
  applyRegisterCode({ email: model.email });
  valid.value = false;
};

const renderCountdown: CountdownProps['render'] = ({ hours, minutes, seconds }) => {
  return `(${String(seconds).padStart(2, '0')})`;
};

const handleSubmit = () => {
  if (model.email == '' || model.passwd == '') {
    window.$message.warning('邮箱或密码不能为空');
    return;
  }
  if (model.passwd != model.confirmpasswd) {
    window.$message.warning('两次输入密码不同！');
    return;
  }
  register({ username: model.username, email: model.email, password: model.passwd, code: model.code }).then((res) => {
    if (res.data.result == 0) {
      window.$message.success('注册成功');
      emits('finish-register');
    }
  });
};
</script>
