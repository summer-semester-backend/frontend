<template>
  <div style="background-color: #f5f5f5">
    <AmToolbar v-if="engine" :engine="engine" :items="toolbarItems" />
    <n-scrollbar style="max-height: calc(100vh - 105px); width: 100%">
      <div style="height: auto; background-color: white; margin: 40px 200px">
        <div style="padding: 40px 40px; min-height: 150vh" ref="container"></div>
      </div>
    </n-scrollbar>
  </div>
</template>
<script setup lang="ts">
import Engine from '@aomao/engine';
import type { EngineInterface } from '@aomao/engine';
import AmToolbar from '@aomao/toolbar-vue';
import type { GroupItemProps } from '@aomao/toolbar-vue';
import { onMounted, ref, onUnmounted } from 'vue';
import { OTClient } from './ot';
import { cards, plugins, pluginConfig } from './config';
import { onBeforeRouteLeave, useRoute } from 'vue-router';
import { getUserInfo } from '@/api/user';
const container = ref<HTMLDivElement | null>(null);
const engine = ref<EngineInterface | null>(null);
const toolbarItems = ref<GroupItemProps[]>([
  ['collapse'],
  ['undo', 'redo', 'paintformat', 'removeformat'],
  ['heading', 'fontfamily', 'fontsize'],
  ['bold', 'italic', 'strikethrough', 'underline', 'moremark'],
  ['fontcolor', 'backcolor'],
  ['alignment'],
  ['unorderedlist', 'orderedlist', 'tasklist', 'indent', 'line-height'],
  ['link', 'quote', 'hr'],
]);
const fileID = ref<string | null>(null);
const route = useRoute();
const currentMember = ref({
  nickname: '',
  userID: '',
});
const initEditor = () => {
  if (container.value && fileID.value) {
    // 实例化引擎
    const engineInstance = new Engine(container.value, {
      // 启用的插件
      plugins,
      // 启用的卡片
      cards,
      // 所有的卡片配置
      config: pluginConfig,
    });

    // 协同编辑
    const ot = new OTClient(engineInstance);
    ot.connect(
      `ws://43.138.77.8:8088${'?uid=' + currentMember.value.userID + '&uname=' + currentMember.value.nickname}`,
      fileID.value,
      ''
    );
    ot.on('ready', (member) => {
      if (member) {
        localStorage.setItem('member', JSON.stringify(member));
      }
    });
    engine.value = engineInstance;
  } else {
    window.$message.error('文件打开失败，请退出重试');
  }
};

onMounted(() => {
  let useid = localStorage.getItem('userID') || '';
  getUserInfo({ userID: useid })
    .then((res) => {
      if (res.data.result == 0) {
        currentMember.value.nickname = res.data.data.nickname;
        currentMember.value.userID = useid;
        fileID.value = route.params.id.toString();
      }
    })
    .then(() => {
      initEditor();
    });
});
onUnmounted(() => {
  if (engine.value) engine.value.destroy();
});
onBeforeRouteLeave((to, from, next) => {
  if (engine.value) engine.value.destroy();
  next();
});
</script>
