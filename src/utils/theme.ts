import { ref, reactive } from "vue";

// 主题配置接口
export interface ThemeConfig {
  name: string;
  label: string;
  colors: {
    primary: string;
    tabBarSelectedColor?: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    textPlaceholder: string;
    textDisabled: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
}

// 预定义主题
export const themes: Record<string, ThemeConfig> = {
  light: {
    name: "light",
    label: "浅色",
    colors: {
      primary: "#007aff",
      tabBarSelectedColor: "#3cc51f",
      primaryLight: "#ecf5ff",
      primaryDark: "#398ade",
      secondary: "#5ac8fa",
      background: "#ffffff",
      surface: "#f8f8f8",
      text: "#333333",
      textSecondary: "#666666",
      textPlaceholder: "#999999",
      textDisabled: "#c0c4cc",
      border: "#c8c7cc",
      success: "#4cd964",
      warning: "#f0ad4e",
      error: "#dd524d",
      info: "#909399",
    },
  },
  dark: {
    name: "dark",
    label: "深色",
    colors: {
      primary: "#0a84ff",
      primaryLight: "#1a1a1a",
      primaryDark: "#0066cc",
      secondary: "#64d2ff",
      background: "#1c1c1e",
      surface: "#2c2c2e",
      text: "#ffffff",
      textSecondary: "#cccccc",
      textPlaceholder: "#8e8e93",
      textDisabled: "#666666",
      border: "#38383a",
      success: "#30d158",
      warning: "#ff9f0a",
      error: "#ff453a",
      info: "#8e8e93",
    },
  },
  nature: {
    name: "nature",
    label: "自然绿",
    colors: {
      primary: "#34c759",
      primaryLight: "#f0fff4",
      primaryDark: "#28a745",
      secondary: "#30d158",
      background: "#f0fff4",
      surface: "#e8f5e8",
      text: "#1d4ed8",
      textSecondary: "#4b5563",
      textPlaceholder: "#6b7280",
      textDisabled: "#9ca3af",
      border: "#d1fae5",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#6b7280",
    },
  },
  violet: {
    name: "violet",
    label: "紫罗兰",
    colors: {
      primary: "#af52de",
      primaryLight: "#faf5ff",
      primaryDark: "#9333ea",
      secondary: "#bf5af2",
      background: "#faf5ff",
      surface: "#f3e8ff",
      text: "#581c87",
      textSecondary: "#6b46c1",
      textPlaceholder: "#7c3aed",
      textDisabled: "#a78bfa",
      border: "#e9d5ff",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#7c3aed",
    },
  },
};

// 当前主题状态
export const currentTheme = ref<string>("light");
export const themeColors = reactive<ThemeConfig["colors"]>({
  ...themes.light.colors,
});

// 平台检测
const getPlatform = () => {
  // #ifdef H5
  return "h5";
  // #endif
  // #ifdef MP-WEIXIN
  return "mp-weixin";
  // #endif
  // #ifdef MP-ALIPAY
  return "mp-alipay";
  // #endif
  // #ifdef MP-BAIDU
  return "mp-baidu";
  // #endif
  // #ifdef MP-TOUTIAO
  return "mp-toutiao";
  // #endif
  // #ifdef MP-QQ
  return "mp-qq";
  // #endif
  // #ifdef APP-PLUS
  return "app-plus";
  // #endif
  return "unknown";
};

// 主题管理器类
export class ThemeManager {
  private readonly STORAGE_KEY = "app-theme";
  private platform: string;

  constructor() {
    this.platform = getPlatform();
    this.init();
  }

  // 初始化主题
  init() {
    console.log("ThemeManager: 初始化主题系统, 平台:", this.platform);
    const savedTheme = this.getStoredTheme();
    this.setTheme(savedTheme);
  }

  // 获取存储的主题
  private getStoredTheme(): string {
    try {
      const stored = uni.getStorageSync(this.STORAGE_KEY);
      if (stored && themes[stored]) {
        console.log("ThemeManager: 从存储中获取主题:", stored);
        return stored;
      }
    } catch (error) {
      console.warn("ThemeManager: 获取存储主题失败:", error);
    }

    // 根据系统主题设置默认主题
    const systemTheme = this.getSystemTheme();
    console.log("ThemeManager: 使用系统主题:", systemTheme);
    return systemTheme;
  }

