<template>
  <div class="barBox">
    <div class="head">
      <n-select v-model:value="value" :options="options" style="width: 150px;font-weight: bold;"/>
      <!-- <div class="titleBox">软工小学期</div> -->
      <n-icon size="30" class="icon">
        <MenuOpenRound />
      </n-icon>
    </div>
    
      <n-space vertical>
          <!-- <n-switch v-model:value="collapsed" /> -->
          <n-layout has-sider>
            <!-- <n-layout-sider
              bordered
              collapse-mode="width"
              :collapsed-width="64"
              :width="240"
              :collapsed="collapsed"
              show-trigger
              @collapse="collapsed = true"
              @expand="collapsed = false"
            > -->
            <n-layout>
              <n-menu
                v-model:value="activeKey"
                :collapsed="collapsed"
                :collapsed-width="64"
                :collapsed-icon-size="22"
                :options="menuOptions"
                :icon-size="26"
                style="width: 250px;font-size: 17px;font-weight:bold;"
              />
            </n-layout>
            <!-- </n-layout-sider> -->
            <!-- <n-layout>
              <span>内容</span>
            </n-layout> -->
          </n-layout>
      </n-space>
    
  </div>
</template>

<script setup>
import { defineComponent, h, ref ,computed} from "vue";
import { MenuOpenRound } from '@vicons/material';
import { useRouter , RouterLink} from 'vue-router';

import { NIcon } from "naive-ui";
import { AppstoreAddOutlined ,SettingOutlined} from "@vicons/antd";

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const router = useRouter();
const activeKey = ref(router.currentRoute.value.name);
const collapsed = ref(false);

const value = ref[null];
const options = [
  {
    label: '软工小学期',
    value: 'ssss'
  }
];


const menuOptions = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "TeamProject"
          }
        },
        { default: () => '团队项目' }
      ),
    key: "TeamProject",
    icon: renderIcon(AppstoreAddOutlined)
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "PasswordChange"
          }
        },
        { default: () => '团队设置' }
      ),
    key: "PasswordChange",
    icon: renderIcon(SettingOutlined),
  },
];

</script>

<style lang="less" scoped>
.barBox 
{
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 45px 35px;
  gap: 10px;

  position: relative;
  width: 270px;
  /* height: 754px; */
  height: 100%;

  background: #ffffff;
  border: 1px solid #d9d9d9;

  .head 
  {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    width: 200px;
    height: 35px;

    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;

    padding-bottom: 10px;
    border-bottom: 2px solid #d9d9d9;
    .titleBox
    {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 700;
      font-size: 24px;
      line-height: 29px;
    }
    .icon
    {
      cursor: pointer;
    }
  }

}
</style>
