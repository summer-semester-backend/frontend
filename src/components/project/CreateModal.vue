<template>
  <n-modal v-model:show="isCreateModalShow" preset="dialog" :show-icon="false" @close="handleCancleClick">
    <template #header> 创建项目 </template>
    <template #default>
      <n-form ref="formRef" :rules="rules" :model="projModel" label-placement="left">
        <n-form-item label="项目名称" path="fileName">
          <n-input v-model:value="projModel.fileName" placeholder=""></n-input>
        </n-form-item>
        <n-form-item label="所属团队" path="teamID">
          <n-select
            v-model:value="projModel.teamID"
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
import { ref, computed, reactive, defineProps, onMounted, watch } from 'vue';
import type { FormInst, FormRules, FormItemRule, UploadFileInfo } from 'naive-ui';
import { createFile } from '@/api/file';
import { teamList } from '@/api/team';
//传参
const props = withDefaults(defineProps<{ teamId?: number | null; isCreateModalShow?: boolean }>(), {
  teamId: null,
  isCreateModalShow: false,
});
//传递事件
const emits = defineEmits(['close', 'refresh']);

const projModel = ref<{
  teamID: number | null;
  fileName: string;
  fileType: number;
  fileImage: string;
  fatherID: number;
}>({
  teamID: null,
  fileName: '',
  fileType: 1,
  fileImage: '',
  fatherID: -1,
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
  fileName: [
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
  projModel.value.fileImage = ret.url;
  return file;
};

//创建项目
const handleConfirmClick = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      createFile(projModel.value)
        .then((res) => {
          if (res.data.result == 0) {
            window.$message.success('创建成功');
            projModel.value.fileName = '';
            projModel.value.fileImage = '';
            projModel.value.teamID = null;
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
  projModel.value.fileName = '';
  projModel.value.fileImage = '';
  projModel.value.teamID = null;
  emits('close');
};

//获取团队列表
const getTeamList = () => {
  teamList()
    .then((res) => {
      if (res.data.result == 0) {
        teams.value = res.data.list;
        isTeamList.value = false;
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
  getTeamList();
  if (props.teamId != null) {
    projModel.value.teamID = props.teamId;
    isTeamList.value = true;
  }
});

const fatherTeamID = computed(() => {
  return props.teamId;
});

watch(fatherTeamID, (val) => {
  if (val != null) {
    projModel.value.teamID = props.teamId;
    isTeamList.value = true;
  }
});
</script>
<style lang="less" scoped></style>
