<template>
  <div class="flex flex-col h-screen my-auto items-center">
    <div class="relative flex-center wh-full">
      <n-card :bordered="false" size="large" class="w-100 rounded-10px shadow-sm">
        <n-gradient-text type="primary" class="m-auto" :size="28">项目管理平台</n-gradient-text>
        <main class="pt-24px">
          <div v-if="!showForgetPassword">
            <n-tabs
              size="large"
              animate
              justify-content="space-evenly"
              :value="tabValue"
              @update-value="handleUpdateTab"
            >
              <n-tab-pane name="signin" tab="账户登录">
                <sign-in-form @forget="showForgetPassword = true" />
              </n-tab-pane>
              <n-tab-pane name="signup" tab="账户注册">
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
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
</script>

<style scoped></style>
