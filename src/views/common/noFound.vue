<template>
  <div id="content">
    <Vue3DraggableResizable :draggable="false" :resizable="false" :init-h="0" :init-w="0" :x="738" :y="72">
      <div class="blue-circle bg-[#40a9ff] h-250 w-250 rounded-full"></div>
    </Vue3DraggableResizable>
    <div id="cloud1"></div>
    <div id="cloud2"></div>
    <div id="saly"></div>
    <div id="text">
      <div id="title">404 Error</div>
      <div id="mainText">
        抱歉。你要找的页面不存在，
        <a id="link" @click="back"><u>点击返回</u></a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import Vue3DraggableResizable from 'vue3-draggable-resizable';
import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css';

const router = useRouter();
const back = () => {
  if (localStorage.getItem('token')) {
    router.push({ name: 'ProjectDesktop' });
  } else {
    router.push({ name: 'login' });
  }
};
</script>

<style scoped>
#cloud1 {
  /* C1 */
  position: absolute;
  width: 1062px;
  height: 900px;
  left: 70%;
  top: 15%;
  background: url(/resource/C3.png);
}

#cloud2 {
  /* C2 */
  position: absolute;
  width: 1062px;
  height: 900px;
  left: 37%;
  top: 45%;
  background: url(/resource/C4.png);
}

#saly {
  /* Saly-2 */

  position: absolute;
  width: 473px;
  height: 423px;
  left: 50%;
  top: 25%;

  background: url(/resource/Saly2.png);
}

#text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0px;
  gap: 20px;

  position: absolute;
  width: 450px;
  height: 100%;

  left: 170px;
}

#title {
  width: 231px;
  height: 59px;

  /* font-family: 'Inter'; */
  font-style: normal;
  font-weight: 700;
  font-size: 49px;
  line-height: 59px;
}

#mainText {
  width: 450px;
  height: 29px;

  /* font-family: 'Inter'; */
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 35px;
}

#mainText a {
  color: #8284aa;
}
a:hover {
  cursor: pointer;
}
</style>
