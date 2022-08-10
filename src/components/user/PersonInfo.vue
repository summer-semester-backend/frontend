<template>
  <div id="my-content">
    <Header :title="title"></Header>
    <n-layout has-sider>
      <n-layout-sider width="600px">
        <n-form ref="formRef" :rules="rules" :model="model" label-placement="left" require-mark-placement="left">
          <n-form-item label="&emsp;昵称：" path="nickname">
            <n-input v-model:value="model.nickname" placeholder="请输入" clearable style="width: 350px" />
          </n-form-item>

          <n-form-item label="&emsp;邮箱：" path="email">
            <n-input v-model:value="model.email" placeholder="请输入" clearable style="width: 350px" />
          </n-form-item>

          <n-form-item label="&emsp;&emsp;性别：" path="sex">
            <n-radio-group v-model:value="model.sex" name="sexgroup">
              <n-space>
                <n-radio v-for="item in sexs" :key="item.value" :value="item.value">
                  {{ item.label }}
                </n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item>

          <n-form-item label="&emsp;手机号：" path="phone">
            <n-input v-model:value="model.phone" type="text" placeholder="请输入" clearable style="width: 350px" />
          </n-form-item>

          <n-form-item label="真实姓名：" path="username">
            <n-input v-model:value="model.username" type="text" placeholder="请输入" clearable style="width: 350px" />
          </n-form-item>

          <n-form-item label="个人简介：" path="summary">
            <n-input
              v-model:value="model.summary"
              type="textarea"
              placeholder="请输入"
              maxlength="200"
              show-count
              style="width: 600px"
              :autosize="{ minRows: 6, maxRows: 6 }"
            />
          </n-form-item>
        </n-form>

        <n-button
          type="info"
          @click="updateInfo()"
          color="#409EFF"
          style="width: 200px; height: 50px; margin-left: 80px; margin-top: 10px"
        >
          提交
        </n-button>
      </n-layout-sider>
      <n-layout-content>
        <div class="imgBox">
          <n-avatar object-fit="cover" round :size="200" :src="model.avatar" style="border: 2px solid #d9d9d9">
          </n-avatar>
          <n-button type="info" size="small" class="btn" color="#FFFFFF" text-color="#000" @click="openModel()">
            <template #icon>
              <n-icon size="20">
                <EditOutlined />
              </n-icon>
            </template>
            Edit
          </n-button>
        </div>
      </n-layout-content>
    </n-layout>

    <!-- 弹出框 -->
    <n-modal v-model:show="showModal">
      <n-card
        style="width: 600px"
        title="模态框"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        header-style="text-align:center"
      >
        <template #header> 上传头像 </template>
        <template #default>
          <n-upload
            action="http://43.138.77.8:8000/api/upload"
            :max="1"
            :default-upload="false"
            ref="uploadFile"
            @change="handleChange"
            @finish="handleUploadFinish"
          >
            <n-upload-dragger>
              <div style="margin-bottom: 12px">
                <n-icon size="48" :depth="3">
                  <CameraOutlined />
                </n-icon>
              </div>
              <n-text style="font-size: 16px"> 点击或者拖动文件到该区域来上传 </n-text>
            </n-upload-dragger>
          </n-upload>
        </template>
        <template #action>
          <n-space justify="center" :size="50">
            <n-button type="info" @click="handleClick">确定</n-button>
            <n-button type="default" @click="closeModel()">取消</n-button>
          </n-space>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, computed, reactive, defineProps, onMounted, h } from 'vue';
import { EditOutlined, CameraOutlined } from '@vicons/antd';
import { getUserInfo, updateUserInfo, updateUserAva } from '@/api/user';
import { useAuthStore } from '@/store/auth';
import { useMessage } from 'naive-ui';
import { complex ,isEmail} from '@/plugins/passVerify.js';
// import type { FormInst, FormRules, FormItemRule, UploadFileInfo } from 'naive-ui';

const { setAvatar } = useAuthStore();
const message = useMessage();
const title = ref('基本信息'); //页面标题
const formRef = ref(null);
const model = ref({
  nickname: '',
  email: '',
  sex: null,
  phone: '',
  username: '',
  summary: '',
  avatar: '',
});

const uploadFile = ref(null);
const fileListLength = ref(0);
const handleChange = (options) => {
  fileListLength.value = options.fileList.length;
};
const handleClick = () => {
  if (fileListLength.value == 0) {
    message.warning('未上传图片！');
    return;
  }
  uploadFile.value?.submit();
};

const handleUploadFinish = ({ file, event }) => {
  let ret = JSON.parse(event.currentTarget.response);
  model.value.avatar = ret.url;
  localStorage.setItem('avatar', ret.url);
  setAvatar(ret.url);
  updateAva();
  return file;
};

const rules = ref({
  nickname: [
    {
      required: true,
      message: '请输入昵称',
      trigger: ['input', 'blur'],
    },
  ],
  email: [
    {
      required: true,
      // message: '请输入新密码',
      trigger: ['input', 'blur'],

      validator(rule, value) {
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

const showModal = ref(false);
const openModel = () => {
  showModal.value = true;
};
const closeModel = () => {
  showModal.value = false;
};

const sexs = ref([
  {
    label: '男',
    value: 1,
  },
  {
    label: '女',
    value: 0,
  },
]);

const getInfo = () => {
  let userID = localStorage.getItem('userID') || '';
  getUserInfo({ userID: userID })
    .then((res) => {
      if (res.data.result == 0) {
        // window.$message.success('创建成功');
        let ret = res.data.data;
        model.value.nickname = ret.nickname;
        model.value.email = ret.email;
        model.value.sex = ret.sex;
        model.value.phone = ret.phone;
        model.value.username = ret.username;
        model.value.summary = ret.summary;
        model.value.avatar = ret.avatar;
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

const updateAva = () => {
  if (checkEmpty(model.value.avatar)) {
    message.warning('头像为空!');
    return;
  }
  updateUserAva({ avatar: model.value.avatar })
    .then((res) => {
      if (res.data.result == 0) {
        window.$message.success('更新成功');
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

const updateInfo = () => {
  if (checkEmpty(model.value.nickname) || checkEmpty(model.value.email)) {
    message.warning('必填字段未填写!');
    return;
  }
  updateUserInfo(model.value)
    .then((res) => {
      if (res.data.result == 0) {
        window.$message.success('更新成功');
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

onMounted(() => {
  getInfo();
});
</script>

<style lang="less" scoped>
#my-content {
  float: left;
  padding: 35px 60px 30px 60px;
}
.n-form-item {
  margin-top: 10px;
}

.imgBox {
  position: relative;
}

.btn {
  position: absolute;
  left: 0px;
  top: 150px;
  border: 2px solid #d9d9d9;
}
</style>
