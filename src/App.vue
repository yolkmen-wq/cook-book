<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
onLaunch(() => {
  console.log("App Launch");
});
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
</script>
<style>
/* 大appvue中的style中引入 */
@import url(@/uni_modules/tm-ui/css/tmui.css);
page {
  background-color: rgba(248, 248, 248, 1);
}
</style>
