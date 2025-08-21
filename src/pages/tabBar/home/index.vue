
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import eSwiper from "@/components/e-swiper/e-swiper.vue";
import dayjs from "dayjs";
import {
  getArticles,
  getCarousels,
  getArticlesByCategory,
  getCategories,
  getLatestArticles,
} from "@/api/article";
import type {
  ArticleListItem,
  BannerListItem,
  CategoryListItem,
} from "./types";

const globalAppSettings = ref({});
const keywords = ref("");
const statusBarHeight = ref(0); // 状态栏高度

const getGlobalAppSettings = () => {
  // TODO: get global app settings from server
  globalAppSettings.value = {
    banner: {
      dotPosition: "right",
      useDot: true,
    },
  };
};

// 轮播图
const bannerList = ref<BannerListItem[]>([]);
const fnOnBannerClick = (item: BannerListItem) => {
  console.log(item);
  uni.navigateTo({
    url: "/pages/detail/index?id=" + item.keyWord,
  });
};

const getBannerList = async () => {
  // TODO: get banner list from server
  const res = await getCarousels(0);
  const list = res.data;
  bannerList.value = list.map((v) => {
    return {
      image: v.imageUrl,
      bannerId: v.id,
      keyWord: v.keyWord,
    };
  });
};

// 精品分类
const categoryList = ref<CategoryListItem[]>([]);
const getCategoryList = async () => {
  // TODO: get category list from server
  const res = await getCategories();
  const { list } = res.data;
  categoryList.value = list;
};

// 最新文章
const latestList = ref<ArticleListItem[]>([]);
const getLatestList = async () => {
  // TODO: get latest list from server
  const res = await getLatestArticles();
  const { list } = res.data;
  latestList.value = list;
};

// 获取文章列表
const articleList = ref<ArticleListItem[]>([]);
const getArticleList = () => {
  getArticles().then((res) => {
    const { list } = res.data;
    articleList.value = list;
  });
};

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync();
  const menuButtonInfo = uni.getMenuButtonBoundingClientRect();
  console.log(178, systemInfo, menuButtonInfo);
  statusBarHeight.value =
    systemInfo.statusBarHeight !== undefined &&
    menuButtonInfo.height !== undefined
      ? systemInfo.statusBarHeight + menuButtonInfo.height
      : 0;

  // get banner list
  getBannerList();
  // get global app settings
  getGlobalAppSettings();
  // get category list
  getCategoryList();
  // get latest list
  getLatestList();

  getArticleList();
});
</script>
<template>
  <!-- #ifdef MP -->
  <view
    class="home-page"
    :class="themeClass"
    :style="{ paddingTop: statusBarHeight + 'px' }"
  >
    <!-- #endif -->
  <!-- #ifndef MP -->
  <view
    class="home-page"
    :style="{ paddingTop: statusBarHeight + 'px' }"
  >
  <!-- #endif -->
    <view
      class="page-head center flex justify-start items-center flex-row-center-start"
    >
      <image class="avatar" src="../../../static/images/avatar/animal4.jpg" />
      <up-search class="search-input" placeholder="请输入搜索关键词" v-model="keywords"> </up-search>
    </view>
    <view class="page-body">
      <!-- 推荐列表 -->
      <view class="recommend-list">
        <view
          class="recommend-item bg-white mt-12 mb-12 round-3"
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
        <view class="flex-row-center-between mb-16">
          <view class="sub-title">精品分类</view>
          <image
            class="arrow-icon"
            src="../../../static/images/home/arrow.png"
          />
        </view>
        <scroll-view class="category-scroll" scroll-x="true" scroll-left="120">
          <view class="flex">
            <view
              class="category-item"
              v-for="(item, index) in categoryList"
              :key="index"
            >
              <image class="category-cover" :src="item.categoryPic" />
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
        <view class="flex-row-center-between mb-16">
          <view class="sub-title">最新文章</view>
          <image
            class="arrow-icon"
            src="../../../static/images/home/arrow.png"
          />
        </view>
        <up-card
          class="latest-item"
          v-for="(item, index) in latestList"
          :key="index"
          :head-border-bottom="false"
          margin="30rpx 0"
        >
          <template #body>
            <view class="latest-item-content">
              <image class="latest-item-cover" :src="item.coverImage" />
              <view>
                <view class="latest-item-title text-36 font-bold">
                  {{ item.title }}
                </view>
                <view class="latest-item-desc text-24 text-gray">
                  <rich-text :nodes="item.content"></rich-text>
                </view>
                <view class="flex align-center justify-between">
                  <view class="lastest-item-date text-30 text-gray">
                    {{ dayjs(item.createdTime).format("YYYY-MM-DD") }}
                  </view>
                  <view class="lastest-item-count text-30 text-gray">
                    浏览<text class="text-size-g px-4">{{
                      +item.viewsCount
                    }}</text
                    >次
                  </view>
                </view>
              </view>
            </view>
          </template>
        </up-card>
      </view>
    </view>
  </view>
</template>
<style lang="scss" scoped>
.home-page {
  padding: 32rpx;
  background-color: $uni-bg-color;
  .avatar {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    margin-right: 40rpx;
  }

  .search-input {
    :deep(.u-search__action){
      color:$uni-text-color;
    }
  }

  .search-icon {
    width: 40rpx;
    height: 40rpx;
    margin-right: 10rpx;
    margin-left: 10rpx;
  }

  .sub-title {
    color:$uni-text-color;
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
    width: 32rpx;
    height: 32rpx;
  }

  .category-list {
    width: 100%;
    overflow: hidden;
    margin-bottom: 16rpx;

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

    :deep(.tmSheet) {
      width: 100%;
      height: 100%;
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
