import { request } from 'umi';

export function threatTypes() {
  return request<API.Response<{ threat_types: string[] }>>('/api/help/threat_types', {
    method: 'GET',
  });
}

export function threatSubtypes(threatType: string) {
  return request<API.Response<{ threat_subtypes: string[] }>>(`/api/help/threat_subtypes?threat_type=${threatType}`, {
    method: 'GET',
  });
}

export function threatStatuses() {
  return request<API.Response<{ threat_statuses: string[] }>>('/api/help/threat_statuses', {
    method: 'GET',
  });
}

export function scanSettings() {
  return request<API.Response<{ scan_settings: Record<string, any> }>>('/api/help/scan_settings', {
    method: 'GET',
  });
}
