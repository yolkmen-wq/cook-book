<script lang="ts" setup>
import { ref, computed } from "vue";
import { covetUniNumber } from "@/utils";
import { TMUPLOAD_PHOTO_INFO, TMUPLOAD_PHOTO_STATUS } from "../types";
const props = withDefaults(
  defineProps<{
    list: TM.TMUPLOAD_PHOTO_INFO[];
    /**
     * 一行显示几列
     */
    column: number;
    /**
     * 上传成功的文件是否允许删除
     */
    okFileIsDelete: boolean;
    /**
     * 图片高,此处不可使用%单位
     */
    imgHeight: string;
    /**
     * 图片项目圆角。
     */
    round: string | number;
        /**
     * 图片被删除时触发
     * 如果返回Promise<false>删除失败否则成功
     * 类型null|(index:number,item:XUPLOADFILE_FILE_INFO)=>Promise<boolean>
     */
     beforeDel: ((index: number, item: TM.TMUPLOAD_PHOTO_INFO) => Promise<boolean>) | boolean;
  }>(),
  {
    list: () => [] as TMUPLOAD_PHOTO_INFO[],
    column: 5,
    okFileIsDelete: false,
    imgHeight: "110",
    round: 10,
    beforeDel:true
  }
);

const emit = defineEmits([
    /**
     * 每次全部上传完时触发
     * @param {TMUPLOAD_PHOTO_INFO[]} 列表数据 
     */
    'complete',
    /**
     * 变化时触发
     * @param {TMUPLOAD_PHOTO_INFO[]} 列表数据 
     */
    'change',
    /**
     * 图片被删除时触发
     * @param {TMUPLOAD_PHOTO_INFO[]} 列表数据 
     */
    'delete',
    /**
     * 同步文件列表。
     */
    'update:modelValue'
])

const STATUS_TEXT = new Map<TMUPLOAD_PHOTO_STATUS, string>([
  [0, "待上传"],
  [1, "上传中"],
  [2, "上传成功"],
  [3, "上传失败"],
  [4, "已取消"],
  [5, "超出大小限制"],
]);
const STATUS_COLOR = new Map<TMUPLOAD_PHOTO_STATUS, string>([
  [0, "#fff"],
  [1, "#0579FF"],
  [2, "#07d73d"],
  [3, "#f10226"],
  [4, "#F2F2F2"],
  [5, "#ffa61e"],
]);

const _coloumn = computed(() => props.column);
const _okFileIsDelete = computed(() => props.okFileIsDelete);
const _height = computed(() => covetUniNumber(props.imgHeight));
const _width = computed(() => 100 / props.column + "%");
const _round = computed(() => covetUniNumber(props.round));
const guuterSpace = uni.upx2px(10);
const uploading = ref(false)
const list = ref(props.list)

// 预览图片
const imagePreve = (index: number) => {
  uni.previewImage({
    current: index,
    urls: list.value.map((item) => item.path),
  });
};

// 删除图片
const remove = async (index: number, item: TM.TMUPLOAD_PHOTO_INFO) => {
    if (uploading.value) return;
    let isDele = true;
    if (typeof props.beforeDel === 'function') {
        isDele = await props.beforeDel(index, item)
    }
    if (!isDele) return;

    list.value.splice(index, 1);
    emit('change', list.value.slice(0))
    emit('update:modelValue', list.value.slice(0))
    emit('delete',item)
}
</script>
<template>
  <view
    class="uploadPhotoItem"
    :style="{
      width: `calc(${_width} - ${_coloumn == 1 ? 0 : guuterSpace}px)`,
      height: _height,
      borderRadius: _round,
    }"
    v-for="(item, index) in list"
    :key="index"
  >
    <image
      @click="imagePreve(index)"
      :src="item.path"
      :mode="props.mode"
      :style="{ width: '100%', height: '100%' }"
    ></image>
    <view
      class="tmUploadLabel"
      :style="{ color: STATUS_COLOR.get(item.status) || 'white' }"
      >{{ item.statusText }}
    </view>
    <view
      @click="remove(index, item)"
      class="tmUploadDel"
      v-if="
        (item.status == TMUPLOAD_PHOTO_STATUS.UPLOAD_SUCCESS &&
          _okFileIsDelete) ||
        (item.status != TMUPLOAD_PHOTO_STATUS.UPLOAD_SUCCESS &&
          item.status != TMUPLOAD_PHOTO_STATUS.UPLOADING)
      "
    >
      <tm-icon color="error" size="36" name="close-circle-fill"></tm-icon>
    </view>
  </view>
</template>
<style lang="scss" scoped>
.uploadPhotoItem {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
}
.uploadPhotoItemAdd {
  border: 1px solid #e6e7e7;
  background-color: #f3f3f3;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border-radius: 10rpx;
  overflow: hidden;
  box-sizing: border-box;
}
</style>
