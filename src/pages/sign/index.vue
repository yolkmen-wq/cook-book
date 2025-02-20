<template>
  <view>
    <youlanSignIn
      :integral="integral"
      :isIntegral="isIntegral"
      :checkinDays="checkinDays"
      :already="data"
      type="sign"
      lang="zh"
      @change="signDate"
    />
    <!-- 抽奖弹窗 -->
    <tm-modal v-model:show="signIn" :showFooter="false" height="auto">
      <template #title>
        <view class="modal-title text-size-xl">签到成功</view>
        <view class="modal-subtitle text-size-n" v-if="!isHiding">
          连续签到2天，获得抽奖一次
        </view>
      </template>
      <view class="grid-container" v-if="!isHiding">
        <LuckyGrid
          class="lucky-grid"
          ref="myLucky"
          width="550rpx"
          height="600rpx"
          :blocks="blocks"
          :prizes="prizes"
          :buttons="buttons"
          :defaultStyle="defaultStyle"
          :activeStyle="activeStyle"
          @start="startCallBack"
          @end="endCallBack"
        />
      </view>
      <view class="lucky-result" v-if="isHiding">
        <image
          class="lucky-result-image"
          src="../../static/images/sign/star.png"
        />
        {{ resultText }}
      </view>
    </tm-modal>
  </view>
</template>
<script lang="ts" setup>
import { ref, shallowRef } from "vue";
import random from "random";
import LuckyGrid from "@lucky-canvas/uni/lucky-grid"; // 九宫格
import type { LuckyWheel } from "lucky-canvas/types";
import youlanSignIn from "@/components/youlan-SignIn/youlan-SignIn.vue";

// 九宫格抽奖
const myLucky = shallowRef<LuckyWheel | null>(null);
const resultText = ref("");
const isHiding = ref(false);
const actionImage = ref("../../static/images/sign/bg2.png");

const blocks = [
  {
    imgs: [
      {
        src: "../../static/images/sign/bg.png",
        width: "100%",
        height: "100%",
      },
    ],
  },
];
const prizes = [
  {
    x: 0.1,
    y: 0.2,
    fonts: [{ text: "1积分", top: "40%", fontColor: "rgba(230, 175, 114,1)" }],
    imgs: [
      {
        src: "../../static/images/sign/bg1.png",
        width: "70%",
        height: "70%",
        activeSrc: actionImage.value,
      },
      {
        src: "../../static/images/sign/coin.png",
        width: "136rpx",
        height: "136rpx",
        top: -10,
      },
    ],
  },
  {
    x: 1,
    y: 0.2,

    fonts: [{ text: "2积分", top: "40%", fontColor: "rgba(230, 175, 114,1)" }],
    imgs: [
      {
        src: "../../static/images/sign/bg1.png",
        width: "70%",
        height: "70%",
        activeSrc: actionImage.value,
      },
      {
        src: "../../static/images/sign/coin.png",
        width: "136rpx",
        height: "136rpx",
        top: -10,
      },
    ],
  },
  {
    x: 1.9,
    y: 0.2,
    fonts: [{ text: "3积分", top: "40%", fontColor: "rgba(230, 175, 114,1)" }],
    imgs: [
      {
        src: "../../static/images/sign/bg1.png",
        width: "70%",
        height: "70%",
        activeSrc: actionImage.value,
      },
      {
        src: "../../static/images/sign/coin.png",
        width: "136rpx",
        height: "136rpx",
        top: -10,
      },
    ],
  },
  {
    x: 1.9,
    y: 1.1,
    fonts: [{ text: "4积分", top: "40%", fontColor: "rgba(230, 175, 114,1)" }],
    imgs: [
      {
        src: "../../static/images/sign/bg1.png",
        width: "70%",
        height: "70%",
        activeSrc: actionImage.value,
      },
      {
        src: "../../static/images/sign/coin.png",
        width: "136rpx",
        height: "136rpx",
        top: -10,
      },
    ],
  },
  {
    x: 1.9,
    y: 2,
    fonts: [{ text: "5积分", top: "40%", fontColor: "rgba(230, 175, 114,1)" }],
    imgs: [
      {
        src: "../../static/images/sign/bg1.png",
        width: "70%",
        height: "70%",
        activeSrc: actionImage.value,
      },
      {
        src: "../../static/images/sign/coin.png",
        width: "136rpx",
        height: "136rpx",
        top: -10,
      },
    ],
  },
  {
    x: 1,
    y: 2,
    fonts: [{ text: "6积分", top: "40%", fontColor: "rgba(230, 175, 114,1)" }],
    imgs: [
      {
        src: "../../static/images/sign/bg1.png",
        width: "70%",
        height: "70%",
        activeSrc: actionImage.value,
      },
      {
        src: "../../static/images/sign/coin.png",
        width: "136rpx",
        height: "136rpx",
        top: -10,
      },
    ],
  },
  {
    x: 0.1,
    y: 2,
    fonts: [{ text: "7积分", top: "40%", fontColor: "rgba(230, 175, 114,1)" }],
    imgs: [
      {
        src: "../../static/images/sign/bg1.png",
        width: "70%",
        height: "70%",
        activeSrc: actionImage.value,
      },
      {
        src: "../../static/images/sign/coin.png",
        width: "136rpx",
        height: "136rpx",
        top: -10,
      },
    ],
  },
  {
    x: 0.1,
    y: 1.1,
    fonts: [{ text: "8积分", top: "40%", fontColor: "rgba(230, 175, 114,1)" }],
    imgs: [
      {
        src: "../../static/images/sign/bg1.png",
        width: "70%",
        height: "70%",
        activeSrc: actionImage.value,
      },
      {
        src: "../../static/images/sign/coin.png",
        width: "136rpx",
        height: "136rpx",
        top: -10,
      },
    ],
  },
];
const buttons = [
  {
    x: 1,
    y: 1,
    fonts: [
      { text: "立即抽奖", top: "40%", fontColor: "#f0ff00", fontWeight: 700 },
    ],
    imgs: [
      { src: "../../static/images/sign/bg.png", width: "100%", height: "100%" },
    ],
  },
  {},
];
const activeStyle = {
  background: "transparent",
};

