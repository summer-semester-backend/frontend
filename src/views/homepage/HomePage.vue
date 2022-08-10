<template>
  <HomeLayout header-class="header-left-align" nav-alignment="left">
    <!-- Start Slider Area -->
    <div class="slider-area slider-style-1 variation-default height-850 bg_image" id="img1">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="inner text-center" style="padding-top: 0px">
              <h1
                class="title display-one"
                data-aos="fade-up"
                data-aos-delay="150"
                style="color: #0084a1; font-size: 120px; font-family: 'Inter'; font-weight: 700"
              >
                云 <span>上</span>
              </h1>
              <p
                class="description"
                data-aos="fade-up"
                data-aos-delay="200"
                style="
                  color: #032324;
                  font-size: 64px;
                  font-family: 'Inter';
                  font-weight: 700;
                  text-shadow: 0px 10px 10px rgba(78, 78, 78, 0.25);
                "
              >
                在线一体化协作平台
              </p>
              <router-link
                data-aos="fade-up"
                data-aos-delay="250"
                class="btn-default btn-medium round btn-icon"
                to="/login"
              >
                <div id="buttonTop">
                  <div style="width: 80px; height: 65px">即刻开始</div>
                  <div style="height: 65px; display: flex; align-items: center">
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
    <!-- End Slider Area -->

    <HomeSeparator />

    <!-- Start About Area -->
    <div class="rwt-about-area rn-section-gap">
      <div class="container">
        <div class="row row--30 align-items-center">
          <div class="col-lg-5">
            <div class="thumbnail" data-aos="fade-up" data-aos-delay="250">
              <img class="w-100" src="../../assets/images/about/about-1.png" alt="About Images" />
            </div>
          </div>
          <div class="col-lg-7 mt_md--40 mt_sm--40">
            <div class="content">
              <div class="section-title">
                <h2
                  class="title theme-gradient"
                  data-aos="fade-up"
                  data-aos-delay="280"
                  style="margin: 0 0 20px; font-size: 44px; font-weight: 700"
                >
                  <div>项目介绍</div>
                  <span ref="welcomeMessage"></span>
                </h2>
                <p data-aos="fade-up" data-aos-delay="310" style="margin: 0 0 30px; font-size: 16px">
                  “云上”是本团队开发的一款软工团队协作与管理平台，为校内外中小团队的项目协作开发提供管理服务。
                  该平台用户定位为软工开发团队组织及其成员，具备了完善的团队管理、项目管理等功能，涉及项目产品原型设计、文档共享编辑等。
                  同时，“云上”关注于站在用户的角度，注重用户的隐私性、操作方便性等。
                </p>
                <p data-aos="fade-up" data-aos-delay="340" style="margin: 0 0 30px; font-size: 16px">
                  团队的协作开发通常以项目为单位，Web 项目开发过程通常包含调研需求、需求建模、设计架构、编写代码等步骤。
                  该过程涉及文档编写，设计原型、绘制 UML 等图的步骤，以帮助团队明确需求，且通常以项目文档的形式保存。
                  “云上”为用户提供诸如上述的项目线上协作功能，可概括为管理项目、设计原型、绘制图（UML
                  等）、多人在线编辑文档四大功能。
                </p>
                <div class="read-more-btn mt--40" data-aos="fade-up" data-aos-delay="370">
                  <router-link class="btn-default" to="/about">
                    <span style="color: #fff; font-size: 16px">更多信息</span>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- End About Area -->

    <HomeSeparator />

    <!-- Start Service Area -->
    <div class="rn-service-area rn-section-gap">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <HomeSectionTitle
              text-align="center"
              subtitle="我们能为你做什么"
              title="我们提供的服务"
              description="“云上”包含管理项目、设计原型、绘制图（UML 等）、多人在线编辑文档四大功能"
              data-aos="fade-up"
            />
          </div>
        </div>
        <HomeService service-style="gallery-style" text-align="left" />
      </div>
    </div>

    <HomeSeparator />
  </HomeLayout>
</template>

<script setup>
import Typed from 'typed.js';
import { ArrowRightOutlined } from '@vicons/antd';
import { ref, onMounted } from 'vue';

const options = {
  // typeSpeed: 40,
  strings: ['在线.', '一体化.', '协作平台.'],
  loop: true,
  typeSpeed: 80,
  startDelay: 1000,
  backSpeed: 50,
};
const welcomeMessage = ref(null);
onMounted(() => {
  const typed = new Typed(welcomeMessage.value, options);
});
</script>

<style scoped>
@import 'aos/dist/aos.css';
@import 'animate.css';
#img1 {
  background-image: url('@/assets/images/test/3.png');
}

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
  height: 65px;
  margin: 0px;
  padding: 0px;
}
</style>

<style scoped src="bootstrap/scss/bootstrap.scss" lang="scss"></style>

<style scoped src="@/assets/scss/style.scss" lang="scss"></style>
<!-- <style lang="scss" scoped>
@import '@/assets/scss/style.scss';
</style> -->
