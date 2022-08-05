<template>
  <div id="workBar">
    <div id="barBox">
      <div id="leftOptions">
        <n-icon size="25">
          <KeyboardArrowLeftOutlined />
        </n-icon>
        <n-image
          width="50"
          style="border-radius: 10px"
          src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
          preview-disabled
        />
        <div id="mainArea">
          <div class="topData">
            <div class="topTest">
              敏捷开发
              <n-icon size="16">
                <CaretDown />
              </n-icon>
            </div>
            <n-icon size="20" color="#bfbfbf">
              <InformationCircleOutline />
            </n-icon>
          </div>
          <div class="bottomData">
            <n-tabs
              size="large"
              animate
              justify-content="space-evenly"
              :value="tabValue"
              @update-value="handleUpdateTab"
            >
              <n-tab name="doc" :tab="renderDoc" />
              <n-tab name="prototype" :tab="renderPrototype" />
              <n-tab name="uml" :tab="renderUml" />
              <!-- <n-tab name="recycleBin" :tab="renderRecycleBin" /> -->
              <!-- <n-tab name="prototype"> 原型 </n-tab>
              <n-tab name="uml"> UML图 </n-tab>
              <n-tab name="recycleBin"> 回收站 </n-tab> -->
            </n-tabs>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { KeyboardArrowLeftOutlined } from '@vicons/material';
import { CaretDown, InformationCircleOutline } from '@vicons/ionicons5';
import { ref, h } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

const tabValue = ref('doc');

const renderDoc = () => h('div', { style: 'font-size:14px;' }, '文档');
const renderPrototype = () => h('div', { style: 'font-size:14px;' }, '原型');
const renderUml = () => h('div', { style: 'font-size:14px;' }, 'UML图');
const renderRecycleBin = () => h('div', { style: 'font-size:14px;' }, '回收站');

const handleUpdateTab = (value: string) => {
  tabValue.value = value;
  router.push(`/workspace/${value}`);
};
</script>

<style scoped>
#barBox {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0px 35px 0px 20px;
  height: 80px;
  width: 100%;
  border-bottom: 2px solid rgb(240, 240, 240);
}

#leftOptions {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

#mainArea {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0px;
  height: 80px;
}

.topData {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
  font-weight: 600;
  font-size: 17px;
  padding: 10px 20px 0px;
}

.topTest {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
}

.bottomData {
  font-size: 14px;
  width: 200px;
}
</style>
