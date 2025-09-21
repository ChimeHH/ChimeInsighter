import React, { useEffect, useState } from 'react';
import { Card, message, Row, Col, AutoComplete, Switch, Input, Button } from 'antd';
import { useIntl, history } from 'umi';
import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import { getActiveVersionList } from './service';
import { VersionStatus } from './data';
import { CopyOutlined } from '@ant-design/icons'; // 导入复制图标

const { Option } = AutoComplete;
const DEFAULT_REFRESH_INTERVAL = 5; // 默认刷新间隔，单位为秒

const VersionListPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<VersionStatus[]>([]);
  const [filterVersionId, setFilterVersionId] = useState<string>('');
  const [versionIdOptions, setVersionIdOptions] = useState<string[]>([]);
  const [isAutoRefresh, setIsAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(DEFAULT_REFRESH_INTERVAL); // 刷新间隔
  const { formatMessage } = useIntl();

  const getVersions = async () => {
    setLoading(true);
    const hide = message.loading(formatMessage({ id: 'pages.version.message.loading' }), 0);
    try {
      const res = await getActiveVersionList();

      if (res?.data) {
        hide();
        setLoading(false);
        
        const sortedData = Object.entries(res.data.versions).map(([key, value]) => ({
          ...value,
          version_id: key.replace(/^\/\/VERSION\//, ''),
        })).sort((a, b) => b.version_id.localeCompare(a.version_id));

        setDataSource(sortedData);
        setVersionIdOptions(sortedData.map(item => item.version_id));
        return;
      }
      hide();
      setLoading(false);
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

  const handleVersionIdFilterChange = (value: string) => {
    setFilterVersionId(value);
  };

  const filteredData = dataSource.filter((item: any) =>
    item.version_id.includes(filterVersionId)
  );

  const columns: ProColumns<VersionStatus & { version_id: string }>[] = [
    {
      title: formatMessage({ id: 'pages.version.title.versionId' }),
      dataIndex: 'version_id',
      width: 100,
      hideInSearch: true,
      sorter: (a, b) => a.version_id.localeCompare(b.version_id),      
    },
    {
      title: formatMessage({ id: 'pages.version.title.createTime' }),
      dataIndex: 'create_time',
      width: 100,
      hideInSearch: true,
      sorter: (a, b) => new Date(a.create_time).getTime() - new Date(b.create_time).getTime(),
    },
    {
      title: formatMessage({ id: 'pages.version.title.updateTime' }),
      dataIndex: 'update_time',
      width: 100,
      hideInSearch: true,
      sorter: (a, b) => new Date(a.update_time || '').getTime() - new Date(b.update_time || '').getTime(),
    },
    {
      title: formatMessage({ id: 'pages.version.title.queued' }),
      dataIndex: 'QUEUED',
      width: 67,
      hideInSearch: true,
      sorter: (a, b) => parseInt(a.QUEUED || '0') - parseInt(b.QUEUED || '0'),
    },
    {
      title: formatMessage({ id: 'pages.version.title.initiated' }),
      dataIndex: 'INITIATED',
      width: 67,
      hideInSearch: true,
      sorter: (a, b) => parseInt(a.INITIATED || '0') - parseInt(b.INITIATED || '0'),
    },
    {
      title: formatMessage({ id: 'pages.version.title.canceled' }),
      dataIndex: 'CANCELED',
      width: 40,
      hideInSearch: true,
      sorter: (a, b) => parseInt(a.CANCELED || '0') - parseInt(b.CANCELED || '0'),
    },
    {
      title: formatMessage({ id: 'pages.version.title.completed' }),
      dataIndex: 'COMPLETED',
      width: 40,
      hideInSearch: true,
      sorter: (a, b) => parseInt(a.COMPLETED || '0') - parseInt(b.COMPLETED || '0'),
    },
    {
      title: formatMessage({ id: 'pages.version.title.failed' }),
      dataIndex: 'FAILED',
      width: 40,
      hideInSearch: true,
      sorter: (a, b) => parseInt(a.FAILED || '0') - parseInt(b.FAILED || '0'),
    },
    {
      title: formatMessage({ id: 'pages.version.title.unknown' }),
      dataIndex: 'UNKNOWN',
      width: 40,
      hideInSearch: true,
      sorter: (a, b) => parseInt(a.UNKNOWN || '0') - parseInt(b.UNKNOWN || '0'),
    },
  ];

  const copyToClipboard = () => {
    const jsonStr = JSON.stringify(filteredData, null, 2); // 将筛选的数据转换为JSON字符串
    navigator.clipboard.writeText(jsonStr).catch((err) => {
      console.error('Could not copy text: ', err);
    });
  };

  return (
    <Card>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <AutoComplete
            style={{ width: '100%' }}
            placeholder={formatMessage({ id: 'pages.version.index.searchPlaceholder' })}
            options={versionIdOptions.map(id => ({ value: id }))}
            value={filterVersionId}
            onChange={handleVersionIdFilterChange}
          />
        </Col>
      </Row>
      <ProTable<VersionStatus & { version_id: string }>
        search={{ defaultCollapsed: false, optionRender: false, labelWidth: 120 }}
        rowKey="version_id"
        size="small"
        options={{
          density: false,
          fullScreen: false,
          reload: () => {
            setLoading(true);
            getVersions();
          },
        }}
        loading={loading}
        dataSource={filteredData}
        pagination={{
          pageSize: 10,
          showQuickJumper: true,
        }}
        columns={columns}
        scroll={{ x: 800 }}
        bordered
        toolBarRender={() => [          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <span style={{ marginRight: 8 }}>{formatMessage({ id: 'pages.autoRefresh' })}:</span>
            <Switch 
              checked={isAutoRefresh} 
              onChange={(checked) => setIsAutoRefresh(checked)} 
              style={{ marginRight: 8 }}
            />
            <Input 
              type="text" // 设置为文本输入框
              value={isAutoRefresh ? refreshInterval : ''}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                if (!isNaN(value) && value > 0) {
                  setRefreshInterval(value);
                }
              }}
              disabled={!isAutoRefresh}
              style={{ width: 60 }} // 根据需要调整宽度
              placeholder="秒"
            />
          </div>,
          <Button key="copy" icon={<CopyOutlined />} onClick={copyToClipboard} style={{ marginRight: 8 }} />
          
        ]}
      />
    </Card>
  );
};

export default VersionListPage;
