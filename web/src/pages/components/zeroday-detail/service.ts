import { request } from 'umi';
import type { Version } from '../version/data';

export function selectThreatDetail(params: { threat_id: string }) {
  return request<API.Response<{ detail: ZerodayDetail; version: Version }>>(
    '/api/versions/threat',
    {
      params,
    },
  );
}

export function insertSymbol(data: { threat_id: string; file: any }) {
  const formData = new FormData();
  Object.keys(data).forEach((item) => formData.append(item, data[item]));
  return request<API.Response<{ detail: ZerodayDetail; version: Version }>>('/api/versions/add_symbols', {
    method: 'POST',
    data: formData,
  });
}