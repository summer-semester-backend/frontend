<template>
    <div class="logo">
        <router-link :to="props.url">
            <img class="logo-dark" :src="props.darkLogo" alt="Corporate Logo"/>
        </router-link>
    </div>
</template>

<script setup>

const props = defineProps({
    url: {
        type: String,
        default: '/'
    },
    darkLogo: {
        type: String,
        default: function () {
            // return require(`@/assets/images/test/logo.png`);
        }
    }
});
</script>