  // 获取系统主题
  private getSystemTheme(): string {
    try {
      // #ifdef H5
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        return "dark";
      }
      // #endif

      // #ifdef APP-PLUS
      const systemInfo = uni.getSystemInfoSync();
      if (systemInfo.theme === "dark") {
        return "dark";
      }
      // #endif

      // 小程序暂时不支持系统主题检测，使用浅色主题
      return "light";
    } catch (error) {
      console.warn("ThemeManager: 获取系统主题失败:", error);
      return "light";
    }
  }

  // 设置主题
  setTheme(themeName: string) {
    console.log("ThemeManager: 设置主题:", themeName, "平台:", this.platform);

    if (!themes[themeName]) {
      console.warn("ThemeManager: 主题不存在:", themeName);
      return;
    }

    const theme = themes[themeName];

    // 更新响应式状态
    currentTheme.value = themeName;
    Object.assign(themeColors, theme.colors);

    // 根据平台更新主题
    this.updateThemeByPlatform(theme);

    // 保存到存储
    this.saveTheme(themeName);

    console.log("ThemeManager: 主题设置完成:", themeName);
  }

  // 根据平台更新主题
  private updateThemeByPlatform(theme: ThemeConfig) {
    switch (this.platform) {
      case "h5":
        this.updateH5Theme(theme);
        break;
      case "app-plus":
        this.updateAppTheme(theme);
        break;
      default:
        // 小程序平台
        this.updateMiniProgramTheme(theme);
        break;
    }
  }

