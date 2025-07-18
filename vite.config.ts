import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import viteVueUnocss, { unocss, flex } from "./src/js_sdk/a-hua-unocss";

// https://vitejs.dev/config/
export default defineConfig(async () => {
  return {
    plugins: [
      uni(),
      viteVueUnocss({
        /** 预设数组；默认[unocss()] */
        presets: [
          /**
           * 默认预设；
           * text-24、uno-text-24、xx-text-24
           */
          unocss(),
          flex(),
        ],
      }),
    ],
    resolve: {
      alias: {
        "@": "/src",
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          // 取消sass废弃API的报警
          silenceDeprecations: ["legacy-js-api", "color-functions", "import"],
        },
      },
    },
  };
});
