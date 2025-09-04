<script lang="ts" setup>
import { onMounted, ref, nextTick, computed } from "vue";
import { getComments, likeComment, unlikeComment } from "@/api/comment";
import { formatTimeDifference, getAssetsImages } from "@/utils";
import type { CommentListItem } from "../types";
import { getCurrentInstance } from "vue";

defineOptions({
  name: "Comment",
});

const props = defineProps<{ id: number }>();
const instance = getCurrentInstance();

// 主题类名
const themeClass = computed(() => {
  // 这里可以根据实际的主题状态来返回对应的类名
  // 暂时默认返回浅色主题
  return 'theme-light';
});

// 评论展开收起
const isContentOverThreeLines = ref([]);
// 切换展开/收起状态
const toggleExpand = (index: number) => {
  commentList.value[index].isExpanded = !commentList.value[index].isExpanded;
};
// 获取评论数据
const commentList = ref<CommentListItem[]>([]);
const getCommentList = async () => {
  const res = await getComments({
    articleId: Number(props.id),
    pageSize: 30,
    pageNum: 1,
  });
  commentList.value = commentList.value.concat(res.data.list);
  commentList.value.forEach((item) => {
    item.isExpanded = false;
    item.needExpand = false;
    // 添加点赞状态
    item.isLiked = false;
    // item.likeCount = Math.floor(Math.random() * 100); // 模拟点赞数
  });
};

// 检查文本是否需要展开功能
const checkTextOverflow = async () => {
  await nextTick();
  // 获取文本元素的尺寸信息
  const query = uni.createSelectorQuery().in(instance?.proxy);
  query.selectAll(`.comment-content`).boundingClientRect();
  const res = await new Promise<any>((resolve) => {
    query.exec((data) => {
      resolve(data[0]);
    });
  });
  for (let i = 0; i < commentList.value.length; i++) {
    const comment = commentList.value[i];

    try {
      if (res[i]) {
        // 假设每行高度约为 24px（根据实际字体大小调整）
        const lineHeight = 28; // 根据实际字体调整
        const maxHeight = lineHeight * 3; // 三行的高度
        if (res[i].height > maxHeight) {
          comment.needExpand = true;
        }
      }
    } catch (error) {
      console.error("检查文本溢出失败:", error);
    }
  }
};

// 点赞功能
function handleZan(index: number) {
  const comment = commentList.value[index];
  comment.isLiked = !comment.isLiked;
  comment.likeCount = (comment.likeCount || 0) + (comment.isLiked ? 1 : -1);
  if (comment.isLiked) {
    likeComment(comment.id);
  } else {
    unlikeComment(comment.id);
  }

  console.log("点赞状态:", comment.isLiked ? "已点赞" : "取消点赞");
}

onMounted(async () => {
  await getCommentList();
  // 延迟检查文本溢出，确保DOM已渲染
  setTimeout(() => {
    checkTextOverflow();
  }, 200);
});
</script>
<template>
  <view class="comment-list" :class="themeClass">
    <view
      class="comment-item"
      v-for="(item, index) in commentList"
      :key="index"
    >
      <view class="comment-main">
        <view class="comment-avatar">
          <image
            class="comment-avatar-img"
            :src="getAssetsImages('avatar/animal', 'jpg')"
            mode="aspectFit"
          />
        </view>
        <view class="comment-content-wrapper">
          <view class="comment-header">
            <view class="comment-user-info">
              <text class="comment-name">{{ item.userId || "用户昵称" }}</text>
              <text class="comment-vip" v-if="Math.random() > 0.7">VIP</text>
            </view>
            <view class="comment-time">{{
              formatTimeDifference("2025-06-25 12:00:00")
            }}</view>
          </view>
          <view class="text-left">
            <text
              class="comment-content"
              :class="{
                'overflow-hidden': !item.isExpanded && item.needExpand,
              }"
            >
              {{
                item.content
              }}
            </text>
            <text
              v-if="item.needExpand"
              class="expand-button"
              @click="toggleExpand(index)"
            >
              {{ item.isExpanded ? "收起" : "展开" }}
            </text>
          </view>
          <view class="comment-actions">
            <view class="like-section" @tap="handleZan(index)">
              <image
                class="like-icon"
                :src="
                  getAssetsImages(
                    `detail/zan${item.isLiked ? '-actived' : ''}`,
                    'png'
                  )
                "
              />
              <text class="like-count" v-if="(item.likeCount || 0) > 0">{{                item.likeCount || 0
              }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<style lang="scss" scoped>
.comment-list {
  background-color: var(--theme-background);
  color: var(--theme-text);
  padding: 0 32rpx;

  &.theme-light {
    background-color: #ffffff;
    
    .comment-item {
      border-bottom: 1px solid #f0f0f0;
    }
  }

  .comment-item {
    padding: 32rpx 0;
    border-bottom: 1px solid var(--theme-border);

    &:last-child {
      border-bottom: none;
    }

    .comment-main {
      display: flex;
      align-items: flex-start;
      gap: 24rpx;
    }

    .comment-avatar {
      width: 72rpx;
      height: 72rpx;
      border-radius: 50%;
      overflow: hidden;
      flex-shrink: 0;

      .comment-avatar-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .comment-content-wrapper {
      flex: 1;
      min-width: 0;
    }

    .comment-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8rpx;
    }

    .comment-user-info {
      display: flex;
      align-items: center;
      gap: 12rpx;
    }

    .comment-name {
      font-size: 28rpx;
      color: var(--theme-primary);
      font-weight: 600;
    }

    .comment-vip {
      background: linear-gradient(135deg, #ff6b35, #f7931e);
      color: #fff;
      font-size: 20rpx;
      padding: 2rpx 8rpx;
      border-radius: 6rpx;
      font-weight: bold;
    }

    .comment-time {
      font-size: 24rpx;
      color: var(--theme-text-secondary);
    }

    .comment-content {
      font-size: 28rpx;
      color: var(--theme-text);
      text-align: left;
      line-height: 1.6;
      margin-bottom: 16rpx;
      word-break: break-all;
      white-space: pre-line;
    }

    .overflow-hidden {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }

    .expand-button {
      font-size: 24rpx;
      color: var(--theme-primary);
      text-align: left;
      margin-bottom: 16rpx;
      cursor: pointer;
      opacity: 0.8;

      &:hover {
        opacity: 1;
      }
    }

    .comment-actions {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }

    .like-section {
      display: flex;
      align-items: center;
      gap: 8rpx;
      padding: 8rpx 16rpx;
      border-radius: 20rpx;
      background-color: var(--theme-surface);
      cursor: pointer;
      transition: all 0.2s ease;
      border: 1px solid var(--theme-border);

      &:hover {
        background-color: var(--theme-primary-light);
        border-color: var(--theme-primary);
      }

      .like-icon {
        width: 32rpx;
        height: 32rpx;
      }

      .like-count {
        font-size: 24rpx;
        color: var(--theme-text-secondary);
        min-width: 20rpx;
      }
    }
  }
}
</style>
