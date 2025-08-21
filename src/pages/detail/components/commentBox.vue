<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import { getAssetsImages } from "@/utils";
import EmojiPanel from "./emojiPanel.vue";
import { createComment } from "@/api/comment";

defineOptions({
  name: "commentBox",
});

const props = defineProps<{ id: number }>();
const emit = defineEmits

async function onsubmit(e: any) {
  e.preventDefault();
  const res = await createComment({
    articleId: Number(props.id),
    content: form.commentContent,
  });
}
const form = reactive({
  commentContent: "",
});

const isFocused = ref(false); // 是否聚焦

function handleFocus() {
  console.log("聚焦");
  isFocused.value = true;
  showModal.value = true;
}

function handleBlur() {
  console.log("失焦");
  isFocused.value = false;
}

// 弹窗控制
const showModal = ref(false); // 是否显示弹窗

const closeModal = () => {
  console.log("关闭弹窗");
  isFocused.value = false;
  showEmojiPicker.value = false;
  showModal.value = false;
};

// 点赞状态和动画控制
const isLiked = ref(false); // 是否已点赞
const isAnimating = ref(false); // 是否正在播放动画

function handleZan() {
  if (!isAnimating.value) {
    isAnimating.value = true;
    isLiked.value = !isLiked.value; // 切换点赞状态
    console.log("点赞状态:", isLiked.value ? "已点赞" : "取消点赞");

    // 动画持续时间后重置
    setTimeout(() => {
      isAnimating.value = false;
    }, 600); // 动画时长 600ms
  }
}

// 收藏
const isCollected = ref(false); // 是否已收藏

function handleCollect() {
  isCollected.value = !isCollected.value;
  console.log("收藏");
}

// 评论
const isCommented = ref(false); // 是否已评论

function handleComment() {
  isCommented.value = !isCommented.value;
  console.log("评论");
}

// 表情包
const showEmojiPicker = ref(false); // 是否显示表情包

const openEmojiPicker = () => {
  showEmojiPicker.value = !showEmojiPicker.value;
  console.log("打开表情包");
};
const text_1 = ref("");

const onSelect = (emoji: string) => {
  form.commentContent += emoji;
  // text_1.value += emoji.i;
  // form.commentContent = text_1.value;
};

// 图片选择器
const imageList = ref<string[]>([]); // 图片列表

const openImagePicker = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
    sourceType: ["album"], //从相册选择
    success: function (res) {
      console.log(JSON.stringify(res.tempFilePaths));
      const tempFilePaths = Array.isArray(res.tempFilePaths)
        ? res.tempFilePaths
        : [res.tempFilePaths];
      imageList.value = imageList.value.concat(tempFilePaths);
    },
  });
  console.log("打开图片选择器");
};

