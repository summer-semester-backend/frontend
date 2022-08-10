<template>
  <div class="rn-back-top" @click="scrollToTop" :class="[visible ? 'd-inline' : 'd-none']">
    <HomeIcon name="chevron-up" :size="27" />
  </div>
</template>

<script setup="js">
import { ref, onMounted, onBeforeUnmount, onBeforeMount } from 'vue';

const visible = ref(true);

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const toggleVisible = () => {
  const scrolled = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
  console.log(scrolled);
  if (scrolled > 300) {
    visible.value = true;
  } else if (scrolled <= 300) {
    visible.value = false;
  }
};
onBeforeMount(() => {
  console.log('test');
  window.addEventListener('scroll', toggleVisible, true);
});
onMounted(() => {
  console.log('test');
  window.addEventListener('scroll', toggleVisible);
  toggleVisible();
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', toggleVisible);
});
</script>

<style scoped>
@import 'animate.css';
@import 'aos/dist/aos.css';
</style>