const defaultStyle = {};

// 开始游戏
const startCallBack = () => {
  // 开始游戏
  myLucky.value.play();
  // 假设接口的请求速度是1s
  setTimeout(() => {
    // 停止游戏
    myLucky.value.stop(0);
  }, 1000);
};

// 结束游戏
const endCallBack = (prize: any) => {
  isHiding.value = true;
  // 显示抽奖结果
  resultText.value = "恭喜中奖: " + prize.fonts[0].text;
  // 游戏结束触发 end 回调
  alert("恭喜中奖: " + prize.fonts[0].text);
};

// 签到
const data = ref([]);
const checkinDays = ref(0); // 连续签到天数
const integral = ref(0); // 本次签到获取的积分
const isIntegral = ref(false); // 是否显示签到积分模块
const signIn = ref(false); // 是否签到

// 签到回调
const signDate = (v: string) => {
  // 签到成功后需要更新连续签到的数据
  checkinDays.value = checkinDays.value + 1;
  // 获取随机整数
  const randomInteger = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
  // 模拟获取的积分,这个根据你的实际情况来，如果你没有积分系统，可以忽略这些
  integral.value = randomInteger;
  isIntegral.value = true;
  signIn.value = true;
  console.log(v);
};
</script>
<style lang="scss" scoped>
.grid-container {
  margin-top: 260rpx;
  @keyframes scale {
    0% {
      transform: scale(0);
    }
    25% {
      transform: scale(0.5);
    }
    50% {
      transform: scale(0.75);
    }
    75% {
      transform: scale(1);
    }
    90% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }
}
.modal-title {
  height: 100rpx;
}

.modal-subtitle {
  position: absolute;
  top: 160rpx;
  color: #000000;
  text-align: center;
  white-space: nowrap;
}

.lucky-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 200rpx;
  margin-top: 440rpx;
  &-image {
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 64rpx;
    height: 64rpx;
  }
}

:deep(.tmModalWrapBox) {
  position: relative;
  // padding-top: 350rpx;
  background: url(https://jiudage-image-test.oss-cn-shenzhen.aliyuncs.com/dev/test/1737367302906homo8dffjsd.png)
    no-repeat top/100% 60%;
  .tmModalTitleBox {
    position: absolute;
    top: 50rpx;
    left: 50%;
    transform: translateX(-50%);
    font-size: 42rpx;
    font-weight: bold;
    color: #fff;
  }
}
</style>
