import React, { useEffect, useState } from 'react';
import { Card, message, Row, Col, Input, Select, Progress } from 'antd';
import { useIntl, useParams } from 'umi';
import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import { getActiveVersionStatus } from './service'; // 使用getActiveVersionStatus函数
import { ActiveVersionStatusResponse, ProgressInfo } from './data'; // 假设data.d.ts文件中定义了这些类型

const { Option } = Select;

const VersionDetailPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<ActiveVersionStatusResponse[]>([]);
  const [filterFilePath, setFilterFilePath] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [statusOptions, setStatusOptions] = useState<string[]>([]);
  const [progressInfo, setProgressInfo] = useState<ProgressInfo | null>(null);
  const { formatMessage } = useIntl();
  const { vid } = useParams<{ vid: string }>(); // 从路由参数中获取vid

  const getVersions = async (vid: string) => {
    // console.log('Calling API with vid:', vid); // 添加日志输出
    setLoading(true);
    const hide = message.loading(formatMessage({ id: 'pages.version.detail.message.loading' }), 0);
    try {
      const res = await getActiveVersionStatus(vid);
      if (res?.data) {
        hide();
        setLoading(false);
        // message.success(formatMessage({ id: 'pages.version.detail.getList.success' }));
        // console.log('API Response:', res.data.files); // 添加日志输出
        const files = Object.entries(res.data.files).map(([key, value]) => ({
          ...value,
          version_id: key.replace(/^\/\//, '') // 去掉前面的//
        }));
        setDataSource(files);

        // 提取status选项
        const statusSet = new Set<string>();
        files.forEach(file => statusSet.add(file.status));
        setStatusOptions(Array.from(statusSet));

        // 假设res.data中包含progress信息
        if (res.data.progress) {
          setProgressInfo(res.data.progress);
        }
        return;
      }

      hide();
      setLoading(false);
    
    } catch (error) {
      hide(); // 隐藏加载提示      
      setLoading(false);
    }
  };

  useEffect(() => {
    if (vid) {
      // console.log('useEffect triggered with vid:', vid); // 添加日志输出
      getVersions(vid);
    }
  }, [vid]);

  const handleFilePathFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterFilePath(e.target.value);
  };

  const handleStatusFilterChange = (value: string) => {
    setFilterStatus(value);
  };

  const handleReload = () => {
    setLoading(true);
    // 重新加载数据时，也重置过滤条件
    setFilterFilePath('');
    setFilterStatus('');
    getVersions(vid);
  };

  const filteredData = dataSource.filter((item: any) =>
    item.filepath.includes(filterFilePath) && (filterStatus === '' || item.status === filterStatus)
  );

  const columns: ProColumns<ActiveVersionStatusResponse & { version_id: string }>[] = [
    {
      title: formatMessage({ id: 'pages.version.detail.filepath' }),
      dataIndex: 'filepath',
      width: 200,
      hideInSearch: true,
    },
    {
      title: formatMessage({ id: 'pages.version.detail.status' }),
      dataIndex: 'status',
      width: 100,
      hideInSearch: true,
    },
    {
      title: formatMessage({ id: 'pages.version.detail.term_id' }),
      dataIndex: 'term_id',
      width: 200,
      hideInSearch: true,
    },
    {
      title: formatMessage({ id: 'pages.version.detail.worker_name' }),
      dataIndex: 'worker_name',
      width: 200,
      hideInSearch: true,
    },
    {
      title: formatMessage({ id: 'pages.version.detail.createTime' }),
      dataIndex: 'create_time',
      width: 200,
      hideInSearch: true,
      sorter: (a, b) => new Date(a.create_time).getTime() - new Date(b.create_time).getTime(),
    },
    {
      title: formatMessage({ id: 'pages.version.detail.update_time' }),
      dataIndex: 'update_time',
      width: 200,
      hideInSearch: true,
      sorter: (a, b) => new Date(a.update_time).getTime() - new Date(b.update_time).getTime(),
    },
  ];

  return (
    <>
      <Card style={{ marginBottom: 0 }}>
        
        {progressInfo && (
          <Row style={{ marginBottom: 16 }}>
            <Col span={24}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>Total: {progressInfo.scans} ({Math.round(progressInfo.percent * 100)}% Processed)</div>
                <div>Completed: {progressInfo.completed}</div>
                <div style={{ color: 'blue' }}>Failed: {progressInfo.failed}</div>
                <div style={{ color: 'blue' }}>Canceled: {progressInfo.canceled}</div>
                <div style={{ color: 'blue', marginRight: 600 }}>Unknown Reason: {progressInfo.unknown}</div>
              </div>
            </Col>
          </Row>
        )}
        <Row style={{ marginBottom: 8 }}></Row>
        <Row gutter={16} style={{ marginBottom: 4 }}>
          <Col span={8}>
            <Input
              style={{ width: '100%' }}
              placeholder={ "File Path" }
              value={filterFilePath}
              onChange={handleFilePathFilterChange}
            />
          </Col>
          <Col span={8}>
            <Select
              style={{ width: '100%' }}
              placeholder={ "Status" }
              value={filterStatus}
              onChange={handleStatusFilterChange}
            >
              <Option value="">{ "" }</Option>
              {statusOptions.map(status => (
                <Option key={status} value={status}>
                  {status}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
        <ProTable<ActiveVersionStatusResponse & { version_id: string }>
          search={{ defaultCollapsed: false, optionRender: false, labelWidth: 120 }}
          rowKey="version_id"
          size="small"
          options={{
            density: false,
            fullScreen: false,
            reload: handleReload, // 使用自定义的handleReload函数
          }}
          loading={loading}
          dataSource={filteredData}
          pagination={{
            pageSize: 10,
            showQuickJumper: true,
          }}
          columns={columns}
          scroll={{ x: 1200 }}
          bordered
        />
      </Card>
    </>
  );
  
};

export default VersionDetailPage;
