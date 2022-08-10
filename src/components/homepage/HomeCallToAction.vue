<template>
  <div>
    <div
      :class="`rn-callto-action ${checkStyleType}`"
      :style="{ 'background-image': `url(${props.backgroundImage})` }"
      :data-black-overlay="setOverlay"
    >
      <div class="container">
        <!-- <template> -->
        <div class="row row--0 align-items-center">
          <div class="col-lg-12">
            <div class="inner">
              <div class="content text-center">
                <h2
                  class="title"
                  v-html="props.title"
                  data-aos="fade-up"
                  data-aos-delay="60"
                  style="font-size: 44px; font-weight: 700; margin-bottom: 20px"
                />
                <h6 class="subtitle" v-html="props.subtitle" data-aos="fade-up" data-aos-delay="60" />
                <div class="call-to-btn text-center mt--30" data-aos="fade-up" data-aos-delay="60">
                  <!-- <a class="btn-default btn-icon" href="#">
                    {{ props.btnText }}
                    <HomeIcon name="arrow-right" class="size-20" />
                  </a> -->
                  <router-link class="btn-default btn-icon" to="/login" data-aos="fade-up" data-aos-delay="250">
                    <div id="buttonTop">
                      <div style="width: 80px; height: 50px">即刻开始</div>
                      <div style="height: 50px; display: flex; align-items: center">
                        <n-icon size="20" color="#ffffff">
                          <ArrowRightOutlined />
                        </n-icon>
                      </div>
                    </div>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- </template> -->
      </div>
    </div>
  </div>
</template>

<script setup="js">
import { computed } from 'vue';
import { ArrowRightOutlined } from '@vicons/antd';

const props = defineProps({
  backgroundImage: {
    type: String,
  },
  title: {
    type: String,
  },
  subtitle: {
    type: String,
  },
  btnText: {
    type: String,
  },
  styleType: {
    type: Number,
    default: 8,
  },
});

const checkStyleType = computed(() => {
  if (props.styleType === 1) return 'clltoaction-style-default bg_image bg_image_fixed';
  else if (props.styleType === 2) return 'clltoaction-style-default style-2 bg_image bg_image_fixed';
  else if (props.styleType === 3) return 'clltoaction-style-default style-3 bg_image';
  else if (props.styleType === 4) return 'clltoaction-style-default style-4';
  else if (props.styleType === 5) return 'clltoaction-style-default style-5';
  else if (props.styleType === 6) return 'clltoaction-style-default style-6';
  else if (props.styleType === 7) return 'clltoaction-style-default style-7';
  else if (props.styleType === 8) return 'rn-call-to-action style-8 content-wrapper';
  else return '';
});

const setOverlay = computed(() => {
  if (props.styleType === 1) return 7;
  if (props.styleType === 2) return 8;
});
</script>

<style scoped src="bootstrap/scss/bootstrap.scss" lang="scss"></style>

<style scoped src="@/assets/scss/style.scss" lang="scss"></style>
<style scoped>
#buttonTop {
  font-size: 16px;
  font-weight: 400;
  text-align: center;
  color: white;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50px;
  margin: 0px;
  padding: 0px;
}
</style>

<style scoped>
@import 'aos/dist/aos.css';
@import 'animate.css';
</style>
