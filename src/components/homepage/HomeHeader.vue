<template>
  <div style="background: #f5f8fa; border-bottom: 1px solid #d9d9d9">
    <header
      :class="[`rn-header header-default header-not-transparent header-sticky`]"
      style="background: #f5f8fa; border-bottom: 1px solid #d9d9d9"
    >
      <div class="container position-relative">
        <div class="row align-items-center row--0">
          <div class="col-lg-9 col-md-6 col-4 position-static">
            <div class="header-left d-flex">
              <!-- <HomeLogo /> -->
              <div id="logoData">
                <div id="logo"></div>
                <div style="font-size: 28px; color: #0c5464; font-weight: 600">云图</div>
              </div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 col-8">
            <div class="header-right">
              <!-- Start Header Btn -->
              <div class="header-btn" v-if="userID == null">
                <!-- <a :class="data.buyButtonClass" href="#" style="color: white; width: 120px"> </a> -->
                <router-link :class="data.buyButtonClass" to="/login" style="color: white; width: 120px">
                  登录 / 注册
                </router-link>
              </div>
              <n-space v-else align="center" inline>
                <n-avatar
                  @click="$router.push({ name: 'PersonInfo' })"
                  class="shadow-box"
                  circle
                  :src="userInfo.avatar"
                >
                </n-avatar>
                <n-ellipsis style="font-size: 24px; color: black; max-width: 180px; user-select: none">{{
                  userInfo.username
                }}</n-ellipsis>
              </n-space>
              <!-- End Header Btn  -->
            </div>
          </div>
          <!-- </template> -->
        </div>
      </div>
    </header>
  </div>
</template>

<script setup="js">
import AppFunctions from '../../helpers/AppFunctions';
import { ref, onMounted, onBeforeUnmount, onBeforeMount } from 'vue';
import { getUserInfo } from '@/api/user';
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
const userInfo = ref({
  username: '',
  avatar: '',
});
const userID = ref(null);

const readUserInfo = (userID) => {
  getUserInfo({ userID: userID }).then((res) => {
    userInfo.value.username = res.data.data.username;
    userInfo.value.avatar = res.data.data.avatar;
  });
};

const toggleStickyHeader = () => {
  const scrolled = document.documentElement.scrollTop;
  if (scrolled > 100) {
    document.querySelector('.header-default').classList.add('sticky');
  } else if (scrolled <= 100) {
    document.querySelector('.header-default').classList.remove('.header-default');
  }
};

onBeforeMount(() => {
  window.addEventListener('scroll', toggleStickyHeader, true);
});

onMounted(() => {
  if (localStorage.getItem('userID')) {
    userID.value = parseInt(localStorage.getItem('userID'));
    readUserInfo(userID.value);
  } else {
    userID.value = null;
  }
  toggleStickyHeader();
  AppFunctions.toggleClass('body', 'active-light-mode');
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', toggleStickyHeader);
});
</script>

<style scoped src="bootstrap/scss/bootstrap.scss" lang="scss"></style>

<style scoped src="@/assets/scss/style.scss" lang="scss"></style>

<style>
#logo {
  width: 36px;
  height: 32px;
  /* C1 */
  background: url(/resource/logo.png);
}

#logoData {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 15px;
  height: 80px;
}

.shadow-box {
  transition: all 0.5s;
}

.shadow-box:hover {
  cursor: pointer;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
}
</style>
