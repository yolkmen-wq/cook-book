<script setup lang="ts">
import { ref, computed } from 'vue';
import { createArticle } from '@/api/article';
import EmojiPanel from '@/pages/detail/components/emojiPanel.vue';
import UploadPhoto from '@/pages/detail/components/uploadPhoto.vue';
import { TMUPLOAD_PHOTO_INFO } from '@/pages/detail/types';
import { onLoad } from '@dcloudio/uni-app';

defineOptions({
  name: 'PublishPage'
});

// 获取系统信息
const systemInfo = ref<any>({});
const statusBarHeight = ref(0);

// 获取系统状态栏高度
const getSystemInfo = () => {
  const info = uni.getSystemInfoSync();
  systemInfo.value = info;
  statusBarHeight.value = info.statusBarHeight || 0;

  // 获取安全区域信息
  const safeArea = info.safeArea || {};
  const safeAreaInsets = info.safeAreaInsets || {};
  console.log('系统信息:', info);
  console.log('安全区域:', safeArea);
  console.log('安全区域边距:', safeAreaInsets);
};

// 主题类
const themeClass = computed(() => 'theme-light');

// 表单数据
const formData = ref({
  title: '',
  content: '',
  tags: [] as string[]
});

// 控制状态
const showEmojiPanel = ref(false);
const isPublishing = ref(false);

// 图片上传列表
const uploadList = ref<TMUPLOAD_PHOTO_INFO[]>([]);

// 选择表情
const selectEmoji = (emoji: string) => {
  formData.value.content += emoji;
  showEmojiPanel.value = false;
};

// 选择图片
const chooseImage = () => {
  uni.chooseImage({
    count: 9,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const tempFilePaths = res.tempFilePaths;
      tempFilePaths.forEach((filePath, index) => {
        const photoInfo: TMUPLOAD_PHOTO_INFO = {
          id: Date.now() + index + '',
          path: filePath,
          progress: 0,
          statusText: '准备上传',
          status: 0, // NOT uploaded
          response: null
        };
        uploadList.value.push(photoInfo);
        uploadImage(photoInfo);
      });
    },
    fail: (error) => {
      console.error('选择图片失败:', error);
      uni.showToast({
        title: '选择图片失败',
        icon: 'none'
      });
    }
  });
};

// 上传单张图片
const uploadImage = (photoInfo: TMUPLOAD_PHOTO_INFO) => {
  photoInfo.status = 1; // UPLOADING
  photoInfo.statusText = '上传中';

  uni.uploadFile({
    url: 'http://127.0.0.1:7575/app/upload/image',
    filePath: photoInfo.path,
    name: 'file',
    success: (uploadRes) => {
      try {
        const result = JSON.parse(uploadRes.data);
        if (result.success) {
          photoInfo.status = 2; // UPLOAD_SUCCESS
          photoInfo.statusText = '上传成功';
          photoInfo.response = result.data;
        } else {
          photoInfo.status = 3; // UPLOAD_FAILED
          photoInfo.statusText = '上传失败';
        }
      } catch (error) {
        photoInfo.status = 3; // UPLOAD_FAILED
        photoInfo.statusText = '上传失败';
      }
    },
    fail: (error) => {
      photoInfo.status = 3; // UPLOAD_FAILED
      photoInfo.statusText = '上传失败';
      console.error('上传图片失败:', error);
    }
  });
};

// 删除图片
const deleteImage = async (index: number, item: TMUPLOAD_PHOTO_INFO) => {
  uploadList.value.splice(index, 1);
  return true;
};



// 发表文章
const publishArticle = async () => {
  if (!formData.value.title.trim()) {
    uni.showToast({
      title: '请输入标题',
      icon: 'none'
    });
    return;
  }

  if (!formData.value.content.trim()) {
    uni.showToast({
      title: '请输入正文内容',
      icon: 'none'
    });
    return;
  }

  isPublishing.value = true;

  try {
    const articleData = {
      title: formData.value.title,
      content: formData.value.content,
      tags: formData.value.tags
    };

    const res = await createArticle(articleData);

    if (res.success) {
      uni.showToast({
        title: '发表成功',
        icon: 'success'
      });

      // 清空表单
      formData.value = {
        title: '',
        content: '',
        tags: []
      };
      uploadList.value = [];

      // 返回上一页
      setTimeout(() => {
        uni.navigateBack();
      }, 1500);
    } else {
      uni.showToast({
        title: res.message || '发表失败',
        icon: 'none'
      });
    }
  } catch (error) {
    console.error('发表文章失败:', error);
    uni.showToast({
      title: '发表失败',
      icon: 'none'
    });
  } finally {
    isPublishing.value = false;
  }
};

// 返回上一页
const goBack = () => {
  uni.navigateBack();
};

// 页面加载时获取系统信息
onLoad(() => {
  getSystemInfo();
});
</script>

