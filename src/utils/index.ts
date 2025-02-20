
import { computed } from 'vue'
export const getAssetsImages = computed(() => (name : string, type = 'png') => {
	console.log('获取本地图片')
	/**
	 * 获取本地图
	 * @param name // 文件名 如 home-bg
	 * @param type // 文件类型 如 png jpg
	 * @returns {*|string}
	 */
	const path = `/src/static/images/${name}.${type}`
	const modules = import.meta.glob('/src/static/images/*/*', { eager: true })
	if (modules[path]) {
        return modules[path]?.default
    } else {
        console.error(`图片路径 ${path} 不存在`)
        return ''
    }
})

export const derangedArray = function(arr: any[]) {
	for(var j, x, i = arr.length; i; j = Math.floor(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
	return arr;
};