import { computed } from "vue";
export const getAssetsImages = computed(() => (name: string, type = "png") => {
  console.log("获取本地图片");
  /**
   * 获取本地图
   * @param name // 文件名 如 home-bg
   * @param type // 文件类型 如 png jpg
   * @returns {*|string}
   */
  const path = `/src/static/images/${name}.${type}`;
  const modules = import.meta.glob("/src/static/images/*/*", { eager: true });
  if (modules[path]) {
    return modules[path]?.default;
  } else {
    console.error(`图片路径 ${path} 不存在`);
    return "";
  }
});

// 已删除未使用的derangedArray函数

/** 格式化token（jwt格式） */
export const formatToken = (token: string): string => {
  return "Bearer " + token;
};

/** 计算距离当前时间的整点小时数） */
export const formatTimeDifference = (targetTime: string): string=> {
	// 当前时间
	const now = new Date();
	// 目标时间
	const target = new Date(targetTime);
  
	// 检查时间格式是否有效
	if (isNaN(target.getTime())) {
	  throw new Error("Invalid time format");
	}
  
	// 计算时间差（毫秒）
	const diffMs = now.getTime() - target.getTime();
	const diffMinutes = Math.floor(diffMs / (1000 * 60)); // 分钟差
	const diffHours = Math.floor(diffMs / (1000 * 60 * 60)); // 小时差
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)); // 天数差
  
	// 小于1分钟
	if (diffMinutes < 1) {
	  return "刚刚";
	}
  
	// 小于1小时
	if (diffHours < 1) {
	  return `${diffMinutes}分钟前`;
	}
  
	// 小于1天
	if (diffDays < 1) {
	  return `${diffHours}小时前`;
	}
  
	// 大于1天小于2天（昨天）
	if (diffDays === 1) {
	  const hours = target.getHours().toString().padStart(2, "0");
	  const minutes = target.getMinutes().toString().padStart(2, "0");
	  return `昨天 ${hours}:${minutes}`;
	}
  
	// 大于1年
	const diffYears = Math.floor(diffDays / 365);
	if (diffYears >= 1) {
	  return `${diffYears}年前`;
	}
  
	// 大于1个月
	const diffMonths = Math.floor(diffDays / 30);
	if (diffMonths >= 1) {
	  return `${diffMonths}月前`;
	}
  
	// 大于2天但小于1个月
	return `${diffDays}天前`;
  }
  
  export const covetUniNumber = (n: number | string, defaultUnit = 'rpx'): string => {
    if (typeof n === 'number') {
        return `${n}${defaultUnit}`
    }
    let unit = getUnit(n, defaultUnit);
    let zhi = n.match(/\d+(\.\d+)?/g);
    let real = '0'
    if (zhi) {
        real = zhi[0]
    }
    if (unit === 'rpx' && defaultUnit == 'px') {
        return uni.upx2px(Number(real)).toString() + unit;
    }
    if (unit == 'auto') return unit;
    return real + unit;
}

export const getUnit = (n: string | number, defaultUnit = 'rpx'): string => {
    if (typeof n === 'number') {
        return defaultUnit;
    }
    const unit = n.match(/[a-zA-Z|%|auto]+/g);
    if (!unit || !Array.isArray(unit) || unit?.length === 0) return defaultUnit;
    return unit[0];
}

// 将 Unicode 码点字符串转换为表情符号
export const convertToEmoji = (codePointString:string) =>{
      // 移除 "U+" 前缀，提取十六进制码点
      const hexCode = codePointString.replace("U+", "");
      // 将十六进制转换为整数
      const codePoint = parseInt(hexCode, 16);
      // 使用 String.fromCodePoint 转换为表情符号
      return String.fromCodePoint(codePoint);
    }