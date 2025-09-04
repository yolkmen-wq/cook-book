<template>
  <view class="test-page" :class="themeClass">
    <!-- 自定义导航栏 -->
    <view class="nav-bar">
      <view class="nav-title">应用控制测试</view>
    </view>
    
    <!-- 当前状态显示 -->
    <view class="status-section">
      <view class="section-title">当前应用状态</view>
      <view class="status-info">
        <view class="status-item">
          <text class="label">展示模式：</text>
          <text class="value" :class="{ 'calculator-mode': isCalculatorMode }">
            {{ displayModeText }}
          </text>
        </view>
        <view class="status-item">
          <text class="label">是否初始化：</text>
          <text class="value">{{ state.isInitialized ? '是' : '否' }}</text>
        </view>
        <view class="status-item">
          <text class="label">是否加载中：</text>
          <text class="value">{{ state.isLoading ? '是' : '否' }}</text>
        </view>
      </view>
    </view>
    
    <!-- 控制按钮 -->
    <view class="control-section">
      <view class="section-title">模式切换测试</view>
      <view class="button-group">
        <button 
          class="test-button normal-mode" 
          @click="setNormalMode"
          :disabled="state.isLoading"
        >
          切换到正常模式
        </button>
        <button 
          class="test-button calculator-mode" 
          @click="setCalculatorMode"
          :disabled="state.isLoading"
        >
          切换到计算器模式
        </button>
      </view>
    </view>
    
    <!-- 接口测试 -->
    <view class="api-section">
      <view class="section-title">接口测试</view>
      <view class="button-group">
        <button 
          class="test-button api-test" 
          @click="handleFetchDisplayMode"
          :disabled="state.isLoading"
        >
          {{ state.isLoading ? '请求中...' : '调用控制接口' }}
        </button>
      </view>
    </view>
    
    <!-- 页面跳转测试 -->
    <view class="navigation-section">
      <view class="section-title">页面跳转测试</view>
      <view class="button-group">
        <button class="test-button nav-test" @click="goToHome">
          跳转到首页
        </button>
        <button class="test-button nav-test" @click="goToCalculator">
          跳转到计算器
        </button>
        <button class="test-button nav-test" @click="goToCategory">
          跳转到分类页
        </button>
      </view>
    </view>
    
    <!-- 说明信息 -->
    <view class="info-section">
      <view class="section-title">功能说明</view>
      <view class="info-text">
        <text>• 正常模式(1)：显示完整应用功能，包括tabBar和所有页面</text>
        <text>• 计算器模式(0)：只显示计算器页面，隐藏tabBar，限制页面访问</text>
        <text>• 路由守卫会自动拦截不允许的页面跳转</text>
        <text>• 应用启动时会根据接口返回值自动跳转到对应页面</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from '@/utils/theme'
import { useAppControl } from '@/utils/appControl'

const { currentTheme } = useTheme()
const { state, getDisplayMode, isNormalMode, isCalculatorMode, fetchDisplayMode, setDisplayMode } = useAppControl()

// 主题类名
const themeClass = computed(() => {
  return `theme-${currentTheme.value.name}`
})

// 展示模式文本
const displayModeText = computed(() => {
  return state.displayMode === 1 ? '正常模式' : '计算器模式'
})

// 设置正常模式
const setNormalMode = () => {
  setDisplayMode(1)
  uni.showToast({
    title: '已切换到正常模式',
    icon: 'success'
  })
}

// 设置计算器模式
const setCalculatorMode = () => {
  setDisplayMode(0)
  uni.showToast({
    title: '已切换到计算器模式',
    icon: 'success'
  })
  // 延迟跳转到计算器页面
  setTimeout(() => {
    uni.reLaunch({
      url: '/pages/calculator/index'
    })
  }, 1500)
}

// 调用控制接口
const handleFetchDisplayMode = async () => {
  try {
    await fetchDisplayMode()
    uni.showToast({
      title: '接口调用成功',
      icon: 'success'
    })
  } catch (error) {
    uni.showToast({
      title: '接口调用失败',
      icon: 'error'
    })
  }
}

// 页面跳转测试
const goToHome = () => {
  uni.navigateTo({
    url: '/pages/tabBar/home/index'
  })
}

const goToCalculator = () => {
  uni.navigateTo({
    url: '/pages/calculator/index'
  })
}

const goToCategory = () => {
  uni.navigateTo({
    url: '/pages/tabBar/category/index'
  })
}
</script>

<style lang="scss" scoped>
.test-page {
  min-height: 100vh;
  background-color: var(--theme-background);
  color: var(--theme-text);
  padding: 0 32rpx 32rpx;
}

.nav-bar {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--theme-primary);
  margin: 0 -32rpx 32rpx;
  
  .nav-title {
    font-size: 36rpx;
    font-weight: 600;
    color: white;
  }
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  margin-bottom: 24rpx;
  color: var(--theme-text);
}

.status-section {
  margin-bottom: 48rpx;
  
  .status-info {
    background-color: var(--theme-card-background, #fff);
    border-radius: 16rpx;
    padding: 32rpx;
    
    .status-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16rpx;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .label {
        font-size: 28rpx;
        color: var(--theme-text-secondary);
      }
      
      .value {
        font-size: 28rpx;
        font-weight: 600;
        color: var(--theme-text);
        
        &.calculator-mode {
          color: #ff6b6b;
        }
      }
    }
  }
}

.control-section,
.api-section,
.navigation-section {
  margin-bottom: 48rpx;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.test-button {
  height: 88rpx;
  border-radius: 16rpx;
  font-size: 28rpx;
  font-weight: 600;
  border: none;
  
  &.normal-mode {
    background-color: #4CAF50;
    color: white;
  }
  
  &.calculator-mode {
    background-color: #ff6b6b;
    color: white;
  }
  
  &.api-test {
    background-color: var(--theme-primary);
    color: white;
  }
  
  &.nav-test {
    background-color: #2196F3;
    color: white;
  }
  
  &:disabled {
    opacity: 0.6;
    background-color: #ccc;
  }
}

.info-section {
  .info-text {
    background-color: var(--theme-card-background, #f5f5f5);
    border-radius: 16rpx;
    padding: 32rpx;
    
    text {
      display: block;
      font-size: 26rpx;
      line-height: 1.6;
      color: var(--theme-text-secondary);
      margin-bottom: 12rpx;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>