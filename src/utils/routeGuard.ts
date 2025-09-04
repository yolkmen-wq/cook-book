import { appControlManager } from './appControl'

// 允许在计算器模式下访问的页面
const CALCULATOR_MODE_PAGES = [
  '/pages/calculator/index',
  '/pages/index/index' // 如果需要保留首页作为入口
]

// 路由守卫类
class RouteGuard {
  // 检查页面是否允许访问
  canAccessPage(url: string): boolean {
    const displayMode = appControlManager.getDisplayMode()
    
    // 正常模式下允许访问所有页面
    if (displayMode === 1) {
      return true
    }
    
    // 计算器模式下只允许访问特定页面
    if (displayMode === 0) {
      return CALCULATOR_MODE_PAGES.some(allowedPage => 
        url.includes(allowedPage) || url === allowedPage
      )
    }
    
    return false
  }
  
  // 重定向到计算器页面
  redirectToCalculator() {
    uni.reLaunch({
      url: '/pages/calculator/index'
    })
  }
  
  // 重定向到首页
  redirectToHome() {
    uni.reLaunch({
      url: '/pages/index/index'
    })
  }
  
  // 拦截页面跳转
  interceptNavigation(url: string): boolean {
    if (!this.canAccessPage(url)) {
      // 如果是计算器模式且试图访问不允许的页面，重定向到计算器
      if (appControlManager.isCalculatorMode()) {
        this.redirectToCalculator()
        return false
      }
    }
    return true
  }
}

// 创建全局路由守卫实例
export const routeGuard = new RouteGuard()

// 重写uni的导航方法，添加路由守卫
const originalNavigateTo = uni.navigateTo
const originalRedirectTo = uni.redirectTo
const originalReLaunch = uni.reLaunch
const originalSwitchTab = uni.switchTab

// 拦截 navigateTo
uni.navigateTo = function(options: any) {
  if (routeGuard.canAccessPage(options.url)) {
    return originalNavigateTo.call(this, options)
  } else {
    console.warn('页面访问被拦截:', options.url)
    if (appControlManager.isCalculatorMode()) {
      routeGuard.redirectToCalculator()
    }
    return Promise.reject('页面访问被拦截')
  }
}

// 拦截 redirectTo
uni.redirectTo = function(options: any) {
  if (routeGuard.canAccessPage(options.url)) {
    return originalRedirectTo.call(this, options)
  } else {
    console.warn('页面访问被拦截:', options.url)
    if (appControlManager.isCalculatorMode()) {
      routeGuard.redirectToCalculator()
    }
    return Promise.reject('页面访问被拦截')
  }
}

// 拦截 switchTab
uni.switchTab = function(options: any) {
  if (appControlManager.isCalculatorMode()) {
    console.warn('计算器模式下不允许切换标签页')
    return Promise.reject('计算器模式下不允许切换标签页')
  }
  return originalSwitchTab.call(this, options)
}

// 导出守卫函数供页面使用
export function useRouteGuard() {
  return {
    canAccessPage: (url: string) => routeGuard.canAccessPage(url),
    redirectToCalculator: () => routeGuard.redirectToCalculator(),
    redirectToHome: () => routeGuard.redirectToHome(),
    isCalculatorMode: () => appControlManager.isCalculatorMode(),
    isNormalMode: () => appControlManager.isNormalMode()
  }
}