<script setup lang="ts">
import { defineProps, defineEmits, onMounted, ref } from "vue";
import { getEmojis } from "@/api/emoji";
import { convertToEmoji } from "@/utils";

defineOptions({
  name: "EmojiPanel",
});

const props = defineProps<{
  show: boolean;
}>();

const emit = defineEmits<{
  (e: "select", unicode: string): void;
}>();

interface Emoji {
  categoryId: number;
  categoryName: string;
  createdTime: string;
  id: number;
  name: string;
  status: number;
  unicode: string;
  updatedTime: string;
  url: string;
}

const emojis = ref<Emoji[]>([]);

const selectEmoji = (unicode: string) => {
  emit("select", convertToEmoji(unicode));
};

onMounted(async () => {
  console.log("mounted");
  const res = await getEmojis();
  emojis.value = res.data.list;
});
</script>
<template>
  <view v-if="show" class="emoji-panel">
    <view
      class="emoji-item"
      v-for="emoji in emojis"
      :key="emoji.id"
      @click="selectEmoji(emoji.unicode)"
    >
      <text>{{ convertToEmoji(emoji.unicode) }}</text>
    </view>
  </view>
</template>
<style lang="scss" scoped>
.emoji-panel {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx 16rpx;
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 10px;
  max-height: 200px;
  overflow-y: auto;
  .emoji-item {
    width: 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px;
    transition: transform 0.2s;
  }
}

.emoji-panel image:active {
  transform: scale(1.2);
}
</style>
