import { createApp } from 'vue';
import { setupNaiveUI, setupAssets } from './plugins';
import AppProvider from './AppProvider.vue';
import router from './router';
import Vue3DraggableResizable from 'vue3-draggable-resizable';
import { createPinia } from 'pinia';
import { setupPrototypeComponents } from './components/prototype/register';

import 'bootstrap/scss/bootstrap.scss';
import 'animate.css';
import 'bootstrap';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './assets/scss/style.scss';
import VueTypedJs from 'vue-typed-js'

async function setupApp() {
  // 引入静态资源
  setupAssets();
  const app = createApp(AppProvider);
  // 按需引入naiveUI
  AOS.init({
    duration: 800,
    once: true,
  });
  setupNaiveUI(app);
  setupPrototypeComponents(app);
  // 路由准备就绪后挂载 App
  app.use(VueTypedJs);
  app.use(router).use(createPinia()).use(Vue3DraggableResizable).mount('#app');
}

setupApp();
