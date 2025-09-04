<script lang="ts" setup>
import { ref, computed, nextTick, onMounted, onUnmounted, watch } from 'vue';

// 控制助手的显示状态
const isExpanded = ref(false);
const messages = ref([
  { role: 'assistant', content: '你好！我是你的AI助手，有什么可以帮助你的吗？' }
]);
const inputMessage = ref('');
const scrollTop = ref(0); // 用于控制scroll-view的滚动位置
const scrollKey = ref(0); // 用于强制更新scroll-view
const isTyping = ref(false); // 控制AI是否正在回复中
const socketTask = ref<UniApp.SocketTask | null>(null); // 存储WebSocket连接
const currentStreamingMessage = ref(''); // 存储当前正在流式输出的消息
const isUserStopped = ref(false); // 标记用户是否主动停止
const isConnected = ref(false); // 标记WebSocket是否已连接

// 主题类名
const themeClass = computed(() => {
  // 这里可以根据实际的主题状态来返回对应的类名
  // 暂时默认返回浅色主题
  return 'theme-light';
});

// 切换助手显示状态
const toggleAssistant = () => {
  isExpanded.value = !isExpanded.value;
};

// 自动滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    // 使用一个大数值强制滚动到底部
    scrollTop.value = 999999;
    scrollKey.value++; // 强制更新scroll-view
    console.log('强制滚动到底部，scrollTop:', scrollTop.value);
  });
};

// 平滑滚动到底部（用于流式输出时的实时滚动）
const smoothScrollToBottom = () => {
  nextTick(() => {
    // 流式输出时使用递增的滚动值，确保每次都能触发滚动
    scrollTop.value = 999999 + Date.now() % 1000;
    console.log('平滑滚动到底部，scrollTop:', scrollTop.value);
  });
};

// 超时定时器
let typingTimeout: NodeJS.Timeout | null = null;
// 内容检测定时器
let contentCheckTimeout: NodeJS.Timeout | null = null;
// 上次内容长度
let lastContentLength = 0;

// 检查WebSocket连接状态
const isWebSocketConnected = () => {
  // uni-app的SocketTask没有readyState属性，需要通过连接状态标志来判断
  return socketTask.value !== null && isConnected.value;
};

// 发送消息到WebSocket服务器
const sendMessage = () => {
  if (!inputMessage.value.trim() || isTyping.value) return;
  
  // 重置用户停止标志，允许正常连接和重连
  isUserStopped.value = false;
  
  // 如果WebSocket未连接，重新开启连接
  if (!isWebSocketConnected()) {
    console.log('WebSocket未连接，正在重新开启连接...');
    initWebSocket();
    // 等待连接建立后再发送消息，使用更长的等待时间和重试机制
    let retryCount = 0;
    const maxRetries = 5;
    const checkConnection = () => {
      if (isWebSocketConnected()) {
        sendMessageInternal();
      } else if (retryCount < maxRetries) {
        retryCount++;
        console.log(`等待连接建立中... (${retryCount}/${maxRetries})`);
        setTimeout(checkConnection, 500);
      } else {
        console.error('WebSocket连接失败');
        uni.showToast({
          title: '连接失败，请重试',
          icon: 'none'
        });
      }
    };
    setTimeout(checkConnection, 500);
    return;
  }
  
  sendMessageInternal();
};

