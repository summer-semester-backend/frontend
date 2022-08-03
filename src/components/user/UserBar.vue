<template>
    <div class="barBox" v-show="backState">

        <n-drawer
        v-model:show="active"
        :width="270"
        :height="200"
        :placement="placement"
        :trap-focus="false"
        :block-scroll="false"
        to=".barBox"
    >
            <n-drawer-content>

            <template #default>
                <div class="head">
                    <div class="titleBox">我的</div>
                    <n-icon size="30" class="icon" @click="closeBar()">
                        <MenuOpenRound />
                    </n-icon>
                </div>
                <div class="itemBox">
                    <div v-for="item in itemList" :pos="item.id" class="pointBox" @click="clickItem($event,item)">
                        <img :src="item.imgSrc" alt="">
                        <div class="title">{{item.title}}</div>
                    </div>
                </div>
            </template>

            <!-- <template #footer>
            <n-button>Footer</n-button>
            </template> -->

            </n-drawer-content>

        </n-drawer>

    </div>
</template>

<script setup>
import { ref , computed ,watch, onUpdated} from "vue";
import { MenuOpenRound } from '@vicons/material';
import { barState } from '../../store/auth';
import { pxfy } from "seemly";
import {useRouter} from 'vue-router';

const router = useRouter();
const placement = ref("left");

const barstate = barState();
const active = computed(() => barstate.userBar);///////////////
let backState = ref(false);

const closeBar = () => {
    barstate.closeUserBar();////////////////
}

const openBar = () => {
    barstate.openUserBar();///////////////
}

const itemList = ref([///////////////////
    {
        id:0,
        imgSrc: new URL("../../../public/resource/image/Bar/black/Info.svg", import.meta.url).href,
        imgSrcHover: new URL("../../../public/resource/image/Bar/blue/InfoHover.svg", import.meta.url).href,
        title:"基本信息",
        route:"PersonInfo",
    },
    {
        id:1,
        imgSrc: new URL("../../../public/resource/image/Bar/black/Key.svg", import.meta.url).href,
        imgSrcHover: new URL("../../../public/resource/image/Bar/blue/KeyHover.svg", import.meta.url).href,
        title:"修改密码",
        route:"PasswordChange",
    },
])

watch(active,(newValue,oldValue)=>{
    if(newValue == true)
    backState.value = true;
    else
    {
        var item = document.querySelector(".barBox");
        var originWidth = item.offsetWidth;

        var timer = setInterval(function(){
            item.style.width = (item.offsetWidth - originWidth/10) + "px";
        },30);

        setTimeout(function(){
            clearInterval(timer);
            backState.value = false;
            item.style.width = originWidth + "px";
        },150);
    }

},{immediate:false})

// const enterItem = (e,item) => {
//     e.target.querySelector("img").src = item.imgSrcHover;
//     e.target.querySelector(".title").style.color = "#1481FF";
// }

// const leaveItem = (e,item) => {
//     e.target.querySelector("img").src = item.imgSrc;
//     e.target.querySelector(".title").style.color = "#000000";
// }
                    // @mouseenter="enterItem($event,item)"
                    // @mouseleave="leaveItem($event,item)"

const coverColor = (target,item) => {
    var list = document.querySelectorAll(".pointBox");
    for(let i = 0; i < list.length; ++i) 
    {
        list[i].style.backgroundColor = "";
        list[i].querySelector(".title").style.color = "#000000";
        list[i].querySelector("img").src = itemList.value[list[i].getAttribute("pos")].imgSrc;
    }
    
    target.style.backgroundColor = "#E5F0FF";
    target.querySelector(".title").style.color = "#1481FF";
    target.querySelector("img").src = item.imgSrcHover;
}

const clickItem = (e,item) => {
    coverColor(e.currentTarget,item);
    router.push(item.route);
    // console.log(router.currentRoute.value.name);
}

onUpdated(()=>{
    var list = document.querySelectorAll(".pointBox");
    // alert(list.length);
    for(let i = 0; i < list.length; ++i)
    {
        // console.log(itemList.value[list[i].getAttribute("pos")].route , router.currentRoute.value.name)
        if(itemList.value[list[i].getAttribute("pos")].route == router.currentRoute.value.name)
        {
            coverColor(list[i],itemList.value[list[i].getAttribute("pos")]);
            return;
        }
    }
})

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

        background: #FFFFFF;
        border: 1px solid #D9D9D9;

        .head
        {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            padding: 0px;
            gap: 122px;

            width: 200px;
            height: 35px;

            flex: none;
            order: 0;
            align-self: stretch;
            flex-grow: 0;

            border-bottom: 2px solid #D9D9D9;
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

        .itemBox
        {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            padding: 0px;

            width: 200px;
            height: 104px;

            flex: none;
            order: 1;
            flex-grow: 0;
            margin-top: 10px;
        
            .pointBox
            {
                display: flex;
                flex-direction: row;
                align-items: center;
                padding: 12px 10px;
                gap: 10px;

                width: 200px;
                height: 52px;

                cursor: pointer;
                border-radius: 8px;

                flex: none;
                order: 0;
                flex-grow: 0;

                margin-top: 5px;

                img
                {
                    width: 28px;
                    height: 28px;

                    flex: none;
                    order: 0;
                    flex-grow: 0;
                }

                .title
                {
                    width: 142px;
                    height: 19px;

                    font-family: 'Inter';
                    font-style: normal;
                    font-weight: 600;
                    font-size: 16px;
                    line-height: 19px;
                    
                    color: black;

                    flex: none;
                    order: 1;
                    flex-grow: 1;
                }
            }
            .pointBox:hover
            {
                background: #f4f4f4;
                transition: 0.2s;
            }
        }
    }

</style>