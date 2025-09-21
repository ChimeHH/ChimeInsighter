const TOKEN_KEY = 'loginInfo';

export function setLoginInfo(loginInfo: API.LoginInfo) {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(loginInfo));
}

/**
 * 获取tokens
 * @returns 返回tokens或者undefined
 */
export function getLoginInfo(): API.LoginInfo | undefined {
  const loginInfo = localStorage && localStorage.getItem(TOKEN_KEY);
  if (loginInfo) {
    return JSON.parse(loginInfo);
  }
  return undefined;
}

/**
 * 移除tokens
 */
export function removeLoginInfo(): void {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * 通过正则替换文本
 * @param val 需要替换的文本
 * @returns 格式化后文本
 */
const convertIdeogramToNormalCharacter = (val: string) => {
  const arrEntities = { lt: '<', gt: '>', nbsp: ' ', amp: '&', quot: '"' };
  return val.replace(/&(lt|gt|nbsp|amp|quot);/gi, function (all, t) {
    return arrEntities[t];
  });
};

/**
 * 替换html标签
 * @param richCont 需要替换的文本
 * @returns 格式化后文本
 */
export const getPlainText = (richCont: string) => {
  let value = richCont;
  if (richCont) {
    value = value.replace(/\s*/g, ''); //去掉空格
    value = value.replace(/<[^>]+>/g, ''); //去掉所有的html标记
    value = value.replace(/↵/g, ''); //去掉所有的↵符号
    value = value.replace(/[\r\n]/g, ''); //去掉回车换行
    value = value.replace(/&nbsp;/g, ''); //去掉空格
    value = convertIdeogramToNormalCharacter(value);
    return value;
  } else {
    return null;
  }
};

/**
 * 判断是否IOS
 * @returns 判断值
 */
export const isIOS = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const iphone = userAgent.includes('iphone');
  const ipad = userAgent.includes('ipad');
  if (iphone || ipad) {
    return true;
  }
  return false;
};

/**
 * 打开链接
 * @param url 链接
 */
export const openUrl = (url: string) => {
  if (!url) return;

  if (isIOS()) {
    window.location.href = url;
  } else {
    window.open(url);
  }
};

export const download = (res: any, fileName?: string) => {
  const contentDisposition = res.response.headers.get('content-disposition');
  const filename = fileName ?? contentDisposition!.split(';')[1].replaceAll('filename=', '');
  const a = document.createElement('a');
  document.body.appendChild(a); // 此写法兼容可火狐浏览器
  a.style.display = 'none';
  a.href = window.URL.createObjectURL(
    new Blob([res.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    }),
  );
  a.setAttribute('download', filename);
  a.click();
  document.body.removeChild(a);
};

export const loadMessages = async (locale: string) => {
  switch (locale) {
    case 'en-US':
      return await import('@/locales/en-US/messages.js');
    case 'zh-CN':
      return await import('@/locales/zh-CN/messages.js');
    case 'de-DE':
      return await import('@/locales/de-DE/messages.js');
    case 'fr-FR':
      return await import('@/locales/fr-FR/messages.js');
    case 'ja-JP':
      return await import('@/locales/ja-JP/messages.js');
    case 'ko-KR':
      return await import('@/locales/ko-KR/messages.js');
    case 'ru-RU':
      return await import('@/locales/ru-RU/messages.js');
    case 'zh-TW':
      return await import('@/locales/zh-TW/messages.js');
    // 根据需要添加更多语言
    default:
      return await import('@/locales/en-US/messages.js'); // 默认语言
  }
};