<template>
  <view class="app-page">
    <view class="flex-1 mx-n6 round-4 overflow">
      <tm-slider-menu
        v-model="defaultSelected"
        height="100%"
        :list="list"
        slider-bg-color="#efefef"
        :menuSelectedStyle="{
          backgroundColor: '#ffffff',
          borderLeft: 'none',
          fontWeight: 'bold',
        }"
      >
        <template v-slot:default="{ item }">
          <view
            class="sticky t-0 l-0 fulled px-20 white flex flex-row flex-row-center-start text-weight-b"
            style="height: 88rpx; background-color: white"
          >
            <tm-text font-size="32">#{{ item.id }}{{ item.title }}</tm-text>
          </view>
          <view class="px-20 white flex flex-wrap flex-row gap-10">
            <view
              class="flex-shrink flex flex-center"
              style="
                height: 120px;
                width: calc(33% - 20rpx);
                background-color: #f5f5f5;
              "
              v-for="(item2, index2) in 8"
              :key="index2"
            >
              {{ item2 }}
            </view>
          </view>
        </template>
      </tm-slider-menu>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const defaultSelected = ref(2);
const list = ref([
  { id: 1, title: "水果" },
  { id: 2, title: "蔬菜" },
  { id: 3, title: "肉类" },
  { id: 4, title: "海鲜" },
  { id: 5, title: "酒水" },
  { id: 6, title: "饮料" },
  { id: 7, title: "零食" },
  { id: 8, title: "水果" },
  { id: 9, title: "蔬菜" },
  { id: 10, title: "肉类" },
  { id: 11, title: "海鲜" },
  { id: 12, title: "酒水" },
  { id: 13, title: "饮料" },
  { id: 14, title: "零食" },
  { id: 15, title: "水果" },
]);
</script>

<style lang="scss" scoped>
body {
  overflow: hidden;
}
.app-page {
  height: 100vh;
  display: flex;
  padding: 24rpx 0;
  overflow: hidden;
  background-color: rgba(251, 251, 251, 1);
}

.category-title {
  width: 200rpx;
  height: 100vh;
  background-color: rgb(250, 248, 248);
  flex-shrink: 0;
  &-text {
    min-height: 80rpx;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;
    color: rgb(153, 153, 153, 1);
    font-size: 32rpx;
    line-height: 40rpx;
    padding: 15rpx 25rpx 15rpx;
    box-sizing: border-box;
    &-active {
      color: rgba(124, 206, 241, 1);
      background-color: #fff;
      border-left: 8rpx solid rgba(124, 206, 241, 1);
    }
  }
}

.app-page-content {
  height: 100vh;
  padding: 0 12rpx;
  flex: 1 1 auto;
}

.category-card {
  width: 80%;
  height: 200rpx;
  position: relative;
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  border-radius: 12rpx;
  background-color: #ffff;
  box-shadow: 0rpx 2rpx 24rpx rgba(0, 0, 0, 0.1);
  overflow: hidden;
  background-repeat: no-repeat;
  background-size: cover;

  &:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
  }

  image {
    width: 300rpx;
    height: 100%;
    margin-right: 20rpx;
  }
}

.content {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  .article-title {
    width: 320rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .article-cont {
    width: 320rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.load-text {
  width: 100%;
  text-align: center;
}
</style>
