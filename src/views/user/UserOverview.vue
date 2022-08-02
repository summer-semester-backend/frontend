<template>
    <div id="userBar"><UserBar></UserBar></div>
    <div id="personInfo"><PersonInfo></PersonInfo></div>
  
</template>

<script setup>
import UserBar from "../../components/user/UserBar.vue";
// import PasswordChange from "../../components/user/PasswordChange.vue";
import PersonInfo from "../../components/user/PersonInfo.vue";
</script>

<style scoped>
    #userBar
    {
        float: left;
        height: 100%;
    }

    #personInfo
    {
        width: 100px;
        height: 100px;
        background-color: aquamarine;
        float: left;
    }
</style>
