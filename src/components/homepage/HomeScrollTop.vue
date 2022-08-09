<template>
    <div class="rn-back-top"
         @click="scrollToTop"
         :class="[visible ? 'd-inline' : 'd-none']">
        <HomeIcon name="chevron-up" size="27"/>
    </div>
</template>

<script setup>
import {ref, onMounted,onBeforeUnmount} from 'vue';

const visible = ref(false);

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 300) {
        visible = true;
    } else if (scrolled <= 300) {
        visible = false;
    }
};

const create = () => {
    window.addEventListener('scroll', toggleVisible);
};

onMounted(() => {
    create();
    toggleVisible();
});

onBeforeUnmount(() => {
    window.removeEventListener('scroll', toggleVisible);
});
</script>