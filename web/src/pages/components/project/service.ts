import { request } from 'umi';

// 定义ScanOptions枚举
enum ScanOptions {
  SCAN_TYPES = 'scan_types',
  RAW_BINARY = 'raw_binary',
}

// 定义ScanTypes枚举
enum ScanTypes {
  SBOM = 'sbom',
  PUBLIC = 'public',
  ZERODAY = 'zeroday',
  MOBILE = 'mobile',
  INFOLEAK = 'infoleak',
  MALWARE = 'malware',
  PASSWORD = 'password',
  MISCONFIGURATION = 'misconfiguration',
}

// 获取项目列表
export function getProjects(project_names?: string[]) {
  return request<API.Response<{ projects: Project[] }>>('/api/projects', {
    method: 'GET',
    params: {
      project_names,
    },
  });
}

export function createProject(data: {
  project_name: string;
  description?: string;
  vendors?: string[];
  department?: string;
  logo_file?: string;
  scan_options?: {
    scan_types?: { [key: string]: boolean };
    raw_binary?: boolean;
  };
  customerized_data?: any;
}) {
  // console.log('Input data:', data); // 打印输入参数

  const formData = new FormData();
  formData.append('project_name', data.project_name);

  if (data.description) {
    formData.append('description', data.description);
  }

  if (data.vendors) {
    data.vendors.forEach((vendor, index) => {
      formData.append(`vendors[${index}]`, vendor);
    });
  }

  if (data.department) {
    formData.append('department', data.department);
  }

  if (data.logo_file) {
    formData.append('logo_file', data.logo_file);
  }
  
  if (data.scan_options) {
    if (data.scan_options.scan_types) {
      for (const key in data.scan_options.scan_types) {
        if (data.scan_options.scan_types.hasOwnProperty(key)) {
          formData.append(`scan_options.scan_types.${key}`, data.scan_options.scan_types[key].toString());
        }
      }
    }
    if (data.scan_options.raw_binary !== undefined) {
      formData.append('scan_options.raw_binary', data.scan_options.raw_binary.toString());
    }
  }

  if (data.customerized_data !== undefined) {
    formData.append('customerized_data', JSON.stringify(data.customerized_data));
  }

  return request<API.Response<Project>>('/api/projects', {
    method: 'POST',
    body: formData,
  });
}




export function removeProjects(project_ids: string[]) {
  if (!project_ids || project_ids.length === 0) {
    throw new Error('project_ids cannot be empty');
  }

  const params = {};
  project_ids.forEach((id, index) => {
    params[`project_ids[${index}]`] = id;
  });

  return request<API.Response<any>>('/api/projects', {
    method: 'DELETE',
    params: params,
  });
}


export function updateProject(data: {
  project_id: string;
  updates: {
    project_name?: string;
    description?: string;
    vendors?: string[];
    department?: string;
    customerized_data?: any;
    scan_options?: {
      scan_types?: { [key: string]: boolean };
      raw_binary?: boolean;
    };
    users?: { [username: string]: string };
  };
}) {
  const formData = new FormData();
  formData.append('project_id', data.project_id);

  for (const key in data.updates) {
    if (data.updates.hasOwnProperty(key)) {
      const value = data.updates[key];

      if (value === undefined) {
        continue;
      }

      if (key === 'vendors' && Array.isArray(value)) {
        value.forEach((vendor, index) => {
          formData.append(`updates.vendors[${index}]`, vendor);
        });
      } else if (key === 'scan_options' && typeof value === 'object') {
        for (const optionKey in value) {
          if (value.hasOwnProperty(optionKey)) {
            const optionValue = value[optionKey];
            if (optionValue === undefined) {
              continue;
            }
            if (optionKey === 'scan_types' && typeof optionValue === 'object') {
              for (const typeKey in optionValue) {
                if (optionValue.hasOwnProperty(typeKey)) {
                  const typeValue = optionValue[typeKey];
                  if (typeValue === undefined) {
                    continue;
                  }
                  formData.append(`updates.scan_options.scan_types.${typeKey}`, typeValue.toString());
                }
              }
            } else {
              formData.append(`updates.scan_options.${optionKey}`, optionValue.toString());
            }
          }
        }
      } else if (key === 'users' && typeof value === 'object') {
        let userIndex = 0;
        for (const username in value) {
          if (value.hasOwnProperty(username)) {
            const role = value[username];
            if (role === undefined) {
              continue;
            }
            formData.append(`updates.users[${userIndex}].username`, username);
            formData.append(`updates.users[${userIndex}].role`, role);
            userIndex++;
          }
        }
      } else {
        formData.append(`updates.${key}`, value);
      }
    }
  }

  return request<API.Response<Project>>('/api/projects/update', {
    method: 'POST',
    body: formData,
  });
}




// 获取项目概要
export function getProjectSummary(project_id: string) {
  return request<API.Response<{
    created_time: string;
    creater: string;
    customerized_data: any;
    department: string | null;
    description: string;
    project_id: string;
    project_name: string;
    scan_options: {
      enable_monitor: boolean;
      raw_binary: boolean;
    };
    updated_time: string;
    vendors: string[];    
    candidates: { role: string, username: string }[]; // 修改字段，用于存储候选人
    users: { role: string, username: string }[]; // 修改字段，用于存储用户
  }>>('/api/projects/summary', {
    method: 'GET',
    params: {
      project_id,
    },
  });
}
