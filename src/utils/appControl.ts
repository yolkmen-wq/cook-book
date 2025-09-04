import { ref, reactive } from 'vue'
import { getAppControl } from '@/api/user'

// 应用控制状态
export interface AppControlState {
  displayMode: number // 1: 正常模式, 0: 仅计算器模式
  isLoading: boolean
  isInitialized: boolean
}

// 应用控制管理器
class AppControlManager {
  private state = reactive<AppControlState>({
    displayMode: 0, // 默认正常模式
    isLoading: false,
    isInitialized: false
  })

  // 获取当前状态
  getState() {
    return this.state
  }

  // 获取展示模式
  getDisplayMode() {
    return this.state.displayMode
  }

  // 是否为正常模式
  isNormalMode() {
    return this.state.displayMode === 1
  }

  // 是否为计算器模式
  isCalculatorMode() {
    return this.state.displayMode === 0
  }

  // 调用控制接口
  async fetchDisplayMode() {
    try {
      this.state.isLoading = true
      
      // 调用应用控制接口
      const response = await getAppControl()
      
      // 处理接口返回结果
      if (response.code === 200) {
        this.state.displayMode = response.data.displayMode 
        console.log('应用控制状态获取成功:', response.data.displayMode === 1 ? '正常模式' : '计算器模式')
      } else {
        console.warn('获取应用控制状态失败，使用默认模式')
        this.state.displayMode = 1
      }
    } catch (error) {
      console.error('获取应用控制状态异常:', error)
      // 异常情况下默认为正常模式
      this.state.displayMode = 1
    } finally {
      this.state.isLoading = false
      this.state.isInitialized = true
    }
  }

  // 手动设置展示模式（用于测试）
  setDisplayMode(mode: number) {
    this.state.displayMode = mode
  }

  // 重置状态
  reset() {
    this.state.displayMode = 1
    this.state.isLoading = false
    this.state.isInitialized = false
  }
}

// 创建全局实例
export const appControlManager = new AppControlManager()

// 导出 composable 函数
export function useAppControl() {
  return {
    state: appControlManager.getState(),
    getDisplayMode: () => appControlManager.getDisplayMode(),
    isNormalMode: () => appControlManager.isNormalMode(),
    isCalculatorMode: () => appControlManager.isCalculatorMode(),
    fetchDisplayMode: () => appControlManager.fetchDisplayMode(),
    setDisplayMode: (mode: number) => appControlManager.setDisplayMode(mode)
  }
}