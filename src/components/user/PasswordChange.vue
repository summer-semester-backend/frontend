<template>
  <div id="my-content">
    <Header :title="title"></Header>

    <n-form ref="formRef" :rules="rules" :model="model" label-placement="left" require-mark-placement="left">
      <n-form-item label="&emsp;旧密码：" path="password">
        <n-input
          v-model:value="model.password"
          placeholder="请输入"
          type="password"
          show-password-on="click"
          style="width: 300px"
        />
      </n-form-item>

      <n-form-item label="&emsp;新密码：" path="newPassword">
        <n-input
          v-model:value="model.newPassword"
          placeholder="请输入"
          type="password"
          show-password-on="click"
          style="width: 300px"
        />
      </n-form-item>

      <n-form-item label="确认密码：" path="newPasswordCheck">
        <n-input
          v-model:value="model.newPasswordCheck"
          placeholder="请输入"
          type="password"
          show-password-on="click"
          style="width: 300px"
        />
      </n-form-item>
    </n-form>

    <n-button
      type="info"
      @click="change()"
      color="#409EFF"
      style="width: 150px; height: 40px; margin-left: 80px; margin-top: 30px"
    >
      提交
    </n-button>
  </div>
</template>

<script setup>
import { ref, computed, reactive, defineProps, onMounted, h } from 'vue';
import { changePassword } from '@/api/auth';
import { useMessage } from 'naive-ui';
import { hex_md5 } from '@/plugins/md5.js'
// import { StarFilled } from "@vicons/antd";
// import { FormInst, FormRules, FormItemRule, UploadFileInfo } from 'naive-ui';
const message = useMessage();
const title = ref('修改密码'); //页面标题
const formRef = ref(null);
const model = ref({
  password: '',
  newPassword: '',
  newPasswordCheck: '',
});
const rules = ref({
  password: [
    {
      required: true,
      message: '请输入旧密码',
      trigger: ['input', 'blur'],
    },
  ],
  newPassword: [
    {
      required: true,
      message: '请输入新密码',
      trigger: ['input', 'blur'],
    },
  ],
  newPasswordCheck: [
    {
      required: true,
      message: '请确认密码',
      trigger: ['input', 'blur'],
    },
  ],
});

const change = () => {
  if (
    checkEmpty(model.value.password) ||
    checkEmpty(model.value.newPassword) ||
    checkEmpty(model.value.newPasswordCheck)
  ) {
    message.warning('必填字段未填写!');
    return;
  }
  if (model.value.newPassword != model.value.newPasswordCheck) {
    message.warning('两次密码不一致！');
    return;
  }
  if (model.value.newPassword == model.value.password) {
    message.warning('新旧密码相同！');
    return;
  }
  //changePassword({ password: hex_md5(model.value.password), newPassword: hex_md5(model.value.newPassword) })//加密
  changePassword({ password: model.value.password, newPassword: model.value.newPassword })
    .then((res) => {
      if (res.data.result == 0) {
        window.$message.success('更新成功！');
        model.value.password = '';
        model.value.newPassword = '';
        model.value.newPasswordCheck = '';
      } else if (res.data.result == 1) {
        window.$message.warning(res.data.message);
      } else if (res.data.result == 2) {
        window.$message.error(res.data.message);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const checkEmpty = (item) => {
  if (item === null || item === '') return 1;
  else return 0;
};
</script>

<style lang="less" scoped>
#my-content {
  float: left;
  padding: 35px 60px 30px 60px;
}

.n-form-item {
  margin-top: 15px;
}
</style>
