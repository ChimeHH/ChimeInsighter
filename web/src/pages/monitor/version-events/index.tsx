import React, { useEffect, useState } from 'react';
import { Card, message, Row, Col, Select, Button } from 'antd'; 
import { useIntl, history } from 'umi';
import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import { getMonitorVersionEvents } from './service'; 
import { getProjects } from '../../components/project/service'; 
import { selectVersions } from '../../components/version/service'; 
import { Project, Version, Event } from './data'; 
import moment from 'moment'; 

const { Option } = Select; 

const VersionEventsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<Event[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [projects, setProjects] = useState<{ project_id: string; project_name: string }[]>([]);
  const [versions, setVersions] = useState<{ version_id: string; version_name: string }[]>([]);
  const { formatMessage } = useIntl();

  // 获取项目列表
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await getProjects(); // 获取整个项目列表
      const projectList = res.data.projects.map(project => ({
        project_id: project.project_id,
        project_name: project.project_name,
      }));
      setProjects(projectList); // 设置项目列表
      message.success(formatMessage({ id: 'pages.message.getList.success' }));
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      message.error(formatMessage({ id: 'pages.message.getList.error' }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(); // 初次加载获取项目列表
  }, []);

  useEffect(() => {
    const fetchVersions = async () => {
      if (selectedProject) {
        setLoading(true);
        try {
          const res = await selectVersions({ project_id: selectedProject }); // 使用 selectVersions 获取版本
          const versionList = res.data.versions.map(version => ({
            version_id: version.version_id,   // 读取 version_id
            version_name: version.version_name, // 读取 version_name
          }));
          setVersions(versionList); // 设置版本列表
        } catch (error) {
          console.error("Failed to fetch versions:", error);
          setVersions([]);
        } finally {
          setLoading(false);
        }
      } else {
        setVersions([]);
      }
    };

    fetchVersions();
  }, [selectedProject]);

  const getEvents = async () => {
    if (selectedVersion) {
      setLoading(true);
      try {
        const res = await getMonitorVersionEvents(selectedVersion); // 使用 version_id 获取事件
        if (res) {
          setDataSource(res.data.events); // 设置事件数据
          message.success(formatMessage({ id: 'pages.message.getList.success' }));
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
        message.error(formatMessage({ id: 'pages.message.getList.error' }));
      } finally {
        setLoading(false);
      }
    }
  };

  const columns: ProColumns<Event>[] = [
    {
      title: formatMessage({ id: 'pages.event.title.cveId' }),
      dataIndex: 'cve_id',
      width: 200,
      hideInSearch: true,
      render: (text, record) => (
          <a 
              onClick={() => history.push(`/helpcenter/vulnerability/${record.cve_id}`)} // 跳转到指定路径
              style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
          >
              {record.cve_id}
          </a>
      ),
    },
    {
      title: formatMessage({ id: 'pages.event.title.product' }),
      dataIndex: 'component',
      width: 200,
      hideInSearch: true,
      render: (component) => component.product,
    },
    {
      title: formatMessage({ id: 'pages.event.title.vendor' }),
      dataIndex: 'component',
      width: 200,
      hideInSearch: true,
      render: (component) => component.vendor,
    },
    {
      title: formatMessage({ id: 'pages.event.title.version' }),
      dataIndex: 'component.version', // 确保获取的字段为 component.version
      width: 200,
      hideInSearch: true,
      render: (text, record) => record.component.version, // 确保正确显示
    },
    {
      title: formatMessage({ id: 'pages.event.title.description' }),
      dataIndex: 'description',
      width: 300,
      hideInSearch: true,
    },
    {
      title: formatMessage({ id: 'pages.event.title.lastModified' }),
      dataIndex: 'last_modified_date',
      width: 200,
      hideInSearch: true,
    },
    {
      title: formatMessage({ id: 'pages.event.title.exploitId' }),
      dataIndex: 'exploits',
      width: 200,
      hideInSearch: true,
      render: (exploits) => (
          <>
              {Object.keys(exploits).map(exploitId => (
                  <div key={exploitId}>
                      <a 
                          onClick={() => history.push(`/helpcenter/exploit/${exploitId}`)} // 跳转到指定路径
                          style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                      >
                          {exploitId}
                      </a>
                  </div>
              ))}
          </>
      ),
    },
  
    {
      title: formatMessage({ id: 'pages.event.title.reason' }),
      dataIndex: 'reason',
      width: 200,
      hideInSearch: true,
      render: (reason) => {
          return formatMessage({ id: `pages.monitorEventReasons.${reason}` }) || reason;
      },
    },
  ];

  return (
    <Card>
        <Row gutter={2} style={{ marginBottom: 16 }}>
            <Col span={5}>
                <Select
                    style={{ width: '200px' }}
                    placeholder={formatMessage({ id: 'pages.select.placeholder.project' })}
                    onChange={value => {
                        setSelectedProject(value);
                        setSelectedVersion(null); // 清空已选的版本
                        setDataSource([]); // 清空事件数据
                    }}>
                    {projects.map(project => (
                        <Option key={project.project_id} value={project.project_id}>{project.project_name}</Option>
                    ))}
                </Select>
            </Col>
            <Col span={5}>
                <Select
                    style={{ width: '200px' }}
                    placeholder={formatMessage({ id: 'pages.select.placeholder.version' })}
                    value={selectedVersion}
                    onChange={value => setSelectedVersion(value)}>
                    {versions.map(version => (
                        <Option key={version.version_id} value={version.version_id}>{version.version_name}</Option>
                    ))}
                </Select>
            </Col>
            <Col span={5}>
                <Button 
                    type="primary" 
                    onClick={getEvents} 
                    disabled={!selectedVersion} 
                    style={{ width: '60px' }} 
                >
                    {formatMessage({ id: 'pages.buttons.query' })} 
                </Button>
            </Col>
        </Row>

        <ProTable<Event>
            search={{ defaultCollapsed: false, optionRender: false, labelWidth: 120 }}
            rowKey="cve_id"
            size="small"
            loading={loading}
            dataSource={dataSource}
            pagination={{
                pageSize: 10,
                showQuickJumper: true,
            }}
            columns={columns} // 使用定义的 columns
            scroll={{ x: 800 }} // 可滚动
            bordered
        />
    </Card>
  );
};

export default VersionEventsPage;