// 内部发送消息函数
const sendMessageInternal = () => {
  if (!inputMessage.value.trim() || !socketTask.value || isTyping.value) return;

  // 添加用户消息
  messages.value.push({
    role: 'user',
    content: inputMessage.value
  });

  // 保存当前消息以便在回复中使用
  const currentMessage = inputMessage.value;

  // 清空输入框
  inputMessage.value = '';

  // 滚动到底部
  scrollToBottom();

  // 添加一个空的助手消息，用于流式输出
  isTyping.value = true;
  currentStreamingMessage.value = '';
  messages.value.push({
    role: 'assistant',
    content: ''
  });

  // 清除之前的超时定时器
  if (typingTimeout) {
    clearTimeout(typingTimeout);
  }

  // 设置超时机制，30秒后自动结束typing状态
  typingTimeout = setTimeout(() => {
    if (isTyping.value) {
      isTyping.value = false;
      const lastMessage = messages.value[messages.value.length - 1];
      if (lastMessage && lastMessage.role === 'assistant' && !lastMessage.content) {
        lastMessage.content = '响应超时，请重试。';
      }
      console.log('响应超时，自动结束typing状态');
    }
  }, 30000); // 30秒超时

  // 发送消息到WebSocket服务器
  const messageObj = {
    message: currentMessage,
    provider: "deepseek",// 可以根据需要修改模型提供商
    action:'chat'
  };

  socketTask.value.send({
    data: JSON.stringify(messageObj),
    success: () => {
      console.log('消息发送成功');
    },
    fail: (error: any) => {
      console.error('消息发送失败:', error);
      // 发送失败时更新最后一条消息
      const lastMessage = messages.value[messages.value.length - 1];
      if (lastMessage && lastMessage.role === 'assistant') {
        lastMessage.content = '消息发送失败，请重试。';
      }
      isTyping.value = false;
      // 清除超时定时器
      if (typingTimeout) {
        clearTimeout(typingTimeout);
        typingTimeout = null;
      }
    }
  });
};

// 防抖滚动函数
let scrollDebounceTimer: NodeJS.Timeout | null = null;
const debouncedScrollToBottom = () => {
  if (scrollDebounceTimer) {
    clearTimeout(scrollDebounceTimer);
  }
  scrollDebounceTimer = setTimeout(() => {
    // 在流式输出时使用平滑滚动，其他时候使用普通滚动
    if (isTyping.value) {
      smoothScrollToBottom();
    } else {
      scrollToBottom();
    }
  }, 50); // 50ms防抖，提高响应性
};

// 监听当前流式消息的变化，更新最后一条助手消息并实时滚动
watch(currentStreamingMessage, (newValue, oldValue) => {
  console.log('流式消息变化:', { newValue, oldValue });
  // 只有在typing状态下才更新消息内容
  if (!isTyping.value) {
    console.log('不在typing状态，忽略流式消息更新');
    return;
  }
  const lastMessage = messages.value[messages.value.length - 1];
  if (lastMessage && lastMessage.role === 'assistant' && newValue) {
    lastMessage.content = newValue;
    console.log('更新助手消息内容，触发滚动');
    // 实时滚动到底部，使用防抖优化性能
    debouncedScrollToBottom();
  }
}, { flush: 'post', immediate: true }); // 确保DOM更新后再执行，立即执行一次

// 处理收到的WebSocket消息
const handleWebSocketMessage = (data: string) => {
  // 如果不在typing状态或用户已停止，忽略所有消息
  if (!isTyping.value || isUserStopped.value) {
    console.log('不在typing状态或用户已停止，忽略消息:', data);
    return;
  }
  
  try {
    const response = JSON.parse(data);
    console.log('收到WebSocket响应:', response);

    let hasNewContent = false;

    // 根据实际的WebSocket响应格式进行处理
    // 支持多种可能的字段名，但只有在typing状态下才拼接内容
    if (isTyping.value) {
      if (response.content) {
        currentStreamingMessage.value += response.content;
        hasNewContent = true;
      } else if (response.text) {
        currentStreamingMessage.value += response.text;
        hasNewContent = true;
      } else if (response.message) {
        currentStreamingMessage.value += response.message;
        hasNewContent = true;
      }
    }

    // 如果有新内容，立即触发滚动（不依赖watch，确保实时性）
    if (hasNewContent) {
      console.log('检测到新内容，触发滚动，当前消息长度:', currentStreamingMessage.value.length);
      debouncedScrollToBottom();
      
      // 更新内容长度并重置检测定时器
      lastContentLength = currentStreamingMessage.value.length;
      if (contentCheckTimeout) {
        clearTimeout(contentCheckTimeout);
      }
      // 设置内容检测定时器，如果3秒内没有新内容，自动结束typing状态
      contentCheckTimeout = setTimeout(() => {
        if (isTyping.value && currentStreamingMessage.value.length === lastContentLength) {
          console.log('检测到内容停止增长，自动结束typing状态');
          isTyping.value = false;
          if (typingTimeout) {
            clearTimeout(typingTimeout);
            typingTimeout = null;
          }
          scrollToBottom();
        }
      }, 3000);
    }

    // 如果收到了结束标志，表示流式输出结束
    if (response.type === 'done') {
      isTyping.value = false;
      // 清除超时定时器
      if (typingTimeout) {
        clearTimeout(typingTimeout);
        typingTimeout = null;
      }
      // 最终滚动到底部
      scrollToBottom();
      console.log('流式输出结束');
    }
  } catch (error) {
    console.error('解析WebSocket消息失败:', error);
    // 如果无法解析JSON，可能是纯文本消息，但只有在typing状态下才处理
    if (isTyping.value) {
      currentStreamingMessage.value += data;
      // 触发滚动
      debouncedScrollToBottom();
      // 对于纯文本消息，设置一个短暂的延迟后结束typing状态
      setTimeout(() => {
        if (isTyping.value) {
          isTyping.value = false;
          // 清除超时定时器
          if (typingTimeout) {
            clearTimeout(typingTimeout);
            typingTimeout = null;
          }
          // 最终滚动到底部
          scrollToBottom();
          console.log('纯文本消息处理完成，结束typing状态');
        }
      }, 200);
    } else {
      console.log('不在typing状态，忽略纯文本消息:', data);
    }
  }
};


