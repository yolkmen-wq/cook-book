<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { getAssetsImages } from "@/utils";
import { getCaptcha, getWxLogin } from "@/api/user";
import _ from "lodash";

const captcha = ref("");
const isChecked = ref(false);
const logindata = ref({
  phone: "",
  password: "",
  captcha: "",
});

const rules: Record<string, TM.FORM_RULE[]> = {
  phone: [{ required: true, message: "请输入正确的手机号码", type: "phone" }],
  password: [
    {
      required: true,
      message: "数字或者字母6-18位",
      rule: /^[a-zA-Z0-9]{6,18}$/,
    },
  ],
  captcha: [
    {
      required: true,
      message: "请输入验证码",
    },
  ],
};

/* 聚焦事件 */
const focusName = ref("");
const onFocus = (name: string) => {
  focusName.value = name;
};

/* 勾选协议 */
const checkboxChange = (e) => {
  isChecked.value = !isChecked.value;
};

/* 返回上一页 */
const toBack = () => {
  uni.navigateBack();
};

/* 登录 */
const onsubmit = (evt: TM.FORM_SUBMIT_RESULT) => {
  console.log("校验结果:", evt);
};

/* 微信手机号登录 */
const getPhoneNumber = (e) => {
  console.log(e);
};
// const wxLogin = () => {
//   // 微信登录逻辑
//   uni.login({
//     provider: "weixin",
//     success: function (loginRes) {
//       console.log(loginRes.code);
//       // 获取到code后调用后端接口完成登录
//       getWxLogin(loginRes.code);
//     },
//     fail: function (err) {
//       console.error("微信登录失败:", err);
//       uni.showToast({
//         title: "登录失败，请重试",
//         icon: "none",
//       });
//     },
//   });
// };

/* 获取验证码 */
const getCaptchaImg = _.debounce(async function () {
  const res = await getCaptcha();
  captcha.value = res.data.b64s;
}, 300);

onMounted(async () => {
  const res = await getCaptcha();
  captcha.value = res.data.b64s;
});
</script>
<template>
  <view class="flex flex-col relative">
    <view class="flex flex-col flex-1">
      <image
        style="width: 100vw; height: 100vh"
        mode="scaleToFill"
        :src="getAssetsImages('login/bg', 'png')"
      />
      <view
        class="absolute z-5"
        style="width: 60rpx; height: 60rpx; left: 70rpx; top: 150rpx"
        @tap="toBack"
      ></view>
      <view
        class="absolute left-0 top-0 flex flex-col-center-between justify-start"
        style="width: 100vw; height: 100vh"
      >
        <view style="height: 140rpx"><!----></view>
        <view class="py-10"><!----></view>
        <view class="flex">
          <text style="color: rgb(158, 158, 158); font-size: 15px"
            >欢迎您进入蛋黄屋!</text
          >
        </view>
        <view style="height: 300rpx"><!----></view>
        <!-- 手机号登录 -->
        <up-form
          style="width: 500rpx"
          @submit="onsubmit"
          v-model="logindata"
          :rules="rules"
          direction="vertical"
          gap="28"
        >
          <up-form-item name="phone" :show-bottom="false" :required="false">
            <up-input
              class="px-16"
              :class="{ focusStyle: focusName === 'phone' }"
              inputPadding="10"
              v-model="logindata.phone"
              shape="circle"
              clearable
              placeholder="请输入手机号"
              @focus="onFocus('phone')"
            >
              <template #prefix>
                <up-icon name="phone" color="#ffa600"></up-icon>
              </template>
            </up-input>
          </up-form-item>
          <up-form-item name="password" :show-bottom="false" :required="false">
            <up-input
              class="px-16"
              :class="{ focusStyle: focusName === 'password' }"
              inputPadding="10"
              v-model="logindata.password"
              shape="circle"
              placeholder="请输入密码"
              password
              showEye
              @focus="onFocus('password')"
            >
            </up-input>
          </up-form-item>
          <up-form-item name="captcha" :show-bottom="false" :required="false">
            <up-input
              class="px-16"
              :class="{ focusStyle: focusName === 'captcha' }"
              inputPadding="10"
              v-model="logindata.captcha"
              shape="circle"
              placeholder="请输入验证码"
              @focus="onFocus('captcha')"
            >
              <template #prefix>
                <image
                  class="captcha-img"
                  :src="captcha"
                  @tap="getCaptchaImg"
                />
              </template>
            </up-input>
          </up-form-item>
          <up-button color="#ffa600" :round="[40, 40]" block>
            <up-icon name="lock" color="#fff"></up-icon>登 录
          </up-button>
          <view class="py-20">
            <checkbox-group @change="checkboxChange">
              <label class="text-size-s flex flex-row-center justify-start">
                <checkbox
                  class="round checkboxColor"
                  style="transform: scale(0.7)"
                  value="cb"
                  :checked="isChecked"
                />
                <text style="color: rgb(26, 26, 26)"> 我已经阅读并同意 </text>
                <text style="color: rgb(254, 166, 0)"> 《用户隐私政策》 </text>
              </label>
            </checkbox-group>
          </view>
        </up-form>

        <!-- 快捷登录 -->
        <!-- <view class="flex flex-col items-center mt-60">
          <view class="flex flex-row items-center mb-20">
            <view class="h-line"></view>
            <text class="mx-20 text-gray">快捷登录</text>
            <view class="h-line"></view>
          </view>
          <view class="flex flex-row items-center">
            <view class="quick-login-item">
              <button
                open-type="getPhoneNumber"
                @getphonenumber="getPhoneNumber"
                style="background-color: transparent;"
              >
                <image
                  class="quick-login-icon"
                  :src="getAssetsImages('login/wechat', 'png')"
                  mode="aspectFit"
                />
              </button>

              <text class="quick-login-text">微信登录</text>
            </view>
          </view>
        </view> -->
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.captcha-img {
  width: 160rpx;
  height: 60rpx;
}

.focusStyle {
  color: #ffa600;
  border: solid 2px #ffa600 !important;
}
.h-line {
  width: 100rpx;
  height: 2rpx;
  background-color: #e5e5e5;
}

.quick-login-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx;
  cursor: pointer;
}

.quick-login-icon {
  width: 80rpx;
  height: 80rpx;
  margin-bottom: 10rpx;
}

.quick-login-text {
  font-size: 24rpx;
  color: #666;
}
</style>
