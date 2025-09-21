type Project = {
  department: string | null;
  project_id: string;
  project_name: string;
  updated_time: string;
  num_of_versions?: number;
  user_project_roles?: string[]; // 新增字段，用于存储用户角色
  created_time?: string; // 新增字段，用于存储创建时间
  creater?: string; // 新增字段，用于存储创建者
  customerized_data?: any; // 新增字段，用于存储自定义数据
  description?: string | null; // 新增字段，用于存储描述
  scan_options?: {
    scan_types?: { [key: string]: boolean }; // 新增字段，用于存储扫描类型
  };
  vendors?: string[] | null; // 新增字段，用于存储供应商
  candidates?: { [key: string]: string }; // 新增字段，用于存储候选人
  users?: { [key: string]: string }; // 新增字段，用于存储用户
};

type DeleteProjectResponse = {
  data: {
    result: string;
  };
  status_code: number;
};

type GetProjectsResponse = {
  data: {
    projects: Project[];
  };
  status_code: number;
};

type CreateProjectResponse = {
  data: {
    project_id: string;
  };
  status_code: number;
};

type UpdateProjectResponse = {
  data: {
    project: Project;
  };
  status_code: number;
};


type GetProjectSummaryResponse = {
  data: Project;
  status_code: number;
};
