<template>
  <div :class="{ 'header-transparent-with-topbar': data.headerTransparency }">
    <header :class="[`rn-header header-default header-not-transparent header-sticky ${data.headerClass}`]">
      <div class="container position-relative">
        <div class="row align-items-center row--0">
          <template>
            <div class="col-lg-9 col-md-6 col-4 position-static">
              <div class="header-left d-flex">
                <HomeLogo />
                <nav class="mainmenu-nav d-none d-lg-block">
                  <!-- Nav -->
                  <ul class="mainmenu">
                    <li><router-link to="/business-consulting-2">主页</router-link></li>
                    <li><router-link to="/about">关于</router-link></li>
                    <li><router-link to="/contact">联系我们</router-link></li>
                  </ul>
                </nav>
              </div>
            </div>
            <div class="col-lg-3 col-md-6 col-8">
              <div class="header-right">
                <!-- Start Header Btn -->
                <div class="header-btn">
                  <a :class="data.buyButtonClass" href="#"> 登录 / 注册 </a>
                </div>
                <!-- End Header Btn  -->
              </div>
            </div>
          </template>
        </div>
      </div>
    </header>
  </div>
</template>

<script setup="js">
import AppFunctions from '../../helpers/AppFunctions';
import { ref, onMounted, onBeforeUnmount, onBeforeMount } from 'vue';

const data = defineProps({
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
    default: '',
  },
  buyButtonClass: {
    type: String,
    default: 'btn-default btn-small round',
  },
});

const toggleStickyHeader = () => {
  const scrolled = document.documentElement.scrollTop;
  if (scrolled > 100) {
    AppFunctions.addClass('.header-default', 'sticky');
  } else if (scrolled <= 100) {
    AppFunctions.removeClass('.header-default', 'sticky');
  }
};

onBeforeMount(() => {
  window.addEventListener('scroll', toggleStickyHeader);
});

onMounted(() => {
  toggleStickyHeader();
  AppFunctions.toggleClass('body', 'active-light-mode');
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', toggleStickyHeader);
});
</script>
