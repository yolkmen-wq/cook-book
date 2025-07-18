<script lang="ts" setup>
import { onMounted, ref } from "vue";
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
onMounted(() => {
	console.log(18,props.id)
  getArticleDetail(props.id).then((res) => {
    title.value = res.data.title;
    content.value = res.data.content;
    author.value = res.data.author;
    createdTime.value = res.data.createdTime;
  });
});
</script>
<template>
  <view class="content">
    <view class="title">{{ title }}</view>
    <view class="user-info">
      <view class="user-avatar">
        <image class="avatar" :src="getAssetsImages('avatar/animal', 'jpg')" />
      </view>
      <view>
        <view class="user-name">作者：{{ author }}</view>
        <view class="user-time"
          >{{ formatTimeDifference(createdTime) }}</view
        >
      </view>
    </view>
    <view class="article-tags">标签：{{ tags }}</view>
    <view class="content-text" v-html="content"></view>
  </view>
</template>
<style lang="scss" scoped>
.title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: left;
}
.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  text-align: left;
}
.user-avatar {
  margin-right: 10px;
}
.avatar {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
}
.user-name {
  font-size: 26rpx;
  font-weight: bold;
}
.user-time {
  font-size: 24rpx;
  color: #999;
}
.article-tags {
  margin-bottom: 10px;
  font-size: 24rpx;
  color: #999;
  text-align: left;
}
.content-text {
  font-size: 28rpx;
  line-height: 1.5;
  text-align: left;
}
</style>
