<template>
  <TeamBar id="teamBar"></TeamBar>
  <router-view id="view"></router-view> 
</template>

<script setup>

</script>

<style scoped>
    #teamBar
    {
        float: left;
        height: 100%;
    }

    #view
    {
        width: 100px;
        height: 100px;
        background-color: aquamarine;
        float: left;
    }
</style>