onMounted(() => {
  console.log("mounted");
});
</script>
<template>
  <view class="modal" @tap="closeModal" v-if="showModal"> </view>
  <view id="commentBox" class="comment-box">
    <view class="comment-edit-box flex-row-center-between">
      <view class="flex-1">
        <up-input
          class="text-36"
          :class="[{ 'mr-10': !isFocused }]"
          :style="{
            width: !isFocused ? '500rpx' : '100%',
            height: !isFocused ? '80rpx' : '140rpx',
            minHeight: '80rpx',
          }"
          placeholder="来说点什么吧~！"
          placeholderStyle="color: #2a2a2c"
          border="none"
          v-model="form.commentContent"
          @focus="handleFocus"
        >
          <template #suffix>
            <view class="flex flex-row-center gap-col-12" v-if="isFocused">
              <image
                class="flex-shrink-0"
                style="width: 32rpx; height: 32rpx"
                :src="getAssetsImages(`detail/emotion-happy-line`, 'png')"
                @tap="openEmojiPicker"
              />
              <image
                class="flex-shrink-0"
                style="width: 32rpx; height: 32rpx"
                :src="getAssetsImages(`detail/image-line`, 'png')"
                @tap="openImagePicker"
              />
              <up-button
                fontColor="#1f1f1f"
                iconColor="#c1c2c4"
                size="mini"
                @tap="onsubmit"
                v-if="form.commentContent"
                >发送</up-button
              >
            </view>
          </template>
        </up-input>
        <view v-if="isFocused" style="color: aliceblue">
          <view v-for="(v, i) in imageList" :key="i">
            <image :src="v" class="image-item" />
          </view>
        </view>
      </view>
      <view class="flex-1 flex flex-row-center gap-col-24" v-if="!isFocused">
        <view class="zan-container">
          <image
            :class="[
              'zan-icon',
              { liked: isLiked, 'star-explode': isAnimating },
            ]"
            style="width: 32rpx; height: 32rpx"
            :src="
              getAssetsImages(`detail/zan${isLiked ? '-actived' : ''}`, 'png')
            "
            @tap="handleZan"
          />
          <view class="zan-num">
            <text class="zan-num-text">{{ isLiked ? "1" : "0" }}</text>
          </view>
        </view>
        <view class="collect-container">
          <image
            :class="['collect-icon', { collected: isCollected }]"
            style="width: 36rpx; height: 32rpx"
            :src="
              getAssetsImages(
                `detail/collect${isCollected ? '-actived' : ''}`,
                'png'
              )
            "
            @tap="handleCollect"
          />
          <view class="collect-num">
            <text class="collect-num-text">{{ isCollected ? "1" : "0" }}</text>
          </view>
        </view>
        <view class="comment-container">
          <image
            :class="['comment-icon']"
            style="width: 36rpx; height: 32rpx"
            :src="getAssetsImages('detail/comment', 'png')"
            @tap="handleComment"
          />
          <view class="comment-num">
            <text class="comment-num-text">{{ isCommented ? "1" : "0" }}</text>
          </view>
        </view>
      </view>
    </view>
    <emoji-panel :show="showEmojiPicker" @select="onSelect" />
  </view>
</template>
<style lang="scss" scoped>
.modal {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
.comment-box {
  position: fixed;
  z-index: 1000;
  left: 0;
  bottom: 0;
  width: 100%;
  padding: 16px;
  box-sizing: border-box;
  background-color: rgba(17, 17, 17, 1);
  .comment-edit-box {
    /* 容器样式 */
    .zan-container {
      position: relative;
      display: inline-block;
      text-align: center;
      color: white;
      /* 点赞图标基础样式 */
      .zan-icon {
        transition: opacity 0.3s ease; /* 平滑透明度变化 */
      }

      /* 未点赞状态 */
      .zan-icon:not(.liked) {
        opacity: 0.7; /* 未点赞时稍暗 */
      }

      /* 已点赞状态 */
      .zan-icon.liked {
        opacity: 1; /* 已点赞时全亮 */
      }

      .zan-num {
        line-height: 24rpx;
      }

      /* 星星爆炸动画 */
      @keyframes starExplode {
        0% {
          transform: scale(1);
          opacity: 1;
        }
        50% {
          transform: scale(1.5); /* 先放大 */
          opacity: 0.8;
          filter: brightness(1.5); /* 增加亮度，模拟闪烁 */
        }
        75% {
          transform: scale(0.8); /* 略微缩小 */
          opacity: 0.5;
        }
        100% {
          transform: scale(1.2); /* 最终稍大状态 */
          opacity: 1;
          filter: brightness(1.2); /* 保持高亮 */
        }
      }

      .star-explode {
        animation: starExplode 0.6s ease forwards; /* 动画时长 600ms */
      }
    }

    .collect-container {
      position: relative;
      display: inline-block;
      text-align: center;
      color: white;

      /* 未收藏状态 */
      .collect-icon:not(.collected) {
        opacity: 0.7; /* 未收藏时稍暗 */
      }

      /* 已收藏状态 */
      .collect-icon.collected {
        opacity: 1; /* 已收藏时全亮 */
      }

      .collect-num {
        line-height: 24rpx;
      }
    }

    .comment-container {
      position: relative;
      display: inline-block;
      text-align: center;
      color: white;

      .comment-icon {
        opacity: 0.7; /* 未收藏时稍暗 */
      }

      .comment-num {
        line-height: 24rpx;
      }
    }
  }
}
</style>
