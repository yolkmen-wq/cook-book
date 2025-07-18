<template>
  <!-- 模态框遮罩层 -->
  <view 
    v-if="show" 
    class="theme-modal-overlay"
    @click="handleOverlayClick"
  >
    <!-- 模态框主体 -->
    <view 
      class="theme-modal-container"
      @click.stop
    >
      <!-- 关闭按钮 -->
      <view class="theme-modal-close" @click="handleClose">
        <text class="close-icon">✕</text>
      </view>

      <!-- 精简的标题区域 -->
      <view class="theme-modal-header">
        <view class="theme-modal-title">
          <text class="title-emoji">🎨</text>
          <text class="title-text">选择你的专属主题</text>
          <text class="title-emoji">✨</text>
        </view>
      </view>

      <!-- 主题选择区域 -->
      <view
        class="theme-picker"
        :class="[`theme-picker--${direction}`, `theme-picker--${size}`]"
      >
        <view
          class="theme-picker__options"
          :class="`theme-picker__options--${direction}`"
        >
          <view
            v-for="(theme, index) in availableThemes"
            :key="theme.name"
            class="theme-picker__option"
            :class="{
              'theme-picker__option--active': currentTheme === theme.name,
            }"
            :style="{ animationDelay: `${index * 0.1}s` }"
            @click="handleThemeChange(theme.name)"
          >
            <!-- 主题颜色预览球 -->
            <view class="theme-picker__color-container">
              <view
                class="theme-picker__color-preview"
                :style="{ backgroundColor: theme.colors.primary }"
              >
                <!-- 活跃状态的小星星 -->
                <view
                  v-if="currentTheme === theme.name"
                  class="theme-picker__star"
                >
                  ⭐
                </view>
              </view>
              <!-- 彩虹光环效果 -->
              <view
                v-if="currentTheme === theme.name"
                class="theme-picker__glow"
                :style="{ borderColor: theme.colors.primary }"
              ></view>
            </view>

            <!-- 主题标签 -->
            <view class="theme-picker__label-container">
              <text class="theme-picker__option-label">{{ theme.label }}</text>
              <text
                v-if="currentTheme === theme.name"
                class="theme-picker__current-badge"
              >
                当前
              </text>
            </view>

            <!-- 点击波纹效果 -->
            <view class="theme-picker__ripple"></view>
          </view>
        </view>
      </view>

      <!-- 精简的底部装饰 -->
      <view class="theme-modal-footer">
        <view class="footer-decoration">
          <text class="decoration-item">🌈</text>
          <text class="decoration-item">💫</text>
          <text class="decoration-item">🎪</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useTheme, type ThemePickerProps } from "@/utils/theme";

// Props
const props = withDefaults(defineProps<ThemePickerProps>(), {
  showLabel: true,
  size: "medium",
  direction: "horizontal",
  closeOnOverlay: true, // 新增：点击遮罩是否关闭
});

const show = defineModel({ type: Boolean, default: false });

// 定义事件
const emit = defineEmits<{
  close: []
  themeChange: [themeName: string]
}>();

// 使用主题
const { currentTheme, getAvailableThemes, setTheme } = useTheme();

// 计算属性
const availableThemes = computed(() => getAvailableThemes());

// 方法
const handleThemeChange = (themeName: string) => {
  setTheme(themeName);
  emit('themeChange', themeName);

  // 触发反馈
  uni.vibrateShort?.({
    type: "light",
  });

  // 显示提示
  uni.showToast({
    title: `🎉 已切换到${
      availableThemes.value.find((t) => t.name === themeName)?.label
    }主题`,
    icon: "none",
    duration: 2000,
  });
};

// 关闭模态框
const handleClose = () => {
  show.value = false;
  emit('close');
};

// 点击遮罩关闭
const handleOverlayClick = () => {
  if (props.closeOnOverlay) {
    handleClose();
  }
};
</script>

<style lang="scss" scoped>
// 模态框遮罩层
.theme-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8rpx);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
  animation: fadeIn 0.3s ease-out;
}

// 模态框主体
.theme-modal-container {
  position: relative;
  width: 100%;
  max-width: 600rpx;
  max-height: 80vh;
  padding: 40rpx 32rpx 32rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 32rpx;
  overflow: hidden;
  animation: slideInScale 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 24rpx 48rpx rgba(0, 0, 0, 0.2);

  &::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 70%
    );
    animation: rotate 20s linear infinite;
  }
}

// 关闭按钮
.theme-modal-close {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  z-index: 10;
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10rpx);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  .close-icon {
    font-size: 28rpx;
    color: white;
    font-weight: bold;
    line-height: 1;
  }
}

.theme-modal-header {
  text-align: center;
  margin-bottom: 32rpx;
  position: relative;
  z-index: 2;
}

.theme-modal-title {
  display: flex;
  align-items: center;
  justify-content: center;

  .title-emoji {
    font-size: 36rpx;
    animation: bounce 2s ease-in-out infinite;

    &:first-child {
      animation-delay: 0s;
    }

    &:last-child {
      animation-delay: 0.5s;
    }
  }

  .title-text {
    font-size: 32rpx;
    font-weight: bold;
    color: white;
    margin: 0 20rpx;
    text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.3);
  }
}

