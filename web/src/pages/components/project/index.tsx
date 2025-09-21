import { PlusOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-table';
import { ProTable } from '@ant-design/pro-table';
import { Button, message, Popconfirm } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { history, useModel, useIntl, getLocale } from 'umi';
import EditModal from './components/EditModal';
import PermissionModal from './components/PermissionModal'; // 确保路径正确
import CreateProjectModal from './components/CreateProjectModal'; // 确保路径正确
import {
  removeProjects, // 确保导入 removeProjects 函数
  createProject,
  getProjects,
  updateProject, // 替代 updateProjectUsers
  getProjectSummary, // 替代 getProjectUsers
} from './service'; // 确保正确导入服务函数
import { DeleteProjectResponse, GetProjectsResponse, Project } from './data.d'; // 确保正确导入类型定义

const baseMessageId = 'pages.table';

const locale = getLocale();

const ProjectTable: React.FC = () => {  
  const { initialState } = useModel('@@initialState');
  const { run } = useModel('user');
  const [actionType, setActionType] = useState<string>('');
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState<Partial<Project> | undefined>();
  const [dataSource, setDataSource] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { formatMessage } = useIntl();
  const role = initialState?.currentUser?.role?.toLocaleLowerCase();
  const { projectArr, saveProjects } = useModel('data', (ret) => ({
    projectArr: ret.projects,
    saveProjects: ret.saveProjects,
  }));

  const getData = async () => {
    setLoading(true);
    try {
      const res: GetProjectsResponse = await getProjects();
      const projects = res?.data?.projects;
      if (Array.isArray(projects)) {
        setDataSource(projects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeProject = async (project_id: string) => {
    try {
      const res: DeleteProjectResponse = await removeProjects([project_id]);
      if (res.status_code === 0) {
        message.success(formatMessage({ id: `${baseMessageId}.message.deleteSuccess` }));
        getData();
      } else {
        message.error(formatMessage({ id: `${baseMessageId}.message.deleteFailed` }));
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const columns: ProColumns<Project>[] = [
    {
      title: formatMessage({ id: `${baseMessageId}.title.projectId` }),
      dataIndex: 'project_id',
      width: 200,
      sorter: (a, b) => a.project_id.localeCompare(b.project_id),
    },
    {
      title: formatMessage({ id: `${baseMessageId}.title.projectName` }),
      dataIndex: 'project_name',
      width: 160,
      sorter: (a, b) => a.project_name.localeCompare(b.project_name),
    },
    {
      title: formatMessage({
        id: `${baseMessageId}.title.updatedTime`,
      }),
      width: 140,
      sorter: (a, b) =>
        new Date(a.updated_time).getTime() -
        new Date(b.updated_time).getTime(),
      render: (_text, entity) => moment(entity.updated_time).format('YYYY-MM-DD'),
    },
    {
      title: formatMessage({ id: `${baseMessageId}.title.department` }),
      dataIndex: 'department',
      width: 160,
      render: (text) => text || '-', // 如果 department 不存在，显示 '-'
    },
    {
      title: formatMessage({ id: `${baseMessageId}.title.description` }),
      dataIndex: 'description',
      width: 200,
      render: (text) => text || '-', // 如果 description 不存在，显示 '-'
    },
    {
      title: formatMessage({ id: `${baseMessageId}.title.creater` }),
      dataIndex: 'creater',
      width: 160,
      hideInTable: true, // 默认不显示
      render: (text) => text || '-', // 如果 creater 不存在，显示 '-'
    },
    {
      title: formatMessage({ id: `${baseMessageId}.title.vendors` }),
      dataIndex: 'vendors',
      width: 200,
      hideInTable: true, // 默认不显示
      render: (text) => (text ? (text as string[]).join(', ') : '-'), // 如果 vendors 不存在，显示 '-'
    },
    {
      title: formatMessage({ id: `${baseMessageId}.title.customerized_data` }),
      dataIndex: 'customerized_data',
      width: 200,
      hideInTable: true, // 默认不显示
      render: (text) => (text ? JSON.stringify(text) : '-'), // 如果 customerized_data 不存在，显示 '-'
    },
    {
      title: formatMessage({ id: `${baseMessageId}.title.action` }),
      valueType: 'option',
      width: locale === 'zh-CN' ? 140 : 160,
      render: (_, record) => {
        const projectRoles = record.user_project_roles;
        const isOwner = !projectRoles?.length;
        const isAdmin = projectRoles?.includes('admin') && role !== 'member';
        const actions = [
          <a
            key="versions"
            onClick={() => {
              if (!projectArr.find((item) => item.project_id === record.project_id)) {
                saveProjects([...projectArr, record]);
              }

              history.push(`/components/default/${record.project_id}`);
            }}
          >
            {formatMessage({ id: `${baseMessageId}.action.versions` })}
          </a>,
          <a
            key="summary"
            onClick={async () => {
              const summary = await getProjectSummary(record.project_id);
              if (summary.status_code === 0) {
                setActionType('edit');
                setCurrent(summary.data);
                setVisible(true);
              } else {
                message.error(formatMessage({ id: `${baseMessageId}.message.getProjectSummaryFailed` }));
              }
            }}
          >
            {formatMessage({ id: `${baseMessageId}.action.summary` })}
          </a>,
          <a
            key="updateUsers"
            onClick={() => {
              setActionType('editUsers');
              setCurrent(record);
              setVisible(true);
            }}
          >
            {formatMessage({ id: `${baseMessageId}.action.updateUsers` })}
          </a>,
          <Popconfirm
            key="delete"
            title={formatMessage({ id: `${baseMessageId}.project.deleteConfirm` })}
            onConfirm={() => removeProject(record.project_id)}
          >
            <a>{formatMessage({ id: `${baseMessageId}.action.delete` })}</a>
          </Popconfirm>,
        ];
        if (isOwner || isAdmin) {
          return actions;
        }

        return actions.slice(0, 1);
      },
      fixed: 'right',
    },
  ];

  const addProject = async (data: Partial<Project>) => {
    // 确保 scan_options.scan_types 是一个对象
    if (data.scan_options && Array.isArray(data.scan_options.scan_types)) {
      const scanTypesObj: { [key: string]: boolean } = {};
      data.scan_options.scan_types.forEach(type => {
        scanTypesObj[type] = true;
      });
      data.scan_options.scan_types = scanTypesObj;
    }
  
    const res = await createProject(data);
    return res;
  };
  

  const updateProjectInfo = async (data: Partial<Project>) => {
    const projectRes = await updateProject({
      project_id: data.project_id!,
      updates: {
        project_name: data.project_name,
        description: data.description,
        vendors: data.vendors,
        department: data.department,
        customerized_data: data.customerized_data,
        scan_options: data.scan_options,
        candidates: data.candidates,
        users: data.users,
      },
    });
    return projectRes;
  };

  const handleSubmit = async (data: Partial<Project>) => {
    const functionMap = {
      add: addProject,
      edit: updateProjectInfo,
      editUsers: updateProjectInfo, // 使用 updateProjectInfo 替代 updateProjectUsersInfo
    };

    const hide = message.loading(formatMessage({ id: `${baseMessageId}.message.loading` }));
    const res = await functionMap[actionType](data);
    hide();

    if (res.status_code === 0) {
      const tip = formatMessage({ id: `${baseMessageId}.message.${actionType}Success` });
      message.success(tip);
      setVisible(false);
      getData();
    }
  };

  useEffect(() => {
    run();
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ProTable<Project>
        rowKey="project_id"
        search={false}
        size="small"
        options={{
          density: false,
          fullScreen: false,
          reload: () => {
            setLoading(true);
            getData();
          },
          setting: true, // 确保设置选项可见
        }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
        }}
        toolBarRender={() =>
          role !== 'member'
            ? [
                <Button
                  type="primary"
                  key="add"
                  onClick={() => {
                    setActionType('add');
                    setVisible(true);
                    setCurrent(undefined);
                  }}
                >
                  <PlusOutlined /> {formatMessage({ id: `${baseMessageId}.action.add` })}
                </Button>,
              ]
            : []
        }
        loading={loading}
        dataSource={dataSource}        
        columns={columns}
        scroll={{ x: 640 }}
        bordered
      />
      {actionType === 'add' ? (
        <CreateProjectModal
          visible={visible}
          onCancel={() => {
            setCurrent(undefined);
            setVisible(false);
          }}
          onSubmit={handleSubmit}
          formatMessage={formatMessage}
        />
      ) : actionType === 'edit' ? (
        <EditModal
          visible={visible}
          type={actionType}
          current={current}
          onCancel={() => {
            setCurrent(undefined);
            setVisible(false);
          }}
          onSubmit={handleSubmit}          
          formatMessage={formatMessage}
        />
      ) : (
        <PermissionModal
          visible={visible}
          type={actionType}
          current={current}
          onCancel={() => {
            setCurrent(undefined);
            setVisible(false);
          }}
          onSubmit={handleSubmit}          
          formatMessage={formatMessage}
        />
      )}
    </>
  );
};

export default ProjectTable;
