import React, { useEffect, useState } from 'react';
import { Card, message, Row, Col, Button, Tooltip, Switch, Input } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useIntl } from 'umi';
import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import { getCachedVersionList, removeCache } from './service';
import { VersionInfo, ProjectVersions } from './data';

interface FlattenedVersionInfo extends VersionInfo {
  version_id: string;
}

const DEFAULT_REFRESH_INTERVAL = 5; // 默认刷新间隔，单位为秒

const CachedListPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<FlattenedVersionInfo[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isAutoRefresh, setIsAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(DEFAULT_REFRESH_INTERVAL); // 刷新间隔
  const { formatMessage } = useIntl();

  const getVersions = async () => {
    setLoading(true);
    const hide = message.loading(formatMessage({ id: 'pages.cache.message.loading' }), 0);
    try {
      const res = await getCachedVersionList();
      hide();
      setLoading(false);

      if (res?.data) {
        // message.success(formatMessage({ id: 'pages.cache.getList.success' }));

        const flattenedData: FlattenedVersionInfo[] = [];
        for (const [projectId, versions] of Object.entries(res.data.versions)) {
          for (const [versionId, versionInfo] of Object.entries(versions as ProjectVersions)) {
            flattenedData.push({
              ...versionInfo,
              version_id: versionId // 只处理version_id
            });
          }
        }
        setDataSource(flattenedData);
      }    
    } catch (error) {  
      hide();  
      setLoading(false);
    }
  };

  useEffect(() => {
    getVersions(); // 初次加载版本

    let interval: NodeJS.Timeout | null = null;
    if (isAutoRefresh) {
      interval = setInterval(() => {
        getVersions(); // 定时获取版本
      }, refreshInterval * 1000); // 将秒转换为毫秒
    }

    return () => {
      if (interval) {
        clearInterval(interval); // 清理定时器
      }
    };
  }, [isAutoRefresh, refreshInterval]);

  const handleDelete = async () => {
    const idsToDelete = selectedRowKeys as string[];

    try {
      await removeCache(idsToDelete);
      message.success(formatMessage({ id: 'pages.cache.delete.success' }));
      setSelectedRowKeys([]); // 清空选择
      getVersions(); // 刷新列表
    } catch (e) {
      message.error(formatMessage({ id: 'pages.cache.delete.error' }));
    }
  };

  const columns: ProColumns<FlattenedVersionInfo>[] = [
    {
      title: formatMessage({ id: 'pages.cache.title.versionId' }),
      dataIndex: 'version_id',
      width: 200,
      hideInSearch: true,
      sorter: (a, b) => a.version_id.localeCompare(b.version_id),
    },
    {
      title: formatMessage({ id: 'pages.cache.title.path' }),
      dataIndex: 'path',
      width: 300,
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: formatMessage({ id: 'pages.cache.title.timestamp' }),
      dataIndex: 'timestamp',
      width: 200,
      hideInSearch: true,
      sorter: (a, b) => a.timestamp - b.timestamp,
      render: (value: number) => {
        const date = new Date(value * 1000); // 假设timestamp为秒级别
        return date.toLocaleString(); // 使用系统的本地时间格式
      },
    },
  ];

  return (
    <Card>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={24}>
          {/* 可以添加搜索输入框或其他过滤器 */}
        </Col>
      </Row>
      <ProTable<FlattenedVersionInfo>
        headerTitle={formatMessage({ id: 'pages.cache.title.cachedList' })}
        search={false}
        rowKey="version_id"
        size="small"
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        toolBarRender={() => [          
          <span key="auto-refresh" style={{ marginRight: 8 }}>{formatMessage({ id: 'pages.autoRefresh' })}:</span>,
          <Switch 
            checked={isAutoRefresh} 
            onChange={(checked) => setIsAutoRefresh(checked)} 
            style={{ marginRight: 8 }}
          />,
          <Input 
            type="text" // 设置为文本输入框
            value={isAutoRefresh ? refreshInterval.toString() : ''}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              if (!isNaN(value) && value > 0) {
                setRefreshInterval(value);
              }
            }}
            disabled={!isAutoRefresh}
            style={{ width: 60 }} // 根据需要调整宽度
            placeholder="秒"
          />,
          <Tooltip key="delete" title={formatMessage({ id: 'pages.cache.button.delete' })}>
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              onClick={handleDelete}
              disabled={!selectedRowKeys.length}
            />
          </Tooltip>,
        ]}
        options={{
          density: false,
          fullScreen: false,
          reload: () => {
            setLoading(true);
            getVersions();
          },
        }}
        loading={loading}
        dataSource={dataSource}
        pagination={{
          pageSize: 10,
          showQuickJumper: true,
        }}
        columns={columns}
        scroll={{ x: 900 }}
        bordered
      />
    </Card>
  );
};

export default CachedListPage;