  // H5平台主题更新
  private updateH5Theme(theme: ThemeConfig) {
    if (typeof document === "undefined") return;

    const root = document.documentElement;

    // 更新CSS变量
    Object.entries(theme.colors).forEach(([key, value]) => {
      const cssVar = `--theme-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
      root.style.setProperty(cssVar, value);
    });

    // 更新body类名
    const body = document.body;
    Object.keys(themes).forEach((themeName) => {
      body.classList.remove(`theme-${themeName}`);
    });
    body.classList.add(`theme-${theme.name}`);

    // 更新状态栏颜色（PWA）
    this.updateStatusBarColor(theme.colors.background);

    console.log("ThemeManager: H5主题已更新");
  }

  // APP平台主题更新
  private updateAppTheme(theme: ThemeConfig) {
    // #ifdef APP-PLUS
    try {
      // 设置状态栏样式
      const isLight = this.isLightColor(theme.colors.background);
      plus.navigator.setStatusBarStyle(isLight ? "dark" : "light");

      // 设置状态栏背景色
      plus.navigator.setStatusBarBackground(theme.colors.background);

      // 更新原生导航栏
      const pages = getCurrentPages();
      if (pages.length > 0) {
        const currentPage = pages[pages.length - 1];
        if (currentPage && currentPage.$getAppWebview) {
          const webview = currentPage.$getAppWebview();
          webview.setStyle({
            titleNView: {
              backgroundColor: theme.colors.background,
              titleColor: theme.colors.text,
            },
          });
        }
      }

      console.log("ThemeManager: APP主题已更新");
    } catch (error) {
      console.warn("ThemeManager: APP主题更新失败:", error);
    }
    // #endif

    // 同时更新CSS变量（用于webview内容）
    this.updateCSSVariables(theme.colors);
  }

  // 小程序平台主题更新
  private updateMiniProgramTheme(theme: ThemeConfig) {
    // 小程序主要通过CSS变量和类名来实现主题切换
    this.updateCSSVariables(theme.colors);

    // 设置导航栏样式
    try {
      uni.setNavigationBarColor({
        frontColor: this.isLightColor(theme.colors.background)
          ? "#000000"
          : "#ffffff",
        backgroundColor: theme.colors.background,
        animation: {
          duration: 300,
          timingFunc: "easeIn",
        },
      });
    } catch (error) {
      console.warn("ThemeManager: 小程序导航栏颜色设置失败:", error);
    }

    // 设置tabBar样式（如果有的话）
    this.updateTabBarTheme(theme);

    console.log("ThemeManager: 小程序主题已更新");
  }

  // 更新CSS变量（通用方法）
  private updateCSSVariables(colors: ThemeConfig["colors"]) {
    // 在小程序中，我们通过全局样式类来实现
    // 这里主要是为了兼容H5和APP的webview部分
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      Object.entries(colors).forEach(([key, value]) => {
        const cssVar = `--theme-${key
          .replace(/([A-Z])/g, "-$1")
          .toLowerCase()}`;
        root.style.setProperty(cssVar, value);
      });
    }
  }

  // 更新TabBar主题
  private updateTabBarTheme(theme: ThemeConfig) {
    try {
      uni.setTabBarStyle({
        color: theme.colors.textSecondary,
        selectedColor: theme.colors.tabBarSelectedColor || theme.colors.primary,
        backgroundColor: theme.colors.background,
        borderStyle: this.isLightColor(theme.colors.background)
          ? "black"
          : "white",
      });
    } catch (error) {
      console.warn("ThemeManager: TabBar主题更新失败:", error);
    }
  }

  // 更新状态栏颜色（H5 PWA）
  private updateStatusBarColor(backgroundColor: string) {
    if (typeof document === "undefined") return;

    // 更新meta标签
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement("meta");
      metaThemeColor.setAttribute("name", "theme-color");
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.setAttribute("content", backgroundColor);

    // 更新苹果设备状态栏
    let metaAppleStatusBar = document.querySelector(
      'meta[name="apple-mobile-web-app-status-bar-style"]'
    );
    if (!metaAppleStatusBar) {
      metaAppleStatusBar = document.createElement("meta");
      metaAppleStatusBar.setAttribute(
        "name",
        "apple-mobile-web-app-status-bar-style"
      );
      document.head.appendChild(metaAppleStatusBar);
    }
    metaAppleStatusBar.setAttribute(
      "content",
      this.isLightColor(backgroundColor) ? "default" : "black-translucent"
    );
  }

  // 判断颜色是否为浅色
  private isLightColor(color: string): boolean {
    const hex = color.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128;
  }

  // 保存主题到存储
  private saveTheme(themeName: string) {
    try {
      uni.setStorageSync(this.STORAGE_KEY, themeName);
      console.log("ThemeManager: 主题已保存到存储:", themeName);
    } catch (error) {
      console.warn("ThemeManager: 保存主题失败:", error);
    }
  }

  // 获取当前主题
  getCurrentTheme(): string {
    return currentTheme.value;
  }

  // 获取当前主题颜色
  getCurrentColors(): ThemeConfig["colors"] {
    return { ...themeColors };
  }

  // 切换主题
  toggleTheme() {
    const themeNames = Object.keys(themes);
    const currentIndex = themeNames.indexOf(currentTheme.value);
    const nextIndex = (currentIndex + 1) % themeNames.length;
    const nextTheme = themeNames[nextIndex];

    console.log("ThemeManager: 切换主题:", currentTheme.value, "->", nextTheme);
    this.setTheme(nextTheme);
  }

  // 获取所有可用主题
  getAvailableThemes(): ThemeConfig[] {
    return Object.values(themes);
  }

  // 监听系统主题变化（仅H5）
  watchSystemTheme() {
    // #ifdef H5
    if (typeof window !== "undefined" && window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        const systemTheme = e.matches ? "dark" : "light";
        console.log("ThemeManager: 系统主题变化:", systemTheme);
        this.setTheme(systemTheme);
      };

      mediaQuery.addEventListener("change", handleChange);

      // 返回清理函数
      return () => {
        mediaQuery.removeEventListener("change", handleChange);
      };
    }
    // #endif

    return () => {};
  }

  // 获取平台信息
  getPlatform(): string {
    return this.platform;
  }
}

// 创建主题管理器实例
export const themeManager = new ThemeManager();

// 组合式函数
export function useTheme() {
  return {
    currentTheme: currentTheme,
    themeColors: themeColors,
    themes: themes,
    setTheme: (themeName: string) => themeManager.setTheme(themeName),
    toggleTheme: () => themeManager.toggleTheme(),
    getCurrentTheme: () => themeManager.getCurrentTheme(),
    getCurrentColors: () => themeManager.getCurrentColors(),
    getAvailableThemes: () => themeManager.getAvailableThemes(),
    watchSystemTheme: () => themeManager.watchSystemTheme(),
    getPlatform: () => themeManager.getPlatform(),
  };
}

// 主题切换组件的Props类型
export interface ThemePickerProps {
  showLabel?: boolean;
  size?: "small" | "medium" | "large";
  direction?: "horizontal" | "vertical";
}

// 导出类型
export type { ThemeConfig };