<template>
  <view class="publish-page" :class="themeClass">
    <!-- 状态栏占位 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>

    <!-- 顶部导航 -->
    <view class="header">
      <view class="header-left" @tap="goBack">
        <text class="back-icon">‹</text>
      </view>
      <view class="header-center">
        <text class="header-title">内容</text>
      </view>
      <view class="header-right" @tap="publishArticle">
        <text class="publish-btn" :class="{ disabled: isPublishing }">{{ isPublishing ? '发表中...' : '草稿' }}</text>
      </view>
    </view>

    <!-- 内容区域 -->
    <view class="content-area">
      <!-- 标题输入 -->
      <view class="title-section">
        <textarea class="title-input" v-model="formData.title" placeholder="填写标题" :maxlength="50" :show-count="true"
          auto-height />
      </view>

      <!-- 正文输入 -->
      <view class="content-section">
        <textarea class="content-input" v-model="formData.content" placeholder="添加正文" :maxlength="2000" auto-height />
      </view>



      <!-- 图片上传列表 -->
      <view v-if="uploadList.length > 0" class="upload-section">
        <UploadPhoto :list="uploadList" :column="3" :ok-file-is-delete="true" img-height="200" :round="8"
          :before-del="deleteImage" />
      </view>
    </view>

    <!-- 底部工具栏 -->
    <view class="bottom-toolbar">
      <view class="toolbar-left">
        <!-- 表情按钮 -->
        <view class="tool-item" @tap="showEmojiPanel = !showEmojiPanel">
          <image class="tool-icon" src="/static/images/publish/emoji.svg" />
        </view>

        <!-- @符号 -->
        <view class="tool-item">
          <text class="at-symbol">@</text>
        </view>

        <!-- 图片按钮 -->
        <view class="tool-item" @tap="chooseImage">
          <image class="tool-icon" src="/static/images/publish/image.svg" />
        </view>

        <!-- 设置按钮 -->
        <view class="tool-item">
          <image class="tool-icon" src="/static/images/publish/setting.svg" />
        </view>
      </view>

      <view class="toolbar-right">
        <text class="publish-text" @tap="publishArticle">发布</text>
      </view>
    </view>



    <!-- 表情面板 -->
    <EmojiPanel :show="showEmojiPanel" @select="selectEmoji" />


  </view>
</template>

<style lang="scss" scoped>
.publish-page {
  min-height: 100vh;
  background-color: var(--theme-background);
  color: var(--theme-text);

  &.theme-light {
    background-color: #ffffff;
  }
}

.status-bar {
  width: 100%;
  background-color: var(--theme-background);

  .theme-light & {
    background-color: #ffffff;
  }
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 32rpx;
  background-color: var(--theme-background);
  border-bottom: 1px solid var(--theme-border);

  .header-left {
    width: 80rpx;

    .back-icon {
      font-size: 48rpx;
      color: var(--theme-text);
      font-weight: 300;
    }
  }

  .header-center {
    flex: 1;
    text-align: center;

    .header-title {
      font-size: 32rpx;
      font-weight: 600;
      color: var(--theme-text);
    }
  }

  .header-right {
    width: 80rpx;
    text-align: right;

    .publish-btn {
      font-size: 28rpx;
      color: var(--theme-primary);

      &.disabled {
        opacity: 0.6;
      }
    }
  }
}

.content-area {
  padding: 32rpx;
}

.title-section {
  margin-bottom: 32rpx;

  .title-input {
    width: 100%;
    font-size: 32rpx;
    color: var(--theme-text);
    background: transparent;
    border: none;
    outline: none;
    min-height: 80rpx;

    &::placeholder {
      color: var(--theme-text-secondary);
    }
  }
}

.content-section {
  margin-bottom: 32rpx;

  .content-input {
    width: 100%;
    font-size: 28rpx;
    color: var(--theme-text);
    background: transparent;
    border: none;
    outline: none;
    min-height: 200rpx;
    line-height: 1.6;

    &::placeholder {
      color: var(--theme-text-secondary);
    }
  }
}



.upload-section {
  margin-top: 32rpx;
  padding: 24rpx;
  background-color: var(--theme-surface);
  border-radius: 12rpx;
  border: 1px solid var(--theme-border);
}

.bottom-toolbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 32rpx;
  background-color: var(--theme-background);
  border-top: 1px solid var(--theme-border);

  .toolbar-left {
    display: flex;
    align-items: center;
    gap: 32rpx;

    .tool-item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60rpx;
      height: 60rpx;

      .tool-icon {
        width: 40rpx;
        height: 40rpx;
      }

      .at-symbol {
        font-size: 32rpx;
        color: var(--theme-text);
        font-weight: bold;
      }
    }
  }

  .toolbar-right {
    .publish-text {
      font-size: 24rpx;
      color: var(--theme-primary);
    }
  }
}




</style>