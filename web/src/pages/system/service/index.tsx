import React, { useEffect, useState } from 'react';
import { Card, Row, Col, message, Switch, Input } from 'antd';
import { useIntl } from 'umi';
import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import { getActiveEngineList } from './service';

const DEFAULT_REFRESH_INTERVAL = 5; // 默认刷新间隔，单位为秒

const EngineListPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [isAutoRefresh, setIsAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(DEFAULT_REFRESH_INTERVAL); // 刷新间隔
  const { formatMessage } = useIntl();

  const getEngines = async () => {
    setLoading(true);
    const hide = message.loading(formatMessage({ id: 'pages.engine.message.loading' }), 0);
    try {
      const res = await getActiveEngineList();

      if (res?.data) {
        hide();
        setLoading(false);
        // message.success(formatMessage({ id: 'pages.engine.getList.success' }));

        const enginesArray = Object.entries(res.data.engines).map(([engineId, engine]) => ({
          engine_id: engineId,
          cpu_total: engine?.cpu_total ?? "-",
          cpu_used: engine?.cpu_used ?? "-",
          memory_total: engine?.memory_total ?? "-",
          memory_used: engine?.memory_used ?? "-",
          swap_total: engine?.swap_total ?? "-",
          swap_used: engine?.swap_used ?? "-",
          disk_total: engine?.disk_total ?? "-",
          disk_used: engine?.disk_used ?? "-",
          update_time: engine.update_time,
          whoami: engine.whoami,
        }));

        setDataSource(enginesArray);
      } else {
        hide();
        setLoading(false);
      }
    
    } catch (error) {
      hide(); // 隐藏加载提示      
      setLoading(false);
    }
  };

  useEffect(() => {
    getEngines(); // 初次加载引擎列表

    let interval: NodeJS.Timeout | null = null;
    if (isAutoRefresh) {
      interval = setInterval(() => {
        getEngines(); // 定时获取引擎列表
      }, refreshInterval * 1000); // 将秒转换为毫秒
    }

    return () => {
      if (interval) {
        clearInterval(interval); // 清理定时器
      }
    };
  }, [isAutoRefresh, refreshInterval]);

  const columns: ProColumns<any>[] = [
    {
      title: formatMessage({ id: 'pages.engine.title.engineId' }),
      dataIndex: 'engine_id',
      width: 150,
      hideInTable: true,
      hideInSearch: true,
      sorter: (a, b) => a.engine_id.localeCompare(b.engine_id),
    },
    {
      title: formatMessage({ id: 'pages.engine.title.whoami' }),
      dataIndex: 'whoami',
      width: 100,
      hideInSearch: true,
    },
    {
      title: formatMessage({ id: 'pages.engine.title.cpuTotal' }),
      dataIndex: 'cpu_total',
      width: 100,
      hideInSearch: true,
      render: (text: any) => `${text} vCPUs`,
    },
    {
      title: formatMessage({ id: 'pages.engine.title.cpuUsed' }),
      dataIndex: 'cpu_used',
      width: 100,
      hideInSearch: true,
      render: (text: any) => `${text}%`,
    },
    {
      title: formatMessage({ id: 'pages.engine.title.memoryTotal' }),
      dataIndex: 'memory_total',
      width: 150,
      hideInSearch: true,
      render: (text: any) => `${(text / 1000 / 1000 / 1000).toFixed(3)} GB`,
    },
    {
      title: formatMessage({ id: 'pages.engine.title.memoryUsed' }),
      dataIndex: 'memory_used',
      width: 150,
      hideInSearch: true,
      render: (text: any) => `${text}%`,
    },   
    {
      title: formatMessage({ id: 'pages.engine.title.swapTotal' }),
      dataIndex: 'swap_total',
      width: 150,
      hideInSearch: true,
      render: (text: any) => `${(text / 1000 / 1000 / 1000).toFixed(3)} GB`,
    },
    {
      title: formatMessage({ id: 'pages.engine.title.swapUsed' }),
      dataIndex: 'swap_used',
      width: 150,
      hideInSearch: true,
      render: (text: any) => `${text}%`,
    }, 
    {
      title: formatMessage({ id: 'pages.engine.title.diskTotal' }),
      dataIndex: 'disk_total',
      width: 150,
      hideInSearch: true,
      render: (text: any) => `${(text / 1000 / 1000 / 1000).toFixed(3)} GB`,
    },
    {
      title: formatMessage({ id: 'pages.engine.title.diskUsed' }),
      dataIndex: 'disk_used',
      width: 150,
      hideInSearch: true,
      render: (text: any) => `${text}%`,
    },
    {
      title: formatMessage({ id: 'pages.engine.title.updateTime' }),
      dataIndex: 'update_time',
      width: 200,
      hideInSearch: true,
      render: (text: any) => new Date(text).toLocaleString(),
    },
  ];

  return (
    <Card>
      <ProTable<any>
        rowKey="engine_id"
        size="small"
        options={{
          density: false,
          fullScreen: false,
          reload: () => {
            setLoading(true);
            getEngines();
          },
        }}
        loading={loading}
        dataSource={dataSource}
        pagination={{
          pageSize: 10,
          showQuickJumper: true,
        }}
        columns={columns}
        scroll={{ x: 800 }}
        bordered
        search={false}
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
          </div>
        ]}
      />
    </Card>
  );
};

export default EngineListPage;
