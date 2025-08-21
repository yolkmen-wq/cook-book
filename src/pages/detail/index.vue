<script lang="ts" setup>
import { onMounted, ref, computed } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import Content from "./components/content.vue";
import Comment from "./components/comment.vue";
import commentBox from "./components/commentBox.vue";

const tabs = ["正文", "评论"];
const currentTab = ref(0);
const id = ref();

// 设备相关变量
const deviceWidth = ref(0);
const tabWidth = ref(0);
const statusBarHeight = ref(0); // 状态栏高度
const navbarHeight = ref(44); // 导航栏默认高度
const contentHeight = computed(() => {
  // 动态计算内容区域高度
  return `calc(100vh - ${statusBarHeight.value + navbarHeight.value}px)`;
});

// 计算下划线样式
const lineStyle = computed(() => {
  const translateX = tabWidth.value * currentTab.value + tabWidth.value / 2;
  return {
    transform: `translateX(${translateX}px) translateX(-50%)`,
    width: `${tabWidth.value * 0.1}px`,
    transition: "transform 0.3s ease",
  };
});

// 处理tab点击
const handleTabClick = (index: number) => {
  currentTab.value = index;
};

// 处理swiper滑动
const handleSwiperChange = (e: any) => {
  currentTab.value = e.detail.current;
};

// 处理返回按钮
const handleBack = () => {
  uni.navigateBack();
};

onLoad(async (options) => {
  if (options?.id) {
    id.value = options.id;
  }
});

// 初始化设备信息
onMounted(async () => {
  console.log("onMounted");
  const systemInfo = uni.getSystemInfoSync();
  deviceWidth.value = systemInfo.windowWidth;
  tabWidth.value = (deviceWidth.value - 30) / tabs.length; // 根据tab数量均分宽度
  statusBarHeight.value = systemInfo.statusBarHeight || 0;
  // 根据不同平台调整导航栏高度
  const platform = systemInfo.platform.toLowerCase();
  if (platform === "ios") {
    navbarHeight.value = 44; // iOS默认导航栏高度
  } else if (platform === "android") {
    navbarHeight.value = 48; // Android默认导航栏高度
  }

  // 处理特殊机型（如刘海屏）
  if (systemInfo.model.includes("iPhone X") || systemInfo.screenHeight > 800) {
    navbarHeight.value += 4; // 增加额外安全区域
  }
});
</script>
<template>
  <view
    class="container"
    :class="themeClass"
    :style="{ paddingTop: statusBarHeight + 'px' }"
  >
    <!-- 导航栏 -->
    <view
      class="custom-navbar flex flex-row"
      :style="{ height: navbarHeight + 'px' }"
    >
      <up-icon
        name="arrow-left"
        class="nav-icon"
        primary
        @tap="handleBack"
      ></up-icon>
      <view class="custom-navbar-brand flex-1">
        <view class="tabs-wrap flex flex-row">
          <view
            v-for="(tab, index) in tabs"
            :key="index"
            class="tabs-item"
            :class="{ active: currentTab === index }"
            @tap="handleTabClick(index)"
          >
            {{ tab }}
          </view>
          <view class="tabs-line" :style="lineStyle"></view>
        </view>
      </view>
    </view>
    <!-- 滑动内容区域 -->
    <swiper
      class="tab-content"
      :current="currentTab"
      @change="handleSwiperChange"
      :style="{ height: contentHeight }"
    >
      <swiper-item v-for="(tab, index) in tabs" :key="index">
        <scroll-view scroll-y class="content-scroll">
          <slot :name="`tab-${index}`">
            <view class="default-content" v-if="tab === '正文'">
              <tm-button
                color="pink"
                :margin="[10]"
                :shadow="0"
                size="large"
                label="按钮"
              >
              </tm-button>
              <Content :id="id" />
            </view>
            <view class="default-content" v-if="tab === '评论'">
              <Comment :id="id" />
            </view>
          </slot>
        </scroll-view>
      </swiper-item>
    </swiper>
  </view>
  <commentBox :id="id" />
</template>
<style lang="scss" scoped>
.container {
  width: 100%;
  background: $uni-bg-color;
  position: relative;
}

.custom-navbar {
  position: relative;
  align-items: center;
  padding: 0 20rpx;
  box-sizing: border-box;
}

.nav-icon {
  margin-right: 20rpx;
  :deep(.u-icon__icon) {
    color: $uni-text-color !important;
  }
}

.custom-navbar-brand {
  position: relative;
}

.tabs-wrap {
  height: 100%;
  position: relative;
}

.tabs-item {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  color: #666;
  transition: color 0.3s ease;

  &.active {
    color: $uni-text-color;
    font-weight: 500;
  }
}

.tabs-line {
  position: absolute;
  bottom: -20rpx;
  left: 0;
  height: 6rpx;
  background: #ff0000;
  border-radius: 6rpx;
}

.tab-content {
  width: 100%;
}

.content-scroll {
  height: 100%;
}

.default-content {
  padding: 20rpx;
  text-align: center;
  color: #666;
}
</style>
