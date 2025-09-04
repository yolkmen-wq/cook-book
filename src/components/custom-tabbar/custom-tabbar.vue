<template>
  <!-- 只在正常模式下显示tabBar -->
  <view 
    v-if="isNormalMode" 
    class="custom-tabbar" 
    :class="themeClass" 
    :style="{ paddingBottom: safeAreaBottom + 'px' }"
  >
    <view class="tabbar-content">
      <view
        v-for="(item, index) in tabList"
        :key="index"
        class="tabbar-item"
        :class="{ active: currentIndex === index }"
        @tap="switchTab(index)"
      >
        <view class="tabbar-icon">
          <image
            v-if="currentIndex === index"
            :src="item.selectedIconPath"
            class="icon-image"
          />
          <image v-else :src="item.iconPath" class="icon-image" />
        </view>
        <view class="tabbar-text" :class="{ active: currentIndex === index }">
          {{ item.text }}
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useTheme } from '@/utils/theme'
import { useAppControl } from '@/utils/appControl'

interface TabItem {
  pagePath: string
  text: string
  iconPath: string
  selectedIconPath: string
}

interface Props {
  current?: number
}

const props = withDefaults(defineProps<Props>(), {
  current: 0
})

const emit = defineEmits<{
  change: [index: number]
}>()

const { currentTheme, themeColors } = useTheme()
const { isNormalMode, isCalculatorMode } = useAppControl()

// 当前选中的tab索引
const currentIndex = ref(props.current)

// 安全区域底部高度
const safeAreaBottom = ref(0)

// 主题类名
const themeClass = computed(() => {
  return `theme-${currentTheme.value}`
})

// tabBar配置
const tabList: TabItem[] = [
  {
    pagePath: 'pages/tabBar/home/index',
    text: '首页',
    iconPath: '/static/images/tabBar/home.png',
    selectedIconPath: '/static/images/tabBar/home-active.png'
  },
  {
    pagePath: 'pages/tabBar/category/index',
    text: '分类',
    iconPath: '/static/images/tabBar/category.png',
    selectedIconPath: '/static/images/tabBar/category-active.png'
  },
  {
    pagePath: 'pages/tabBar/my/index',
    text: '我的',
    iconPath: '/static/images/tabBar/my.png',
    selectedIconPath: '/static/images/tabBar/my-active.png'
  }
]

// 切换tab
const switchTab = (index: number) => {
  if (index === currentIndex.value) return
  
  currentIndex.value = index
  const tabItem = tabList[index]
  
  // 发射change事件
  emit('change', index)
  
  // 跳转页面
  uni.switchTab({
    url: `/${tabItem.pagePath}`
  })
}

// 更新当前选中的tab
const updateCurrent = (index: number) => {
  currentIndex.value = index
}

// 获取系统信息
onMounted(() => {
  const systemInfo = uni.getSystemInfoSync()
  safeAreaBottom.value = systemInfo.safeAreaInsets?.bottom || 0
})

// 暴露方法给父组件
defineExpose({
  updateCurrent
})
</script>

<style lang="scss" scoped>
.custom-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: var(--theme-background);
  border-top: 1px solid var(--theme-border);
  transition: all 0.3s ease;
  
  &.theme-light {
    background-color: #ffffff;
    border-top-color: #e5e5e5;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  }
  
  &.theme-dark {
    background-color: #1c1c1e;
    border-top-color: #333333;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.3);
  }
}

.tabbar-content {
  display: flex;
  height: 50px;
  align-items: center;
  justify-content: space-around;
  padding: 0 10px;
}

.tabbar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4px 0;
  transition: all 0.3s ease;
  
  &.active {
    transform: scale(1.05);
  }
}

.tabbar-icon {
  width: 24px;
  height: 24px;
  margin-bottom: 2px;
  transition: all 0.3s ease;
}

.icon-image {
  width: 100%;
  height: 100%;
}

.tabbar-text {
  font-size: 10px;
  color: var(--theme-text-secondary);
  transition: all 0.3s ease;
  
  &.active {
    color: var(--theme-primary);
    font-weight: 600;
  }
}

// 主题特定样式
.theme-light {
  .tabbar-text {
    color: #7A7E83;
    
    &.active {
      color: #3cc51f;
    }
  }
}

.theme-dark {
  .tabbar-text {
    color: #cccccc;
    
    &.active {
      color: #0a84ff;
    }
  }
}
</style>