// 处理发送或停止的统一函数
const handleSendOrStop = () => {
  if (isTyping.value) {
    // 如果正在生成，则停止生成
    stopAIGeneration();
  } else if (inputMessage.value.trim()) {
    // 如果有输入内容且未在生成，则发送消息
    sendMessage();
  }
  // 如果输入框为空且未在生成，不执行任何操作
};

// 停止AI生成的函数
const stopAIGeneration = () => {
  console.log('用户主动停止AI生成');
  const messageObj = {
    action:'stop'
  }
    socketTask.value.send({
    data: JSON.stringify(messageObj),
    })
  // 设置用户主动停止标志，防止自动重连
  isUserStopped.value = true;
  
  // 立即重置状态，防止继续处理消息
  isTyping.value = false;
  
  // 清除超时定时器
  if (typingTimeout) {
    clearTimeout(typingTimeout);
    typingTimeout = null;
  }
  if (contentCheckTimeout) {
    clearTimeout(contentCheckTimeout);
    contentCheckTimeout = null;
  }
  
  // 立即处理最后一条消息，添加停止标识
  const lastMessage = messages.value[messages.value.length - 1];
  if (lastMessage && lastMessage.role === 'assistant') {
    // 保存当前已生成的内容
    const currentContent = currentStreamingMessage.value || lastMessage.content || '';
    if (!currentContent || currentContent === '') {
      lastMessage.content = '生成已停止';
    } else {
      lastMessage.content = currentContent + '\n\n[生成已停止]';
    }
  }
  
  // 清除当前流式消息（在处理完最后消息后）
  currentStreamingMessage.value = '';
  
  // 强制关闭WebSocket连接以停止AI生成
  if (socketTask.value) {
    try {
      // 检查连接是否仍然有效
      if (typeof socketTask.value.close === 'function') {
        // 强制关闭连接，使用1000状态码表示正常关闭
        socketTask.value.close({
          code: 1000,
          reason: '用户主动停止'
        });
        console.log('WebSocket连接已强制关闭');
      }
    } catch (e) {
      console.log('关闭WebSocket连接时出错:', e);
    }
    socketTask.value = null;
    isConnected.value = false;
  }
  
  console.log('AI生成已完全停止');
};

