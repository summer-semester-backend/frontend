<template>
  <div class="row row--15 service-wrapper">
    <div class="col-lg-4 col-md-6 col-sm-12 col-12" v-for="(service, index) in serviceList" :key="index">
      <div
        :class="`service ${props.serviceStyle} ${checkTextAlign}`"
        data-aos="fade-up"
        data-aos-delay="70"
        style="background: #f5f8fa"
      >
        <div class="inner">
          <div class="content">
            <h4 class="title">
              <router-link to="/service-details" v-html="service.title" />
            </h4>
            <p class="description" v-html="service.description" style="font-size: 16px" />
          </div>
          <div class="image">
            <n-image
              object-fit="cover"
              style="width: 350px; height: 180px; justify-content: center"
              preview-disabled
              :src="service.image"
              alt="Service Images"
            ></n-image>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup="js">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import img1 from '@/assets/images/test/uml.png';
import img2 from '@/assets/images/test/doc.png';
import img3 from '@/assets/images/test/prototype.png';

const props = defineProps({
  serviceStyle: {
    type: String,
  },
  textAlign: {
    type: String,
    default: 'left',
  },
});

const serviceList = ref([
  {
    image: img3,
    title: '原型设计',
    description: '具有丰富的组件库，支持多人同步编辑，便于与团队成员协同工作。',
  },
  {
    image: img1,
    title: 'UML 图绘制',
    description: '提供了广泛的 UML 绘制模板，云端保存，得以快速理解产品。',
  },
  {
    // image: require('@/assets/images/test/uml.png'),
    image: img2,
    title: '文档编写',
    description: '支持多人同步编辑，自动存储，文件夹功能，是项目协作必不可少到一环。',
  },
]);

const checkTextAlign = computed(() => {
  if (props.textAlign === 'left') return 'text-start';
  else if (props.textAlign === 'center') return 'text-center';
  else if (props.textAlign === 'end') return 'text-end';
  else return '';
});
</script>

<style scoped>
@import 'aos/dist/aos.css';
@import 'animate.css';
</style>
<style scoped src="bootstrap/scss/bootstrap.scss" lang="scss"></style>

<style scoped src="@/assets/scss/style.scss" lang="scss"></style>
