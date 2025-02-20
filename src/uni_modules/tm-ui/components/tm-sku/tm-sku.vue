<script lang="ts" setup>
import {computed, nextTick, onMounted, PropType, ref, watch} from 'vue';

type SKU_DATA_ITEM = {
    id: string | number,
    title: string,
    children?: Array<SKU_DATA_ITEM>,
    [p: string]: any
}
type SKU_PRODUCT = {
    id: string | number,
    img: string,
    /** 库存数量 */
    inventory_quantity: number,
    max_buy_quantity: number,
    min_buy_quantity: number,
    original_price: number,
    price: number,
    title: string,
    [p: string]: any
}
type SKU_DATA_TYPE = {
    data: Array<SKU_DATA_ITEM>,
    product: SKU_PRODUCT[] | null
}
/**
 * @displayName 选择器
 * @exportName tm-picker
 * @category 表单组件
 * @description 可单列或者多列
 * @constant 平台兼容
 *    | H5 | uniAPP | 小程序 | version |
 | --- | --- | --- | --- |
 | ☑️| ☑️ | ☑️ | ☑️ | ☑️ | 1.0.0 |
 */
defineOptions({name: 'TmPicker'});

const props = defineProps({
    /**
     * 数据
     */
    data: {
        type: Object as PropType<SKU_DATA_TYPE>,
        default: (): SKU_DATA_TYPE => {
            return {
                data: [],
                product: null
            } as SKU_DATA_TYPE
        }
    },
    /**
     * 当前选中项的id值
     */
    modelValue: {
        type: [String, Number],
        default: ""
    },
    /**
     * 当前打开的状态。
     * 等同v-model:model-show
     */
    modelShow: {
        type: Boolean,
        default: false
    },
    /**
     * 是否懒加载内部内容。
     * 当前你的列表内容非常多，且影响打开的动画性能时，请务必
     * 设置此项为true，以获得流畅视觉效果。如果选择数据较少没有必要打开
     */
    lazyContent: {
        type: Boolean,
        default: false
    },
    showClose: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits([
    /**
     * 取消时触发
     */
    'cancel',
    /**
     * 确认触发
     * @param {string[]} ids 当前选中项的id值
     */
    'confirm',
    /**
     * 变量控制打开状态
     * 等同v-model:model-show
     */
    'update:modelShow',
    'update:modelValue'
]);

const show = ref(false);
const nowValue = ref<string | number>("");
const yanchiDuration = ref(false);
const buy = ref(1)
const nowselectedIds = ref<Array<string | number>>([])
const _data = computed(() => props.data);
const _nowSelectedItem = computed<SKU_PRODUCT | null>(() => {
    if (nowselectedIds.value.length == 0 || _data.value.product == null || !_data.value.product) return null;
    let datas = _data.value.data;
    let ids = ''
    for (let i = 0; i < datas.length; i++) {
        let item = datas[i];
        let childrens = item?.children ?? [];
        if (childrens.length > 0) {
            let cids = childrens.map((el) => el.id)
            for (let j = 0; j < cids.length; j++) {
                if (nowselectedIds.value.includes(cids[j])) {
                    ids += cids[j] + "-"
                }
            }
        }
    }
    if (ids == '') return null;
    ids = ids.substring(0, ids.length - 1);
    let index = _data.value.product.findIndex((el) => el.id == ids);
    if (index == -1) return null
    return _data.value.product[index]
});
const _lazyContent = computed(() => props.lazyContent);
const _nowImgDefault = computed(() => {
    if (!_data.value || !_data.value.product || _data.value.product?.length == 0) return ""
    return _data.value.product[0].img ?? ''
})
watch(() => props.modelValue, (newvalue: string | number) => {
    onSetDefaultStr();
});

watch(() => props.modelShow, (newValue: boolean) => {
    if (newValue == show.value) return;
    show.value = newValue;
},);


onMounted(() => {
    nowValue.value = props.modelValue;
    yanchiDuration.value = _lazyContent.value ? false : true;
    onSetDefaultStr();
    if (props.modelShow) {
        nextTick(() => {
            show.value = true;
        })
    }
});

function openShow() {
    show.value = true;
    emit('update:modelShow', true);
}

function onClose() {
    emit('update:modelShow', false);
    if (_lazyContent.value) {
        yanchiDuration.value = false;
    }
}

function onOpen() {
    yanchiDuration.value = true;
}

function onCancel() {
    onSetDefaultStr()
    emit('cancel');
    onClose()
}

function onConfirm() {
    if (!_nowSelectedItem.value) return;
    let ids = _nowSelectedItem.value.id;
    emit('update:modelValue', ids);
    emit('confirm', JSON.parse(JSON.stringify(_nowSelectedItem.value)), buy.value);
}

//设置默认选中的值。
function onSetDefaultStr() {
    if (props.modelValue) {
        let val = String(props.modelValue)
        let ids = val.split("-")
        nowselectedIds.value = ids;
    }
}

//有没有选中。
function isSelectedTags(id: string | number): boolean {
    return nowselectedIds.value.includes(id);
}

function selectedItem(parent: SKU_DATA_ITEM, item: SKU_DATA_ITEM) {
    let allprentids = parent.children!.map(el => el.id)
    if (nowselectedIds.value.includes(item.id)) {
        let ids = nowselectedIds.value.filter((el) => !allprentids.includes(el))
        nowselectedIds.value = ids.splice(0)
        return;
    }
    let ids = nowselectedIds.value.filter((el) => !allprentids.includes(el))
    ids.push(item.id)
    nowselectedIds.value = ids.slice(0)
}

const disabledBuy = computed(() => {
    if (_nowSelectedItem.value == null) return true;
    if (_nowSelectedItem.value.max_buy_quantity > 0 && _nowSelectedItem.value.max_buy_quantity < buy.value) return true;
    if (_nowSelectedItem.value.min_buy_quantity > 0 && _nowSelectedItem.value.min_buy_quantity > buy.value) return true;
    return false;
})
</script>
<script lang="ts">
export default {
    options: {
        styleIsolation: "apply-shared",
        virtualHost: true,
        addGlobalClass: true,
        multipleSlots: true,
    },
};
</script>
<template>
    <view @click="openShow">
        <!--
		 @slot 插槽,默认触发打开选择器。你的默认布局可以放置在这里。
		 @binding {boolean} show - 控制打开关闭状态
		 -->
        <slot></slot>
    </view>
    <tm-drawer
        v-model:show="show"
        :disabledScroll="true"
        :show-close="showClose"
        :show-title="false" :showFooter="true"
        :widthCoverCenter="true"
        max-height="80%"
        size="850"
        @cancel="onCancel"
        @close="onClose"
        @confirm="onConfirm"
        @open="onOpen"
    >
        <view class="skuHeader">
            <tm-image :preview="true" :src="(_nowSelectedItem?.img??_nowImgDefault)" height="160" round="12"
                      width="160"></tm-image>
            <view style="margin-left: 20rpx">
                <view v-if="_nowSelectedItem">
                    <text :style="{color:'red',fontSize:'36rpx'}">￥{{ _nowSelectedItem.price }}</text>
                    <text v-if="_nowSelectedItem.original_price>0" :style="{color:'red',fontSize:'24rpx',paddingLeft:'10rpx'}"
                          class="skuOrPrice">
                        原价{{ _nowSelectedItem.original_price }}
                    </text>
                </view>
                <view v-if="!_nowSelectedItem">
                    <text :style="{color:'red',fontSize:'36rpx'}">未选择</text>
                </view>
                <view class="skuSelectetext" style="margin-top: 10rpx">
                    <text>已选择：{{ _nowSelectedItem ? _nowSelectedItem.title : "未选择" }}，数量：{{ buy }}</text>
                </view>
                <view style="margin-top: 10rpx">
                    <tm-stepper v-model="buy" :disabled="true" :max="1000" :min="0" width="220"></tm-stepper>
                </view>
            </view>
        </view>
        <view clas="skuWrap">
            <view v-for="(item,index) in _data.data" :key="index" style="margin-top: 24rpx">
                <view>
                    <text style="{fontSize:'32rpx'}">{{ item.title }}</text>
                </view>
                <view style="margin-top: 24rpx">
                    <tm-tag
                        v-for="(item2,index2) in (item.children??[])"
                        :color="isSelectedTags(item2.id)?'primary':'info'"
                        :style="{margin:`0 12rpx 12rpx 0`}"
                        @click="selectedItem(item,item2)">
                        {{ item2.title }}
                    </tm-tag>
                </view>
            </view>
        </view>

        <template v-slot:footer>
            <view style="display: flex;flex-direction: row;justify-content: space-between">
                <tm-button block color="primary" skin="thin" @click="onCancel">取消</tm-button>
                <tm-button :disabled="disabledBuy" block color="primary" style="margin-left: 20rpx" @click="onConfirm">
                    确认购买
                </tm-button>
            </view>
        </template>

    </tm-drawer>
</template>
<style scoped>
.skuOrPrice {
    text-decoration: line-through;
}

.skuSelectetext {
    font-size: 24rpx;

}

.skuHeader {
    display: flex;
    flex-direction: row;
    margin-top: 20rpx;
}
</style>