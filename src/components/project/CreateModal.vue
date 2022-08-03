<template>
  <n-modal v-model:show="isCreateModalShow" preset="dialog" :show-icon="false" @close="handleCancleClick">
    <template #header> 创建项目 </template>
    <template #default>
      <n-form ref="formRef" :rules="rules" :model="porjModel" label-placement="left">
        <n-form-item label="项目名称" path="projectName">
          <n-input v-model:value="porjModel.projectName" placeholder=""></n-input>
        </n-form-item>
        <n-form-item label="所属团队" path="teamID">
          <n-select
            v-model:value="porjModel.teamID"
            value-field="teamID"
            label-field="teamName"
            :options="teams"
            placeholder="请选择"
            :disabled="isTeamList"
          />
        </n-form-item>
        <n-form-item label="上传封面&nbsp;&nbsp;">
          <n-upload
            directory-dnd
            action="http://43.138.77.8:8000/api/upload"
            :max="1"
            :with-credentials="true"
            @finish="handleUploadFinish"
            list-type="image-card"
          >
            <n-upload-dragger>
              <div style="margin-bottom: 12px">
                <n-icon size="48" :depth="3">
                  <archive-outline />
                </n-icon>
              </div>
            </n-upload-dragger>
          </n-upload>
        </n-form-item>
      </n-form>
    </template>
    <template #action>
      <n-space>
        <n-button type="primary" @click="handleConfirmClick">确定</n-button>
        <n-button type="default" @click="handleCancleClick">取消</n-button>
      </n-space>
    </template>
    <template #icon> </template>
  </n-modal>
</template>
<script setup lang="ts">
import { ref, computed, reactive, defineProps, onMounted } from 'vue';
import type { FormInst, FormRules, FormItemRule, UploadFileInfo } from 'naive-ui';
import { createProject } from '@/api/project';
import { teamList } from '@/api/team';
//传参
const { teamId = null, isCreateModalShow = false } = defineProps<{
  teamId?: number | null;
  isCreateModalShow?: boolean;
}>();
//传递事件
const emits = defineEmits(['close', 'refresh']);

const porjModel = ref<{ projectName: string; teamID: number | null; projectImage: string }>({
  projectName: '',
  teamID: null,
  projectImage: '',
});
const formRef = ref<FormInst>();
const isTeamList = ref(false);
//团队列表
const teams = ref([
  {
    teamName: 'team1',
    teamID: 1,
  },
  {
    teamName: 'team2',
    teamID: 2,
  },
]);
//表单校验规则
const rules = ref<FormRules>({
  projectName: [
    {
      required: true,
      validator(rule: FormItemRule, value: string) {
        if (!value || value == '') {
          return new Error('请输入项目名称');
        } else if (Number(value) > 50) {
          return new Error('不超过50个字');
        }
        return true;
      },
      trigger: ['input', 'blur'],
    },
  ],
  teamID: [
    {
      required: true,
      message: '请选择团队',
    },
  ],
});
//文件上传完成回调
const handleUploadFinish = ({ file, event }: { file: UploadFileInfo; event?: ProgressEvent }) => {
  let ret = JSON.parse((event?.target as XMLHttpRequest).response);
  porjModel.value.projectImage = ret.url;
  return file;
};

//创建项目
const handleConfirmClick = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      createProject(porjModel.value)
        .then((res) => {
          if (res.data.result == 0) {
            window.$message.success('创建成功');
            porjModel.value.projectName = '';
            porjModel.value.teamID = null;
            porjModel.value.projectImage = '';
            emits('close');
            emits('refresh');
          } else if (res.data.result == 1) {
            window.$message.warning(res.data.message);
          } else if (res.data.result == 2) {
            window.$message.error(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
};

//关闭窗口
const handleCancleClick = () => {
  porjModel.value.projectName = '';
  porjModel.value.teamID = null;
  porjModel.value.projectImage = '';
  emits('close');
};

//获取团队列表
const getTeamList = () => {
  teamList()
    .then((res) => {
      if (res.data.result == 0) {
        teams.value = res.data.list;
        isTeamList.value = true;
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

onMounted(() => {
  if (teamId != null) {
    porjModel.value.teamID = teamId;
    isTeamList.value = true;
  } else {
    getTeamList();
  }
});
</script>
<style lang="less" scoped></style>
