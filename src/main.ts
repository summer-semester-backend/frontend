import { createApp } from 'vue';
import { setupNaiveUI, setupAssets } from './plugins';
import AppProvider from './AppProvider.vue';
import router from './router';
import VueKonva from 'vue-konva';
import { createPinia } from 'pinia';

async function setupApp() {
  // 引入静态资源
  setupAssets();
  const app = createApp(AppProvider);
  // 按需引入naiveUI
  setupNaiveUI(app);
  // 路由准备就绪后挂载 App
  app.use(router).use(createPinia()).use(VueKonva, { prefix: 'Konva' }).mount('#app');
}

setupApp();
