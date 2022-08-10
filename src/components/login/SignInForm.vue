<template>
  <n-form ref="formRef" :rules="rules" :model="model" size="large" :show-label="false">
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
import { ref, computed, reactive, defineProps, onMounted, h } from 'vue';
import { login } from '@/api/auth';
import { useAuthStore } from '@/store/auth';
// import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { hex_md5 } from '@/plugins/md5.js'
import { complex ,isEmail} from '@/plugins/passVerify.js';
const emits = defineEmits(['forget']);
const { signIn } = useAuthStore();
const router = useRouter();

const model = reactive({
  email: '',
  password: '',
});
const rules = ref({
  email: [
    {
      required: true,
      // message: '请输入新密码',
      trigger: ['input', 'blur'],

      validator(rule:any, value:any) {
        if (!value) {
          return new Error("请输入邮箱");
        } else if (!(isEmail(value))) {
          return new Error("输入正确邮箱格式");
        }
        return true;
      },
    },
  ],
});


const handleLogin = () => {
  //login({ email: model.email, password: hex_md5(model.password) }).then((res) => {//加密
  login({ email: model.email, password: model.password }).then((res) => {
    if (res.data.result == 0) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userID', res.data.userID);
      localStorage.setItem('avatar', res.data.avatar);
      signIn(res.data.token);
      window.$message.info('登录成功');
      // console.log(localStorage.getItem('inviteLink'));
      if (localStorage.getItem('inviteLink')) {
        router.push({ name: 'AttendTeam', params: { code: localStorage.getItem('inviteLink') } });
      } else {
        router.push({ name: 'ProjectDesktop' });
      }
    }
  });
};
</script>
