<template>
  <div>
    <Vue3DraggableResizable :draggable="false" :resizable="false" :init-h="0" :init-w="0" :x="-450" :y="-700">
      <div class="blue-circle bg-[#40a9ff] h-400 w-400 rounded-full"></div>
    </Vue3DraggableResizable>
    <div id="cloud1"></div>
    <div id="cloud2"></div>
    <div id="saly"></div>
    <div id="sun"></div>
    <div id="loginCard">
      <n-card :bordered="false" size="large" class="w-100 rounded-md shadow-md">
        <div id="loginTitle">
          <n-image :src="logo" preview-disabled></n-image>
          <div>云图</div>
        </div>
        <main class="pt-24px">
          <div v-if="!showForgetPassword">
            <n-tabs
              size="large"
              animate
              justify-content="space-evenly"
              :value="tabValue"
              @update-value="handleUpdateTab"
            >
              <n-tab-pane name="signin" :tab="renderSignInTabPane">
                <sign-in-form @forget="showForgetPassword = true" />
              </n-tab-pane>
              <n-tab-pane name="signup" :tab="renderSignUpTabPane">
                <sign-up-form @finish-register="handleFinishRegister" />
              </n-tab-pane>
            </n-tabs>
          </div>
          <div v-else>
            <forget-form @finish-forget="handleFinishForget" />
          </div>
        </main>
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, h, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Vue3DraggableResizable from 'vue3-draggable-resizable';
import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css';
import logo from '/resource/logo2.png';

const router = useRouter();
const tabValue = ref('signin');
const showForgetPassword = ref(false);
const handleFinishRegister = () => {
  tabValue.value = 'signin';
};

const handleFinishForget = () => {
  showForgetPassword.value = false;
  tabValue.value = 'signin';
};

const handleUpdateTab = (value: string) => {
  tabValue.value = value;
};

const renderSignInTabPane = () => h('div', { style: 'font-weight: bold;' }, '登录');
const renderSignUpTabPane = () => h('div', { style: 'font-weight: bold;' }, '注册');

onMounted(() => {
  if (localStorage.getItem('token')) {
    router.push({ name: 'ProjectDesktop' });
  }
});
</script>

<style scoped>
#cloud1 {
  /* C1 */
  position: absolute;
  width: 702px;
  height: 622.81px;
  left: -254px;
  top: 500px;
  background: url(/resource/C1.png);
}

#cloud2 {
  /* C2 */
  position: absolute;
  width: 286px;
  height: 264.88px;
  left: 47%;
  top: -70px;
  background: url(/resource/C2.png);
}

#saly {
  /* Saly-1 */

  position: absolute;
  width: 578px;
  height: 578px;
  left: 20%;
  top: 15%;

  background: url(/resource/Saly.png);
}

#sun {
  /* Icon */

  position: absolute;
  width: 400px;
  height: 300px;
  left: 97px;
  top: 50px;

  background: url(/resource/Icon.png);
}

#loginCard {
  display: flex;
  align-items: center;
  justify-self: center;
  position: absolute;
  height: 100%;
  right: 10%;
}

#loginTitle {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 9px 10px;
  gap: 15px;
  font-size: 24px;
  font-weight: 700;
  /* color: #128cef; */
}
</style>
