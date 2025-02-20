<template>
  <view>
    <!-- 页头区域 -->
    <view class="page-head">
      <button
        class="avatar-btn"
        open-type="chooseAvatar"
        @chooseavatar="onChooseAvatar"
      >
        <image class="avatar" :src="avatar||getAssetsImages('avatar/animal','jpg')" />
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
      <tm-sheet class="setting-center overflow" :padding="['0']">
        <tm-cell
          :bottomBorderInsert="true"
          :card="false"
          url="/pages/index/button"
          icon="stack-line"
          title="个人中心"
        >
          <template #avatar>
            <image
              class="setting-center-icon"
              src="@/static/images/my/icon_setting.png"
            />
          </template>
        </tm-cell>
        <tm-cell
          title="意见反馈"
          :bottomBorderInsert="true"
          :card="false"
          icon="price-tag-3-line"
          label="+￥32"
          label-color="red"
        >
          <template #avatar>
            <image
              class="setting-center-icon"
              src="@/static/images/my/icon_feedback.png"
            />
          </template>
        </tm-cell>
        <tm-cell
          title="关于程序"
          :bottomBorderInsert="true"
          :card="false"
          icon="chat-smile-2-line"
          label="tmx测试"
        >
          <template #avatar>
            <image
              class="setting-center-icon"
              src="@/static/images/my/icon_about.png"
            />
          </template>
        </tm-cell>
        <tm-cell
          title="清除缓存"
          :bottomBorderInsert="true"
          :card="false"
          :show-bottom-border="false"
          icon="calendar-schedule-line"
          :label="currentSize + 'kb'"
          @click="clearStorage"
        >
          <template #avatar>
            <image
              class="setting-center-icon"
              src="@/static/images/my/icon_clear.png"
            />
          </template>
        </tm-cell>
      </tm-sheet>
    </view>
  </view>
</template>
<script lang="ts" setup>
import { onShow } from "@dcloudio/uni-app";
import { ref } from "vue";
import { getAssetsImages } from "@/utils";

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
    url: "/pages/sign/index",
  },
  {
    title: "签到",
    icon: "my/icon_sign",
    url: "/pages/sign/index",
  },
]);
const avatar = ref("");
const currentSize = ref(0);

onShow(() => {
  uni.getStorageInfo({
    success: (res) => {
      console.log("getStorageInfo", res);
      currentSize.value = res.currentSize;
    },
  });
});

// 选择头像
const onChooseAvatar = (e:Event) => {
  console.log("onChooseAvatar", e);
  avatar.value = (e.detail as any).avatarUrl;
};

// 跳转页面
const toPage = (url:string) => {
    console.log("toPage", url);
  uni.navigateTo({
    url,
  });
};

// 清除缓存
const clearStorage = () => {
  uni.clearStorage();
  currentSize.value = 0;
};
console.log(personalCenterList.value);
</script>
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
}
</style>
