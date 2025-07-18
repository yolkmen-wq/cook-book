<template>
  <up-modal
    v-model:show="show"
    title="登录验证"
    height="380rpx"
    :show-close="true"
    :show-footer="true"
  >
    <up-text color="#999999">
      <view class="text-align-center mb-n10">请登录后再继续体验小程序</view>
      <button
        class="round-a-12 text-size-n"
        type="primary"
        :open-type="isChecked ? 'getPhoneNumber' : ''"
        @getphonenumber="getPhoneNumber"
      >
        手机号一键登录
      </button>
    </up-text>
    <template #footer>
      <view style="margin: 0 auto">
        <checkbox-group @change="checkboxChange">
          <label class="text-size-s">
            <checkbox
              class="round checkboxColor"
              style="transform: scale(0.7)"
              value="cb"
              :checked="isChecked"
            />阅读并同意<text style="color: #0088ff">《用户协议》</text>和<text
              style="color: #0088ff"
              >《隐私协议》</text
            >
          </label>
        </checkbox-group>
      </view>
    </template>
  </up-modal>
</template>

<script lang="ts" setup>
import { getWxLogin, getLogin } from "@/api/user";
import { ref } from "vue";

defineOptions({
  name: "LoginModal",
});

const show = defineModel({ type: Boolean });
const isChecked = ref(false);

//手机号登录
const getPhoneNumber = (e) => {
  if (!isChecked.value) {
    uni.showToast({
      title: "请阅读并勾选协议",
    });
    return;
  }
  uni.login({
    provider: "weixin", //使用微信登录
    success: function (loginRes) {
      console.log("loginRes", loginRes);
      getWxLogin({ code: loginRes.code })
        .then((res) => {
          uni.setStorage({
            key: "token",
            data: res.data.token,
          });
          getLogin();
        })
        .catch((err) => {
          console.log(149, err);
        });
    },
  });
};

const checkboxChange = (e) => {
  isChecked.value = !isChecked.value;
};
</script>

<style lang="scss" scoped></style>
