<script lang="ts" setup>
import { onShow } from "@dcloudio/uni-app";
import { ref, onMounted, computed } from "vue";
import { getAssetsImages } from "@/utils";
import loginModal from "./loginModal.vue";
import themeModal from "./themeModal.vue";
import AiAssistant from "@/components/ai-assistant/ai-assistant.vue";
import { useTheme } from "@/utils/theme";
const { themeColors, currentTheme } = useTheme();

// 主题类名
const themeClass = computed(() => {
  return `theme-${currentTheme.value}`;
});
const personalCenterList = ref([
  {
    title: "我的收藏",
    icon: "my/icon_collection",
    url: "/pages/sign/index",
  },
  {
    title: "我的足迹",
    icon: "my/icon_footprint",
    url: "/pages/sign/index",
  },
  {
    title: "发表文章",
    icon: "my/icon_publish",
    url: "/pages/publish/index",
  },
  {
    title: "签到",
    icon: "my/icon_sign",
    url: "/pages/sign/index",
  },
]);
const avatar = ref("");
const currentSize = ref(0);
const isLogin = ref(false);
const isShowModal = ref(false);
const showThemeModal = ref(false);

onMounted(() => {
  const token = uni.getStorageSync("token");
  if (token) {
    isLogin.value = true;
  }
  uni.$on("themeChanged", function (res) {
    console.log(43, res, themeColors); //  为 B 页面传过来的值
  });
});

onShow(() => {
  uni.getStorageInfo({
    success: (res) => {
      console.log("getStorageInfo", res);
      currentSize.value = res.currentSize;
    },
  });
});

// 登录
const login = () => {
  // isShowModal.value = true
  uni.navigateTo({
    url: "/pages/login/index",
  });
};

// 选择头像
const onChooseAvatar = (e: any) => {
  console.log("onChooseAvatar", e);
  avatar.value = e.detail.avatarUrl;
};

// 跳转页面
const toPage = (url: string) => {
  console.log("toPage", url);
  uni.navigateTo({
    url,
  });
};

// 清除缓存
const clearStorage = () => {
  uni.clearStorage();
  currentSize.value = 0;

  uni.showToast({
    title: "清除成功",
    icon: "none",
    duration: 1000,
  });
};
</script>
<template>
  <view :class="themeClass">
    <!-- 页头区域 -->
    <view class="page-head">
      <button
        class="avatar-btn"
        open-type="chooseAvatar"
        @chooseavatar="onChooseAvatar"
        v-if="isLogin"
      >
        <image
          class="avatar"
          :src="avatar || getAssetsImages('avatar/animal', 'jpg')"
        />
      </button>
      <button class="avatar-btn" @tap="login" v-else>
        <image
          class="avatar"
          :src="avatar || getAssetsImages('avatar/animal', 'jpg')"
        />
      </button>
      <view class="username text-size-lg text-white text-weight-b"
        >YolkMen</view
      >
      <view class="brief text-size-n text-white"
        >一个爱凑热闹、喜欢捣鼓前端的博主</view
      >
    </view>
    <!-- 内容区域 -->
    <view class="page-body">
      <!-- 个人中心 -->
      <view class="personal-center">
        <view
          class="personal-center-item"
          v-for="item in personalCenterList"
          :key="item.title"
          @click="toPage(item.url)"
        >
          <image
            class="personal-center-item-icon"
            :src="getAssetsImages(item.icon)"
          />
          <text class="personal-center-item-title text-size-n">{{
            item.title
          }}</text>
        </view>
      </view>
      <!-- 设置中心 -->
      <up-card
        class="setting-center overflow"
        :head-border-bottom="false"
        :padding="['0']"
      >
        <template #body>
          <up-cell
            :bottomBorderInsert="true"
            :card="false"
            isLink
            url="/pages/index/button"
            icon="setting"
            title="个人中心"
          >
            <template #right-icon>
              <image
                class="setting-center-icon"
                src="@/static/images/my/icon_setting.png"
              />
            </template>
          </up-cell>
          <up-cell
            title="意见反馈"
            :bottomBorderInsert="true"
            :card="false"
            isLink
            icon="chat"
          >
            <template #right-icon>
              <image
                class="setting-center-icon"
                src="@/static/images/my/icon_feedback.png"
              />
            </template>
          </up-cell>
          <up-cell
            title="关于程序"
            :bottomBorderInsert="true"
            :card="false"
            isLink
            icon="file-text"
          >
            <template #right-icon>
              <image
                class="setting-center-icon"
                src="@/static/images/my/icon_about.png"
              />
            </template>
          </up-cell>
          <up-cell
            title="更换主题"
            :bottomBorderInsert="true"
            :card="false"
            :show-bottom-border="false"
            isLink
            icon="tags"
            @click="showThemeModal = true"
          >
            <template #right-icon>
              <text class="theme-icon">🎨</text>
            </template>
          </up-cell>
          <up-cell
            :title="'清除缓存(' + currentSize + 'kb)'"
            :bottomBorderInsert="true"
            :card="false"
            :show-bottom-border="false"
            isLink
            icon="trash"
            @click="clearStorage"
          >
            <template #right-icon>
              <image
                class="setting-center-icon"
                src="@/static/images/my/icon_clear.png"
              />
            </template>
          </up-cell>
        </template>
      </up-card>
    </view>
    <!-- 登录弹窗 -->
    <loginModal v-model="isShowModal" />
    <!-- 主题色弹窗 -->
    <themeModal v-model="showThemeModal" />
  </view>
  <AiAssistant />
</template>
<style lang="scss" scoped>
.page-head {
  height: 700rpx;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  background: url(https://jiudage-image-test.oss-cn-shenzhen.aliyuncs.com/dev/test/1737095802561pwfpquojwy_bg.png)
    top/100% 100% no-repeat;

  .avatar-btn {
    padding: 0;
    background-color: transparent;

    &::after {
      border: none !important;
    }

    .avatar {
      width: 150rpx;
      height: 150rpx;
      border-radius: 50%;
    }
  }

  .username {
    line-height: 72rpx;
  }
}

.page-body {
  padding: 16rpx;
  background-color: $uni-bg-color;
  color: #333333;

  .personal-center {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    height: 200rpx;
    padding: 16rpx 0;
    border-radius: 12rpx;
    background-color: #fff;

    &-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      &-icon {
        width: 72rpx;
        height: 72rpx;
      }

      &-title {
        line-height: 48rpx;
      }
    }
  }

  .setting-center {
    margin: 16rpx 0 !important;

    &-icon {
      width: 48rpx;
      height: 48rpx;
    }
  }

  :deep(.u-cell__title-text) {
    color: #333333!important;
  }
}
</style>
