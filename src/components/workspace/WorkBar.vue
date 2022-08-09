<template>
  <div id="workBar">
    <div id="barBox">
      <div id="leftOptions">
        <n-icon style="z-index: 2" size="25" @click="$router.back()">
          <KeyboardArrowLeftOutlined />
        </n-icon>
        <n-image
          object-fit="cover"
          style="border-radius: 10px; width: 50px; height: 50px"
          :src="currentProject.projImage"
          preview-disabled
        />
        <div id="mainArea">
          <div class="topData">
            <div class="topTest">
              {{ currentProject.projName }}
            </div>
            <n-icon size="20" color="#bfbfbf">
              <InformationCircleOutline />
            </n-icon>
          </div>
          <div class="bottomData">
            <n-tabs
              size="large"
              animate
              justify-content="space-evenly"
              :value="tabValue"
              @update-value="handleUpdateTab"
            >
              <n-tab name="doc" :tab="renderDoc" />
              <n-tab name="prototype" :tab="renderPrototype" />
              <n-tab name="uml" :tab="renderUml" />
              <n-tab name="recycleBin" :tab="renderRecycleBin" />
              <!-- <n-tab name="prototype"> 原型 </n-tab>
              <n-tab name="uml"> UML图 </n-tab>
              <n-tab name="recycleBin"> 回收站 </n-tab> -->
            </n-tabs>
          </div>
        </div>
      </div>
      <div id="rightData">
        <n-avatar-group :options="users" :size="35" :max="4" @click="emit('showUsers')" id="avatars">
          <template #avatar="{ option: { name, src } }">
            <n-popover>
              <template #trigger>
                <n-avatar :src="src" />
              </template>
              {{ name }}
            </n-popover>
          </template>
          <template #rest="{ options: restOptions, rest }">
            <n-dropdown :options="createDropdownOptions(restOptions)" placement="top">
              <n-avatar>+{{ rest }}</n-avatar>
            </n-dropdown>
          </template>
        </n-avatar-group>
        <n-button type="primary" size="small" style="font-size: 13px" @click="open"> 邀请 </n-button>
      </div>
    </div>

    <n-modal
      v-model:show="show"
      id="copy"
      preset="dialog"
      title="通过链接邀请成员"
      size="medium"
      positive-text="复制"
      negative-text="取消"
      :data-clipboard-text="code"
      @positive-click="handlePositiveClick"
    >
      <n-divider style="margin: 15px auto" />
      <n-space>
        链接（7天内有效）
        <n-input v-model:value="code" type="text" placeholder="" style="width: 375px" :disabled="true" />
      </n-space>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { KeyboardArrowLeftOutlined } from '@vicons/material';
import { CaretDown, InformationCircleOutline } from '@vicons/ionicons5';
import { ref, h, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { readFile, projectToTeam } from '@/api/file';
import Clipboard from 'clipboard';
import { useMessage } from 'naive-ui';
import { inviteTeamMember } from '@/api/team';

const message = useMessage();

const show = ref(false);
const code = ref('');
const handlePositiveClick = () => {
  var clipboard = new Clipboard('#copy');

  clipboard.on('success', (e) => {
    message.success('复制成功');
    // 释放内存
    clipboard.destroy();
  });
  clipboard.on('error', (e) => {
    // 不支持复制
    message.error('该浏览器不支持自动复制');
    // 释放内存
    clipboard.destroy();
  });
};

function open() {
  inviteTeamMember({ teamID: props.teamID as string }).then((res) => {
    if (res.data.result == 0) {
      code.value = window.location.origin + '/attendTeam/' + res.data.inviteCode;
    }
  });
  show.value = true;
}

const router = useRouter();
const route = useRoute();
const emit = defineEmits(['showUsers']);

const currentProject = ref({
  projName: '',
  projImage: '',
});

const props = defineProps<{ users: Array<any>; teamID: string }>();

const tabValue = ref('doc');

const renderDoc = () => h('div', { style: 'font-size:14px;' }, '文档');
const renderPrototype = () => h('div', { style: 'font-size:14px;' }, '原型');
const renderUml = () => h('div', { style: 'font-size:14px;' }, 'UML图');
const renderRecycleBin = () => h('div', { style: 'font-size:14px;' }, '回收站');

const getProjInfo = (id: number | null) => {
  readFile({ fileID: id, teamID: -1 }).then((res) => {
    if (res.data.result == 0) {
      currentProject.value.projImage = res.data.fileImage;
      currentProject.value.projName = res.data.fileName;
    }
  });
};

const createDropdownOptions = (options: Array<{ name: string; src: string }>) =>
  options.map((option) => ({
    key: option.name,
    label: option.name,
  }));

const handleUpdateTab = (value: string) => {
  tabValue.value = value;
  const projID = parseInt(route.params.ProjID.toString());
  router.replace(`/workspace/${projID}/${value}`);
};
onMounted(() => {
  getProjInfo(parseInt(route.params.ProjID.toString()));
  if (route.fullPath.split('/').length == 4) {
    tabValue.value = route.fullPath.split('/')[3];
    console.log(tabValue.value);
  }
});
</script>

<style scoped lang="less">
#barBox {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0px 35px 0px 20px;
  height: 80px;
  width: 100%;
  border-bottom: 2px solid rgb(240, 240, 240);
}

#leftOptions {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  .n-icon:hover {
    cursor: pointer;
  }
}

#mainArea {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0px;
  height: 80px;
}

.topData {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
  font-weight: 600;
  font-size: 17px;
  padding: 10px 20px 0px;
}

.topTest {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
}

.bottomData {
  font-size: 14px;
  width: 265px;
}

#rightData {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 15px;
  padding-right: 20px;
}

#avatars {
  cursor: pointer;
}
</style>
