import request from "@/utils/request";

export type Result = {
	success : boolean;
	message : string;
	data ?: any;
}

export type EmojiListResult = {
	success : boolean;
	message : string;
	data : {
		list : any[];
		currentPage : number;
		pageSize : number;
		total : number;
	};
};


/** 获取Emoji表情包 */
export const getEmojis = () => {
	return request<EmojiListResult>({
		url: "app/emoji/list",
		method: "POST",
	});
};