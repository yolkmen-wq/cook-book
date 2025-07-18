<script lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { themeManager, useTheme } from '@/utils/theme'

export default {
  onLaunch() {
    console.log('App Launch')
    
    // 初始化主题系统
    themeManager.init()
    
    // 在H5平台监听系统主题变化
    // #ifdef H5
    const { watchSystemTheme } = useTheme()
    watchSystemTheme()
    // #endif
  },
  onShow() {
    console.log('App Show')
  },
  onHide() {
    console.log('App Hide')
  }
}
</script>

<style lang="scss">
// 导入uni.scss，包含主题系统和uview-plus变量
@import './uni.scss';

// 应用全局样式
#app {
  background-color: var(--theme-background);
  color: var(--theme-text);
  min-height: 100vh;
}

// 确保所有页面都应用主题
page {
  background-color: var(--theme-background);
  color: var(--theme-text);
}
</style>

<style lang="scss">
// 导入uview-plus组件样式
@import "uview-plus/index.scss";

//设置圆角
checkbox.round .wx-checkbox-input,
checkbox.round .uni-checkbox-input {
  border-radius: 100rpx;
}

//设置背景色
checkbox.checkboxColor[checked] .wx-checkbox-input,
checkbox.checkboxColor.checked .uni-checkbox-input {
  background-color: var(--theme-primary, #e5e561) !important;
  border-color: var(--theme-primary, #e5e561) !important;
  color: var(--theme-text, #333333) !important;
}
</style>
