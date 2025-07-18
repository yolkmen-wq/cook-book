<template>
  <view class="flex flex-col relative">
    <view class="flex flex-col flex-1">
      <image
        style="width: 100vw; height: 100vh"
        mode="scaleToFill"
        :src="getAssetsImages('login/bg', 'png')"
      />
      <view
        class="absolute zIndex-5"
        style="
          width: 60rpx;
          height: 60rpx;
          left: 70rpx;
          top: 150rpx;
        "
        @tap="toBack"
      ></view>
      <view
        class="absolute l-0 t-0 flex flex-col flex-col-top-center"
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
        <tm-form
          style="width: 500rpx"
          @submit="onsubmit"
          v-model="logindata"
          :rules="rules"
          direction="vertical"
          gap="28"
        >
          <tm-form-item name="phone" :show-bottom="false" :required="false">
            <tm-input
              inputClass="round-a-20 px-16"
              inputPadding="10"
              focusFontColor="#ffa600"
              focusHighlightStyle="border:solid 2px #ffa600 !important"
              v-model="logindata.phone"
              show-clear
              placeholder="请输入手机号"
            >
              <template #leftIcon>
                <tm-icon name="smartphone-line" color="#ffa600"></tm-icon>
              </template>
            </tm-input>
          </tm-form-item>
          <tm-form-item name="password" :show-bottom="false" :required="false">
            <tm-input
              inputClass="round-a-20 px-16"
              inputPadding="10"
              focusFontColor="#ffa600"
              focusHighlightStyle="border:solid 2px #ffa600 !important"
              v-model="logindata.password"
              placeholder="请输入密码"
              password
              showEye
            >
            </tm-input>
          </tm-form-item>
          <tm-form-item name="captcha" :show-bottom="false" :required="false">
            <tm-input
              inputClass="round-a-20 px-16"
              inputPadding="10"
              focusFontColor="#ffa600"
              focusHighlightStyle="border:solid 2px #ffa600 !important"
              v-model="logindata.captcha"
              placeholder="请输入验证码"
            >
              <template #leftIcon>
                <image
                  class="captcha-img"
                  :src="captcha"
                  @tap="getCaptchaImg"
                />
              </template>
            </tm-input>
          </tm-form-item>
          <tm-button form-type="submit" color="#ffa600" :round="[40, 40]" block>
            <tm-icon name="lock-unlock-line" color="#fff"></tm-icon>登 录
          </tm-button>
          <view class="py-20">
            <checkbox-group @change="checkboxChange">
              <label class="text-size-s flex flex-row flex-row-center-start">
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
        </tm-form>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { getAssetsImages } from "@/utils";
import { getCaptcha } from "@/api/user";
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

/* 勾选协议 */
const checkboxChange = (e) => {
  isChecked.value = !isChecked.value;
};

/* 返回上一页 */
const toBack = ()=>{
    uni.navigateBack()
}

/* 登录 */
const onsubmit = (evt: TM.FORM_SUBMIT_RESULT) => {
  console.log("校验结果:", evt);
};

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

<style lang="scss" scoped>
.captcha-img {
  width: 160rpx;
  height: 60rpx;
}
</style>
