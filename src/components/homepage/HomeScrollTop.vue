<template>
  <div
    class="rn-back-top"
    @click="scrollToTop"
    :class="[visible ? 'd-inline' : 'd-none']"
    style="background: #f5f8fa; box-shadow: 0 2px 8px 0px rgba(0, 0, 0, 0.12)"
  >
    <!-- <HomeIcon name="chevron-up" :size="27" /> -->
    <div id="icon">
      <n-icon size="27" :depth="2">
        <ChevronUpSharp />
      </n-icon>
    </div>
  </div>
</template>

<script setup="js">
import { ref, onMounted, onBeforeUnmount, onBeforeMount } from 'vue';
import { UpOutlined } from '@vicons/antd';
import { ChevronUpSharp } from '@vicons/ionicons5';

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
.rn-back-top:hover {
  box-shadow: 0 2px 12px 0px rgba(0, 0, 0, 0.18);
}

#icon {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}
</style>
<style scoped src="bootstrap/scss/bootstrap.scss" lang="scss"></style>

<style scoped src="@/assets/scss/style.scss" lang="scss"></style>
