<template>
  <div class="flex flex-col h-screen my-auto items-center bg-login-pattern bg-cover">
    <div class="relative flex-center wh-full">
      <n-card :bordered="false" size="large" class="w-100 rounded-10px shadow-sm">
        <n-gradient-text type="primary" :size="28">待定</n-gradient-text>
        <main class="pt-24px">
          <n-tabs
            class="card-tabs"
            size="large"
            animate
            justify-content="space-evenly"
            :value="tabValue"
            @update-value="handleUpdateTab"
          >
            <n-tab-pane name="signin" tab="账户登录">
              <sign-in-form />
            </n-tab-pane>
            <n-tab-pane name="signup" tab="账户注册">
              <sign-up-form @finish-register="handleFinishRegister" />
            </n-tab-pane>
          </n-tabs>
        </main>
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const tabValue = ref('signin');

const handleFinishRegister = () => {
  tabValue.value = 'signin';
};

const handleUpdateTab = (value: string) => {
  tabValue.value = value;
};
</script>

<style scoped></style>