// 初始化WebSocket连接
const initWebSocket = () => {
  // 如果已有连接，先关闭
  if (socketTask.value) {
    try {
      // 检查连接是否仍然有效
      if (typeof socketTask.value.close === 'function') {
        socketTask.value.close({
          code: 1000,
          reason: '重新连接'
        });
      }
    } catch (e) {
      console.log('关闭旧连接时出错:', e);
    }
  }
  
  // 创建WebSocket连接
  socketTask.value = uni.connectSocket({
    url: 'wss://test.yolkmen.com/chat-ws', // WebSocket服务器地址
    // url: 'ws://127.0.0.1:7575/chat-ws', // WebSocket服务器地址
    complete: () => {
      console.log('WebSocket连接请求已完成');
    }
  });

  // 监听WebSocket连接打开事件
  socketTask.value.onOpen(() => {
    console.log('WebSocket连接已打开');
    isConnected.value = true;
  });

  // 监听WebSocket消息
  socketTask.value.onMessage((res) => {
    console.log('收到服务器内容：', res.data);
    handleWebSocketMessage(res.data);
  });

  // 监听WebSocket连接关闭事件
  socketTask.value.onClose((res) => {
    console.log('WebSocket连接关闭:', res);
    isConnected.value = false;
    // 只有在非用户主动停止且连接异常关闭时才重连
    if (!isUserStopped.value && (!res.code || (res.code !== 1000 && res.code !== 1001))) {
      console.log('连接异常关闭，准备重连');
      setTimeout(() => {
        if (!isTyping.value && !isUserStopped.value) {
          console.log('开始重连WebSocket');
          initWebSocket();
        }
      }, 2000);
    } else if (isUserStopped.value) {
      console.log('用户主动停止，不进行重连');
    }
  });

  // 监听WebSocket错误事件
  socketTask.value.onError((error) => {
    console.error('WebSocket连接错误:', error);
    isConnected.value = false;
    // 只有在非用户主动停止时才重连
    if (!isUserStopped.value) {
      setTimeout(() => {
        if (!isTyping.value && !isUserStopped.value) {
          console.log('连接错误，开始重连WebSocket');
          initWebSocket();
        }
      }, 3000);
    } else {
      console.log('用户主动停止，忽略连接错误重连');
    }
  });
};

onMounted(() => {
  // 输出初始消息用于调试
  console.log('组件挂载，初始消息:', messages.value);
  
  // 初始化WebSocket连接
  initWebSocket();
});

// 组件卸载时清理定时器
onUnmounted(() => {
  if (typingTimeout) {
    clearTimeout(typingTimeout);
    typingTimeout = null;
  }
  if (contentCheckTimeout) {
    clearTimeout(contentCheckTimeout);
    contentCheckTimeout = null;
  }
  if (scrollDebounceTimer) {
    clearTimeout(scrollDebounceTimer);
    scrollDebounceTimer = null;
  }
  if (socketTask.value) {
    try {
      // 检查连接是否仍然有效
      if (typeof socketTask.value.close === 'function') {
        socketTask.value.close({
          code: 1000,
          reason: '组件卸载'
        });
      }
    } catch (e) {
      console.log('组件卸载时关闭WebSocket连接出错:', e);
    }
    socketTask.value = null;
  }
});
</script>

<template>
  <view class="ai-assistant" :class="themeClass">
    <!-- 悬浮按钮 -->
    <view class="assistant-button" @tap="toggleAssistant">
      <image class="assistant-icon" src="../../static/images/ai-assistant/assistant-icon.svg" />
    </view>

    <!-- 对话框 -->
    <view class="assistant-dialog" v-if="isExpanded">
      <view class="dialog-header">
        <text class="dialog-title">AI小助手</text>
        <view class="close-button" @tap="toggleAssistant"><text>×</text></view>
      </view>

      <scroll-view :key="scrollKey" class="dialog-messages" scroll-y scroll-with-animation :scroll-top="scrollTop"
        :enable-back-to-top="false" :scroll-anchoring="true" enhanced :show-scrollbar="false">
        <view v-for="(msg, index) in messages" :key="index" class="message"
          :class="msg.role === 'assistant' ? 'assistant-message' : 'user-message'">
          <view class="message-bubble" v-if="msg.content">
            <text>{{ msg.content }}</text>
          </view>
        </view>
        <!-- 显示正在输入的指示器 -->
        <view v-if="isTyping && messages[messages.length - 1]?.content === ''" class="message assistant-message">
          <view class="message-bubble typing-indicator">
            <text>...</text>
          </view>
        </view>

        <!-- 实时滚动指示器 -->
        <view v-if="isTyping" class="scroll-indicator">
          <view class="scroll-dot"></view>
          <text class="scroll-text">实时跟随中...</text>
        </view>
      </scroll-view>

      <view class="dialog-input">
        <input class="message-input" type="text" v-model="inputMessage" placeholder="请输入你的问题..." @confirm="handleSendOrStop"
          confirm-type="send" :disabled="false" />
        <!-- 动态发送/停止按钮 -->
        <view class="send-icon-button" @tap="handleSendOrStop">
          <!-- 输入框无内容时显示空图标 -->
          <image v-if="!inputMessage.trim() && !isTyping" class="send-icon" src="../../static/images/ai-assistant/send-empty.svg" />
          <!-- 输入框有内容时显示发送图标 -->
          <image v-else-if="inputMessage.trim() && !isTyping" class="send-icon" src="../../static/images/ai-assistant/send-filled.svg" />
          <!-- AI生成时显示停止图标 -->
          <image v-else-if="isTyping" class="send-icon" src="../../static/images/ai-assistant/stop-icon.svg" />
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.ai-assistant {
  position: fixed;
  right: 30rpx;
  bottom: 160rpx; // 位于tabBar上方
  z-index: 999;

  &.theme-light {
    // 浅色主题样式
  }

  &.theme-dark {
    // 深色主题样式
  }
}

