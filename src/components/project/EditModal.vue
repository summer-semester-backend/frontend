<template>
  <n-modal v-model:show="isEditModalShow" preset="dialog" :show-icon="false" @close="handleCancleClick">
    <template #header> 修改项目信息 </template>
    <template #default>
      <n-form ref="formRef" :rules="rules" :model="projModel" label-placement="left">
        <n-form-item label="项目名称" path="fileName">
          <n-input v-model:value="projModel.fileName" placeholder=""></n-input>
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
              <n-icon size="24" :depth="1">
                <AddSharp />
              </n-icon>
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
import { AddSharp } from '@vicons/ionicons5';
import { editFile } from '@/api/file';
import { teamList } from '@/api/team';
const projModel = ref({
  fileImage: '',
  fileName: '',
  fileID: 0,
  fatherID: null,
  data: null,
});
//传参
const props = withDefaults(defineProps<{ isEditModalShow?: boolean; fileID: number | null; fileName: string }>(), {
  isEditModalShow: false,
  fileID: null,
  fileName: '',
});
const fileImage = ref<string | null>(null);
//传递事件
const emits = defineEmits(['close', 'refresh']);
const formRef = ref<FormInst>();
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
        } else if (value.length > 50) {
          return new Error('不超过10个字');
        }
        return true;
      },
      trigger: ['input', 'blur'],
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
      editFile(projModel.value)
        .then((res) => {
          if (res.data.result == 0) {
            window.$message.success('修改成功');
            projModel.value.fileName = '';
            projModel.value.fileImage = '';
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
  emits('close');
};

const fatherFileID = computed(() => {
  if (props.fileID == null) {
    return null;
  } else {
    return props.fileID;
  }
});

watch(fatherFileID, (val) => {
  if (val != null) {
    projModel.value.fileID = props.fileID || -1;
    projModel.value.fileName = props.fileName;
  }
});
</script>
<style lang="less" scoped></style>
