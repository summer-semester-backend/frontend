<template>
  <div>
    <AmToolbar v-if="engine" :engine="engine" :items="toolbarItems" />
    <div style="margin: 40px 200px" ref="container"></div>
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

onMounted(() => {
  const currentMember = {
    id: 1,
    name: 'collab',
    avatar: 'https://avatars0.githubusercontent.com/u/8186664?s=460&v=4',
  };
  currentMember.id = Math.round(Math.random() * 80 + 20);
  if (container.value) {
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
    ot.connect(`ws://43.138.77.8:8088${currentMember ? '?uid=' + currentMember.id : ''}`, 'demo', 'demo');
    ot.on('ready', (member) => {
      if (member) {
        localStorage.setItem('member', JSON.stringify(member));
      }
    });
    ot.on('message', () => {
      console.log('OT Message');
    });

    engine.value = engineInstance;
  }
});
onUnmounted(() => {
  if (engine.value) engine.value.destroy();
});
</script>