.assistant-button {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #6A11CB 0%, #2575FC 100%);
  box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: bounce 1s infinite alternate;
}

.assistant-icon {
  width: 60rpx;
  height: 60rpx;
}

.assistant-dialog {
  position: absolute;
  bottom: 120rpx;
  right: 0;
  width: 600rpx;
  height: 800rpx;
  background-color: #fff;
  border-radius: 24rpx;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideIn 0.3s ease-out;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  background: linear-gradient(135deg, #6A11CB 0%, #2575FC 100%);
  color: white;
}

.dialog-title {
  font-size: 32rpx;
  font-weight: bold;
}

.close-button {
  font-size: 40rpx;
  line-height: 1;
  padding: 0 10rpx;
}

.dialog-messages {
  flex: 1;
  padding: 20rpx;
  overflow-y: auto;
  box-sizing: border-box;
  /* 优化滚动性能 */
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  /* 确保内容能够完全显示 */
  padding-bottom: 40rpx;
}

.message {
  margin-bottom: 20rpx;
  display: flex;
  flex-direction: column;
}

.assistant-message {
  align-items: flex-start;

  .message-bubble {
    background-color: #f0f2f5;
    color: #333333;
    border-radius: 18rpx 18rpx 18rpx 0;
    position: relative;
    z-index: 1;
  }
}

.user-message {
  align-items: flex-end;

  .message-bubble {
    background-color: #2575FC;
    color: white;
    border-radius: 18rpx 18rpx 0 18rpx;
  }
}

.message-bubble {
  max-width: 80%;
  padding: 16rpx 24rpx;
  font-size: 28rpx;
  line-height: 1.4;
  word-break: break-word;
  min-height: 40rpx;
  display: flex;
  align-items: center;

  text {
    color: inherit;
    font-size: inherit;
  }
}

.typing-indicator {
  padding: 16rpx 24rpx;

  text {
    display: inline-block;
    animation: typing 1.5s infinite;
  }
}

@keyframes typing {
  0% {
    opacity: 0.3;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0.3;
  }
}

.dialog-input {
  display: flex;
  padding: 20rpx;
  border-top: 2rpx solid #eee;
}

.message-input {
  flex: 1;
  height: 70rpx;
  background-color: #f5f5f5;
  border-radius: 35rpx;
  padding: 0 30rpx;
  font-size: 28rpx;

  &:disabled {
    opacity: 0.7;
  }
}

.send-icon-button {
  width: 70rpx;
  height: 70rpx;
  border-radius: 35rpx;
  margin-left: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
}

.send-icon {
  width: 48rpx;
  height: 48rpx;
  transition: all 0.2s ease;
}



.scroll-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10rpx;
  margin-top: 10rpx;
  opacity: 0.6;
}

.scroll-dot {
  width: 12rpx;
  height: 12rpx;
  background: #2575FC;
  border-radius: 50%;
  margin-right: 10rpx;
  animation: pulse 1.5s infinite;
}

.scroll-text {
  font-size: 24rpx;
  color: #666;
}



@keyframes bounce {
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(-10rpx);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }

  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>