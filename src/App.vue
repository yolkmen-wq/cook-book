<script lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { themeManager, useTheme } from "@/utils/theme";
import { getWxLogin } from "@/api/user";
import { appControlManager } from "@/utils/appControl";
import "@/utils/routeGuard"; // 引入路由守卫

export default {
  async onLaunch() {
    console.log("App Launch",appControlManager);

    // 初始化应用控制状态
    await appControlManager.fetchDisplayMode();
    
    // 根据应用状态决定启动页面
    if (appControlManager.isCalculatorMode()) {
      // 计算器模式下直接跳转到计算器页面
      uni.reLaunch({
        url: '/pages/calculator/index'
      });
    }else{
      uni.switchTab({
        url: '/pages/tabBar/home/index'
      })
    }
    
    // 初始化主题系统
    themeManager.init();
    // 在H5平台监听系统主题变化
    // #ifdef H5
    const { watchSystemTheme } = useTheme();
    watchSystemTheme();
    // #endif
    // #ifdef MP-WEIXIN
    this.wxLogin();
    // #endif
  },
  onShow() {
    console.log("App Show");
  },
  onHide() {
    console.log("App Hide");
  },
  methods: {
    /* 微信登录 */
    wxLogin: () => {
      // 微信登录逻辑
      uni.login({
        provider: "weixin",
        success: async function (loginRes) {
          console.log(loginRes.code);
          // 获取到code后调用后端接口完成登录
          const res = await getWxLogin(loginRes.code);
          console.log(res);
          if (res?.code === 200) uni.setStorageSync("token", res.data.token);
        },
        fail: function (err) {
          console.error("微信登录失败:", err);
          // uni.showToast({
          //   title: "登录失败，请重试",
          //   icon: "none",
          // });
        },
      });
    },
  },
};
</script>

<style lang="scss">
// 导入uni.scss，包含主题系统和uview-plus变量
@import "./uni.scss";

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
