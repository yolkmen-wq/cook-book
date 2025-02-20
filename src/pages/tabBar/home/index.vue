<template>
  <view class="home-page">
    <view class="page-head flex flex-row-center-start">
      <image class="avatar" src="../../../static/images/avatar/animal4.jpg" />
      <tm-input
        class="search-input"
        type="text"
        round="40"
        width="500rpx"
        height="40rpx"
        inputPadding="20"
        placeholder="搜索..."
      >
        <template #leftIcon>
          <image
            class="search-icon"
            src="../../../static/images/home/search.png"
          />
        </template>
      </tm-input>
    </view>
    <view class="page-body">
      <!-- 推荐列表 -->
      <view class="recommend-list">
        <view
          class="recommend-item bg-white mt-12 round-3"
          v-if="bannerList.length !== 0"
        >
          <e-swiper
            :dotPosition="globalAppSettings.banner.dotPosition"
            :autoplay="true"
            :useDot="globalAppSettings.banner.useDot"
            :list="bannerList"
            @on-click="fnOnBannerClick"
          ></e-swiper>
        </view>
      </view>
      <!-- 精品分类 -->
      <view class="category-list">
        <view class="flex-row-center-between mt-16">
          <view class="sub-title">精品分类</view>
          <view class="arrow-icon">
            <image src="../../../static/images/home/arrow.png" />
          </view>
        </view>
        <scroll-view class="category-scroll" scroll-x="true" scroll-left="120">
          <view class="flex">
            <view
              class="category-item"
              v-for="(item, index) in categoryList"
              :key="index"
            >
              <image class="category-cover" :src="item.cover" />
              <view class="category-name pl-16 pr-16 pb-16">{{
                item.name
              }}</view>
              <view class="category-count text-size-n"
                >{{ item.articleNum }}篇</view
              >
            </view>
          </view>
        </scroll-view>
      </view>
      <!-- 最新文章 -->
      <view class="latest-list">
        <view class="flex-row-center-between mt-16">
          <view class="sub-title">最新文章</view>
          <view class="arrow-icon">
            <image src="../../../static/images/home/arrow.png" />
          </view>
        </view>
        <tm-sheet
          class="latest-item"
          v-for="(item, index) in latestList"
          :key="index"
          :margin="[0, 20, 0, 20]"
        >
          <view class="latest-item-content">
            <image class="latest-item-cover" :src="item.cover" />
            <view>
              <view class="latest-item-title text-size-m text-weight-bold">
                {{ item.title }}
              </view>
              <view class="latest-item-desc text-size-s text-gray-dark">
                {{ item.desc }}
              </view>
              <view class="flex-row-center-between">
                <view class="lastest-item-date text-size-s text-gray-dark">
                  {{ item.createTime }}
                </view>
                <view class="lastest-item-count text-size-s text-gray-dark">
                  浏览<text class="text-size-g px-4">{{
                    +item.viewsCount
                  }}</text
                  >次
                </view>
              </view>
            </view>
          </view>
        </tm-sheet>
      </view>
    </view>
  </view>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import eSwiper from "@/components/e-swiper/e-swiper.vue";

const bannerList = ref([]);
const globalAppSettings = ref({});

// 轮播图
const fnOnBannerClick = (index: number) => {
  console.log(`banner ${index} clicked`);
};

const getBannerList = () => {
  // TODO: get banner list from server
  uni.request({
    url: "/data/recomment",
    success: (res) => {
      const { list } = res.data.data;
      bannerList.value = list;
    },
  });
};

const getGlobalAppSettings = () => {
  // TODO: get global app settings from server
  globalAppSettings.value = {
    banner: {
      dotPosition: "right",
      useDot: true,
    },
  };
};

// 精品分类
const categoryList = ref([]);
const getCategoryList = () => {
  // TODO: get category list from server
  uni.request({
    url: "/data/category",
    success: (res) => {
      const { list } = res.data.data;
      categoryList.value = list;
    },
  });
};

// 最新文章
const latestList = ref([]);
const getLatestList = () => {
  // TODO: get latest list from server
  uni.request({
    url: "/data/lastest",
    success: (res) => {
      const { list } = res.data.data;
      latestList.value = list;
    },
  });
};

onMounted(() => {
  // get banner list
  getBannerList();
  // get global app settings
  getGlobalAppSettings();
  // get category list
  getCategoryList();
  // get latest list
  getLatestList();
});
</script>
<style lang="scss" scoped>
.home-page {
  padding: 32rpx;
  .avatar {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    margin-right: 50rpx;
  }
  .search-input {
  }
  .search-icon {
    width: 40rpx;
    height: 40rpx;
    margin-right: 10rpx;
    margin-left: 10rpx;
  }
  .sub-title {
    &::before {
      content: "";
      display: inline-block;
      vertical-align: middle;
      width: 8rpx;
      height: 30rpx;
      border-radius: 10rpx;
      background-color: rgba(34, 149, 232, 1);
      margin-right: 16rpx;
    }
  }
  .arrow-icon {
    image {
      width: 32rpx;
      height: 32rpx;
    }
  }
  .category-list {
    width: 100%;
    overflow: hidden;
    .category-scroll {
      width: 100%;
      .category-item {
        position: relative;
        margin-right: 20rpx;
        background: #fff;
        border-radius: 12rpx;

        .category-cover {
          width: 330rpx;
          height: 180rpx;
          border-radius: 12rpx;
        }
        .category-count {
          position: absolute;
          left: 0;
          top: 140rpx;
          color: rgba(34, 149, 232, 1);
          border-radius: 0 30rpx 0 0;
          background-color: #fff;
          padding-left: 10rpx;
          padding-right: 20rpx;
        }
      }
    }
  }

  .latest-list {
    width: 100%;
    .latest-item {
      width: 100%;
      height: 120rpx;
      background: #fff;
      border-radius: 12rpx;
      margin-bottom: 20rpx;
      .latest-item-content {
        display: flex;
        height: 100%;
        padding: 10rpx;
        .latest-item-cover {
          width: 260rpx;
          height: 200rpx;
          border-radius: 12rpx;
          margin-right: 16rpx;
          flex-shrink: 0;
        }
        .latest-item-title {
          font-size: 32rpx;
          font-weight: bold;
          margin-bottom: 10rpx;
        }
        .latest-item-desc {
          font-size: 28rpx;
          color: #999;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          margin-bottom: 10rpx;
        }
        .lastest-item-date {
          font-size: 28rpx;
          color: #999;
          margin-bottom: 10rpx;
        }
        .lastest-item-count {
          font-size: 28rpx;
          color: #999;
          margin-bottom: 10rpx;
        }
      }
    }
  }
}
</style>
