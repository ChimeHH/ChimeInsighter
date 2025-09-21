import { request } from 'umi';

export async function serviceStatus(token?: string) {
  return request<API.Response<{ Status: Record<string, string> }>>('/api/service_status', {
    params: {
      token,
    },
  });
}

export async function ServiceStart(serviceName: string) {
  return request<API.Response<Record<string, string>>>('/api/service_start', {
    params: {
      service: serviceName,
    }
  });
}

export async function ServiceStop(serviceName: string) {
  return request<API.Response<Record<string, string>>>('/api/service_stop', {
    params: {
      service: serviceName,
    }
  });
}

// 更新缓存的信息结构，增加 watermark 字段
let cachedVendorInfo: {
  to_whom: string;
  title: string;
  subTitle: string;
  watermark?: string;
} | null = null;

export const fetchVendorInfo = async () => {
  // 如果缓存中已有信息，则直接返回缓存
  if (cachedVendorInfo) {
    return cachedVendorInfo;
  }

  try {
    const response = await request<API.Response<{ to_whom?: string; title?: string; subTitle?: string; watermark?: string }>>('/api/license/vendor', {
      method: 'GET',
    });

    if (response && response.data) {
      cachedVendorInfo = {
        to_whom: response.data.to_whom || '', // 默认设置为空字符串
        title: response.data.title || '', // 默认设置为空字符串
        subTitle: response.data.subTitle || '', // 默认设置为空字符串
        watermark: response.data.watermark || '', // 默认设置为空字符串
      };
      return cachedVendorInfo;
    }
  } catch (error) {
    console.warn('获取 to_whom 信息失败：', error);
  }

  // 返回默认值或处理失败的响应
  return {
    to_whom: '', // 默认设置为空字符串
    title: '', // 默认设置为空字符串
    subTitle: '', // 默认设置为空字符串
    watermark: '', // 默认设置为空字符串
  };
};
