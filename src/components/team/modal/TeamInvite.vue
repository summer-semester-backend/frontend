<template>
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
</template>

<script setup lang="ts">
import { inviteTeamMember } from '@/api/team';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import Clipboard from 'clipboard';
import { useMessage } from 'naive-ui';

const route = useRoute();
const code = ref('');
const show = ref(false);
const message = useMessage();

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
  // if (navigator.clipboard && window.isSecureContext) {
  //   // navigator clipboard 向剪贴板写文本
  //   return navigator.clipboard.writeText(code.value);
  // } else {
  //   // 创建text area
  //   let textArea = document.createElement('textarea');
  //   textArea.value = code.value;
  //   // 使text area不在viewport，同时设置不可见
  //   textArea.style.position = 'absolute';
  //   textArea.style.opacity = '0';
  //   textArea.style.left = '-999999px';
  //   textArea.style.top = '-999999px';
  //   document.body.appendChild(textArea);
  //   textArea.focus();
  //   textArea.select();
  //   // 执行复制命令并移除文本框
  //   document.execCommand('copy');
  //   textArea.remove();
  // }
  // navigator.clipboard.writeText(code.value);
};

function open() {
  inviteTeamMember({ teamID: route.params.teamID as string }).then((res) => {
    if (res.data.result == 0) {
      code.value = window.location.origin + '/attendTeam/' + res.data.inviteCode;
    }
  });
  show.value = true;
}

defineExpose({ open });
</script>
