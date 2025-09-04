<script lang="ts" setup>
import { onMounted, ref, computed } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { getAssetsImages, formatTimeDifference } from "@/utils";
import { getArticleDetail } from "@/api/article";

defineOptions({
  name: "Content",
});
const props = defineProps<{ id: number }>();

const title = ref("");
const content = ref("");
const author = ref("");
const createdTime = ref("");
const tags = ref([]);

// 主题类名
const themeClass = computed(() => {
  // 这里可以根据实际的主题状态来返回对应的类名
  // 暂时默认返回浅色主题
  return 'theme-light';
});
onMounted(() => {
  getArticleDetail(props.id).then((res) => {
    title.value = res.data.title;
    content.value = res.data.content;
    author.value = res.data.author;
    createdTime.value = res.data.createdTime;
  });
});
</script>
<template>
  <view class="content" :class="themeClass">
    <view class="title">{{ title }}</view>
    <view class="user-info">
      <view class="user-avatar">
        <image class="avatar" :src="getAssetsImages('avatar/animal', 'jpg')" />
      </view>
      <view>
        <view class="user-name">作者：{{ author }}</view>
        <view class="user-time">{{ formatTimeDifference(createdTime) }}</view>
      </view>
    </view>
    <view class="article-tags">标签：{{ tags }}</view>
    <view class="content-text" v-html="content"></view>
  </view>
</template>
<style lang="scss" scoped>
.content {
  background-color: var(--theme-background);
  padding: 32rpx;
  
  &.theme-light {
    background-color: #ffffff;
  }
}

.title {
  color: var(--theme-text);
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 24rpx;
  text-align: left;
  line-height: 1.4;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
  text-align: left;
}

.user-avatar {
  margin-right: 16rpx;
}

.avatar {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
}

.user-name {
  color: var(--theme-text);
  font-size: 28rpx;
  font-weight: 600;
  margin-bottom: 4rpx;
}

.user-time {
  font-size: 24rpx;
  color: var(--theme-text-secondary);
}

.article-tags {
  margin-bottom: 32rpx;
  font-size: 24rpx;
  color: var(--theme-text-secondary);
  text-align: left;
}

.content-text {
  color: var(--theme-text);
  font-size: 30rpx;
  line-height: 1.6;
  text-align: left;
}
</style>