.theme-picker {
  position: relative;
  z-index: 2;

  &__options {
    display: flex;
    gap: 20rpx;
    justify-content: center;
    flex-wrap: wrap;

    &--horizontal {
      flex-direction: row;
    }

    &--vertical {
      flex-direction: column;
      align-items: center;
    }
  }

  &__option {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20rpx 16rpx;
    border-radius: 20rpx;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10rpx);
    border: 2rpx solid transparent;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    animation: slideInUp 0.6s ease-out both;
    overflow: hidden;
    min-width: 90rpx;

    &:hover {
      transform: translateY(-6rpx) scale(1.03);
      box-shadow: 0 16rpx 32rpx rgba(0, 0, 0, 0.15);
    }

    &--active {
      border-color: #ff6b6b;
      background: rgba(255, 255, 255, 1);
      transform: translateY(-3rpx) scale(1.01);
      box-shadow: 0 12rpx 24rpx rgba(255, 107, 107, 0.25);

      .theme-picker__color-preview {
        animation: pulse 1.5s ease-in-out infinite;
      }
    }
  }

  &__color-container {
    position: relative;
    margin-bottom: 12rpx;
  }

  &__color-preview {
    width: 52rpx;
    height: 52rpx;
    border-radius: 50%;
    border: 3rpx solid white;
    box-shadow: 0 6rpx 12rpx rgba(0, 0, 0, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    position: relative;
    z-index: 2;
  }

  &__star {
    font-size: 22rpx;
    animation: twinkle 1s ease-in-out infinite alternate;
  }

  &__glow {
    position: absolute;
    top: -6rpx;
    left: -6rpx;
    right: -6rpx;
    bottom: -6rpx;
    border: 2rpx solid;
    border-radius: 50%;
    opacity: 0.6;
    animation: glow 2s ease-in-out infinite;
  }

  &__label-container {
    text-align: center;
  }

  &__option-label {
    font-size: 24rpx;
    color: #333;
    font-weight: 600;
    display: block;
    margin-bottom: 4rpx;
    line-height: 1.2;
  }

  &__current-badge {
    font-size: 20rpx;
    color: #ff6b6b;
    background: linear-gradient(45deg, #ff6b6b, #ffa726);
    padding: 4rpx 10rpx;
    border-radius: 10rpx;
    font-weight: bold;
    animation: shimmer 2s ease-in-out infinite;
  }

  &__ripple {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.6) 0%,
      transparent 70%
    );
    transform: translate(-50%, -50%);
    pointer-events: none;
    transition: all 0.6s ease;
  }

  &__option:active &__ripple {
    width: 160rpx;
    height: 160rpx;
  }

  // 尺寸变体
  &--small {
    .theme-picker__color-preview {
      width: 44rpx;
      height: 44rpx;
    }

    .theme-picker__option {
      padding: 16rpx 12rpx;
    }

    .theme-picker__option-label {
      font-size: 22rpx;
    }
  }

  &--large {
    .theme-picker__color-preview {
      width: 60rpx;
      height: 60rpx;
    }

    .theme-picker__option {
      padding: 24rpx 20rpx;
    }

    .theme-picker__option-label {
      font-size: 26rpx;
    }
  }
}

.theme-modal-footer {
  margin-top: 24rpx;
  text-align: center;
  position: relative;
  z-index: 2;
}

.footer-decoration {
  display: flex;
  justify-content: center;
  gap: 24rpx;

  .decoration-item {
    font-size: 28rpx;
    animation: float 3s ease-in-out infinite;

    &:nth-child(1) {
      animation-delay: 0s;
    }
    &:nth-child(2) {
      animation-delay: 1s;
    }
    &:nth-child(3) {
      animation-delay: 2s;
    }
  }
}

// 动画定义
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInScale {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(40rpx);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-8rpx);
  }
  60% {
    transform: translateY(-4rpx);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.08);
  }
}

@keyframes twinkle {
  from {
    transform: scale(1) rotate(0deg);
  }
  to {
    transform: scale(1.15) rotate(180deg);
  }
}

@keyframes glow {
  0%,
  100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.08);
  }
}

@keyframes shimmer {
  0%,
  100% {
    background-position: -200% 0;
  }
  50% {
    background-position: 200% 0;
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0rpx);
  }
  50% {
    transform: translateY(-10rpx);
  }
}

// 方向变体
.theme-picker--vertical {
  .theme-picker__options {
    flex-direction: column;
    align-items: center;
    gap: 16rpx;
  }

  .theme-picker__option {
    flex-direction: row;
    width: 100%;
    max-width: 280rpx;
    padding: 16rpx 20rpx;

    .theme-picker__color-container {
      margin-right: 20rpx;
      margin-bottom: 0;
    }

    .theme-picker__label-container {
      text-align: left;
      flex: 1;
    }
  }
}
</style>
