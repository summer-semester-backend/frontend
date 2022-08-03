<template>
  <UserBar id="userBar"></UserBar>
  <router-view id="view"></router-view>
</template>

<script setup lang="ts"></script>

<style scoped>
#userBar {
  float: left;
  height: 100%;
}

#view {
  width: 100px;
  height: 100px;
  background-color: aquamarine;
  float: left;
}
</style>
