// https://umijs.org/config/
import { defineConfig } from 'umi';

export default defineConfig({
  plugins: [
    // https://github.com/zthxxx/react-dev-inspector
    'react-dev-inspector/plugins/umi/react-inspector',
  ],
  // https://github.com/zthxxx/react-dev-inspector#inspector-loader-props
  inspectorConfig: {
    exclude: [],
    babelPlugins: [],
    babelOptions: {},
  },
  //自定义环境变量
  define: {
    WEB_IMAGE_SRC: '/images/', //图片路径
    RICH_IMAGE_SRC: '/images/rich-text/', //富文本图片路径
    FILE_SRC: '/files/', //文件路径
  },
  locale: {
    // default: 'en-US', //默认语言,注释掉后默认浏览器语言
    antd: true,
    baseNavigator: true,
  },
});
