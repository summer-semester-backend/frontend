<template>
  <main class="page-wrapper">
    <HomeHeader :data="props" />
    <div class="main-content">
      <slot></slot>
    </div>
    <HomeFooter />
  </main>
</template>

<script setup="js">
import { ref } from 'vue';
const props = defineProps({
  logo: {
    type: String,
    default: '',
  },
  topbarStyle: {
    type: Number,
    default: 1,
  },
  showThemeSwitcherButton: {
    type: Boolean,
    default: true,
  },
  headerTransparency: {
    type: Boolean,
    default: false,
  },
  headerClass: {
    type: String,
  },
  buyButtonClass: {
    type: String,
    default: 'btn-default btn-small round',
  },
  navAlignment: {
    type: String,
  },
});
</script>

<style scoped src="bootstrap/scss/bootstrap.scss" lang="scss"></style>

<style scoped src="@/assets/scss/style.scss" lang="scss"></style>
