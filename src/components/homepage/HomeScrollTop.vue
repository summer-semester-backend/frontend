<template>
  <div class="rn-back-top" @click="scrollToTop" :class="[visible ? 'd-inline' : 'd-none']">
    <HomeIcon name="chevron-up" size="27" />
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
  const scrolled = document.documentElement.scrollTop.value;
  console.log('1233');
  if (scrolled > 300) {
    visible.value = true;
  } else if (scrolled <= 300) {
    visible.value = false;
  }
};
onBeforeMount(() => {
  console.log('test');
  window.addEventListener('scroll', toggleVisible);
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
