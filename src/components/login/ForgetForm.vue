<template>
  <n-form ref="formRef" :rules="rules" :model="model" size="large" :show-label="false">
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
      <n-input v-model:value="model.passwd" type="password" show-password-on="click" placeholder="新密码" />
    </n-form-item>
    <n-form-item path="confirmpasswd">
      <n-input v-model:value="model.confirmpasswd" type="password" show-password-on="click" placeholder="确认新密码" />
    </n-form-item>
    <n-form-item>
      <div class="buttonbox">
        <n-button type="primary" size="large" :block="true" :round="true" @click="handleSubmit">确定</n-button>
        <n-button size="large" :block="true" :round="true" @click="handleBack"> 返回 </n-button>
      </div>
    </n-form-item>
  </n-form>
</template>

<script setup lang="ts">
import { applyForgetCode, forgetPassword } from '@/api/auth';
import { reactive, ref } from 'vue';
import type { CountdownProps } from 'naive-ui';
import { ArrowBack } from '@vicons/ionicons5';
import { hex_md5 } from '@/plugins/md5.js'
import { complex ,isEmail} from '@/plugins/passVerify.js';
const emits = defineEmits(['finish-forget']);
const valid = ref(true);
const model = reactive({
  email: '',
  code: '',
  passwd: '',
  confirmpasswd: '',
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
  passwd: [
    {
      required: true,
      // message: '请输入新密码',
      trigger: ['input', 'blur'],

      validator(rule:any, value:any) {
        if (!value) {
          return new Error("请输入新密码");
        } else if (!complex(value)) {
          return new Error("密码大于八位，同时包含数字与字母");
        }
        return true;
      },
    },
  ],
  confirmpasswd: [
    {
      required: true,
      // message: '请输入新密码',
      trigger: ['input', 'blur'],

      validator(rule:any, value:any) {
        if (!value) {
          return new Error("请确认密码");
        } else if (!complex(value)) {
          return new Error("密码大于八位，同时包含大小写");
        }
        return true;
      },
    },
  ],
});

const handleRegisterCode = () => {
  if (model.email == '') {
    window.$message.warning('输入邮箱不能为空');
    return;
  }
  applyForgetCode({ email: model.email });
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
  //forgetPassword({ email: model.email, password: hex_md5(model.passwd), code: model.code }).then((res) => {//加密
  forgetPassword({ email: model.email, password: model.passwd, code: model.code }).then((res) => {
    if (res.data.result == 0) {
      window.$message.success('密码修改成功！');
      emits('finish-forget');
    }
  });
};

const handleBack = () => {
  emits('finish-forget');
};
</script>

<style lang="less" scoped>
.buttonbox {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0px;
  width: 100%;
  position: relative;
  justify-content: space-between;
  .n-button {
    width: 45%;
  }
}
</style>
