<template>
  <view class="calculator">
    <!-- 顶部导航 -->
    <view class="nav-bar">
      <view class="nav-title">计算器</view>
    </view>
    
    <!-- 显示屏 -->
    <view class="display">
      <view class="display-text">{{ displayValue }}</view>
    </view>
    
    <!-- 按钮区域 -->
    <view class="buttons">
      <!-- 第一行：清除、删除、百分号、除法 -->
      <view class="button-row">
        <view class="button function" @click="clear">C</view>
        <view class="button function" @click="deleteLast">⌫</view>
        <view class="button function" @click="inputOperator('%')">%</view>
        <view class="button operator" @click="inputOperator('÷')">÷</view>
      </view>
      
      <!-- 第二行：7、8、9、乘法 -->
      <view class="button-row">
        <view class="button number" @click="inputNumber('7')">7</view>
        <view class="button number" @click="inputNumber('8')">8</view>
        <view class="button number" @click="inputNumber('9')">9</view>
        <view class="button operator" @click="inputOperator('×')">×</view>
      </view>
      
      <!-- 第三行：4、5、6、减法 -->
      <view class="button-row">
        <view class="button number" @click="inputNumber('4')">4</view>
        <view class="button number" @click="inputNumber('5')">5</view>
        <view class="button number" @click="inputNumber('6')">6</view>
        <view class="button operator" @click="inputOperator('-')">-</view>
      </view>
      
      <!-- 第四行：1、2、3、加法 -->
      <view class="button-row">
        <view class="button number" @click="inputNumber('1')">1</view>
        <view class="button number" @click="inputNumber('2')">2</view>
        <view class="button number" @click="inputNumber('3')">3</view>
        <view class="button operator" @click="inputOperator('+')">+</view>
      </view>
      
      <!-- 第五行：0、小数点、等号 -->
      <view class="button-row">
        <view class="button number zero" @click="inputNumber('0')">0</view>
        <view class="button number" @click="inputDecimal">.</view>
        <view class="button equals" @click="calculate">=</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 显示值
const displayValue = ref('0')
// 当前输入的数字
const currentInput = ref('')
// 上一个操作数
const previousInput = ref('')
// 当前操作符
const operator = ref('')
// 是否等待新的操作数
const waitingForOperand = ref(false)

// 输入数字
const inputNumber = (num: string) => {
  if (waitingForOperand.value) {
    currentInput.value = num
    waitingForOperand.value = false
  } else {
    currentInput.value = currentInput.value === '0' ? num : currentInput.value + num
  }
  displayValue.value = currentInput.value
}

// 输入小数点
const inputDecimal = () => {
  if (waitingForOperand.value) {
    currentInput.value = '0.'
    waitingForOperand.value = false
  } else if (currentInput.value.indexOf('.') === -1) {
    currentInput.value += '.'
  }
  displayValue.value = currentInput.value
}

// 输入操作符
const inputOperator = (nextOperator: string) => {
  const inputValue = parseFloat(currentInput.value)
  
  if (previousInput.value === '') {
    previousInput.value = currentInput.value
  } else if (operator.value) {
    const currentValue = parseFloat(previousInput.value)
    const newValue = performCalculation(currentValue, inputValue, operator.value)
    
    displayValue.value = String(newValue)
    previousInput.value = String(newValue)
    currentInput.value = String(newValue)
  }
  
  waitingForOperand.value = true
  operator.value = nextOperator
}

// 执行计算
const performCalculation = (firstOperand: number, secondOperand: number, operator: string): number => {
  switch (operator) {
    case '+':
      return firstOperand + secondOperand
    case '-':
      return firstOperand - secondOperand
    case '×':
      return firstOperand * secondOperand
    case '÷':
      return secondOperand !== 0 ? firstOperand / secondOperand : 0
    case '%':
      return firstOperand % secondOperand
    default:
      return secondOperand
  }
}

// 计算结果
const calculate = () => {
  const inputValue = parseFloat(currentInput.value)
  
  if (previousInput.value !== '' && operator.value) {
    const currentValue = parseFloat(previousInput.value)
    const newValue = performCalculation(currentValue, inputValue, operator.value)
    
    displayValue.value = String(newValue)
    currentInput.value = String(newValue)
    previousInput.value = ''
    operator.value = ''
    waitingForOperand.value = true
  }
}

// 清除所有
const clear = () => {
  displayValue.value = '0'
  currentInput.value = ''
  previousInput.value = ''
  operator.value = ''
  waitingForOperand.value = false
}

// 删除最后一位
const deleteLast = () => {
  if (currentInput.value.length > 1) {
    currentInput.value = currentInput.value.slice(0, -1)
    displayValue.value = currentInput.value
  } else {
    currentInput.value = '0'
    displayValue.value = '0'
  }
}
</script>

<style scoped>
.calculator {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
}

.nav-bar {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.nav-title {
  font-size: 36rpx;
  font-weight: 600;
  color: white;
}

.display {
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 40rpx;
  background: rgba(0, 0, 0, 0.1);
}

.display-text {
  font-size: 80rpx;
  font-weight: 300;
  color: white;
  text-align: right;
  word-break: break-all;
  max-width: 100%;
}

.buttons {
  padding: 20rpx;
  background: rgba(255, 255, 255, 0.05);
}

.button-row {
  display: flex;
  margin-bottom: 20rpx;
  gap: 20rpx;
}

.button {
  flex: 1;
  height: 120rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 60rpx;
  font-size: 40rpx;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.button:active {
  transform: scale(0.95);
}

/* 数字按钮 */
.button.number {
  background: rgba(255, 255, 255, 0.9);
  color: #333;
}

.button.number:hover {
  background: rgba(255, 255, 255, 1);
}

/* 0按钮占两格 */
.button.zero {
  flex: 2;
}

/* 操作符按钮 */
.button.operator {
  background: #ff9500;
  color: white;
}

.button.operator:hover {
  background: #ffad33;
}

/* 功能按钮 */
.button.function {
  background: rgba(255, 255, 255, 0.3);
  color: white;
}

.button.function:hover {
  background: rgba(255, 255, 255, 0.4);
}

/* 等号按钮 */
.button.equals {
  background: #ff9500;
  color: white;
  flex: 1;
}

.button.equals:hover {
  background: #ffad33;
}

/* 响应式设计 */
@media (max-width: 750rpx) {
  .display-text {
    font-size: 60rpx;
  }
  
  .button {
    height: 100rpx;
    font-size: 36rpx;
  }
}
</style>