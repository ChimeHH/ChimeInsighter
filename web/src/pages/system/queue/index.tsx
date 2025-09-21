import React, { useEffect, useState } from 'react';
import { Card, message, Switch, Input } from 'antd';
import { useIntl } from 'umi';
import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import { getActiveQueueList } from './service';

const DEFAULT_REFRESH_INTERVAL = 5; // 默认刷新间隔，单位为秒

const QueueListPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]); // 数据源状态
  const [isAutoRefresh, setIsAutoRefresh] = useState(false); 
  const [refreshInterval, setRefreshInterval] = useState(DEFAULT_REFRESH_INTERVAL); // 刷新间隔
  const { formatMessage } = useIntl();

  const getQueues = async () => {
    setLoading(true);
    const hide = message.loading(formatMessage({ id: 'pages.queue.message.loading' }), 0);
    try {
      const res = await getActiveQueueList();

      if (res?.data) {
        hide();
        setLoading(false);
        // message.success(formatMessage({ id: 'pages.queue.getList.success' }));

        const queuesArray = res.data.queues.map((queue: any) => ({
          name: queue.name,
          type: queue.type,
          memory: queue.memory,
          state: queue.state,
          messages: queue.messages || '',
          messages_ready: queue.messages_ready || 0,
          create_time: queue.head_message_timestamp || new Date().toISOString(),
          update_time: new Date().toISOString(),
          ack: queue.message_stats ? queue.message_stats.ack : 0,
          deliver: queue.message_stats ? queue.message_stats.deliver : 0,
          deliver_get: queue.message_stats ? queue.message_stats.deliver_get : 0,
          deliver_no_ack: queue.message_stats ? queue.message_stats.deliver_no_ack : 0,
          get: queue.message_stats ? queue.message_stats.get : 0,
          get_empty: queue.message_stats ? queue.message_stats.get_empty : 0,
          get_no_ack: queue.message_stats ? queue.message_stats.get_no_ack : 0,
          publish: queue.message_stats ? queue.message_stats.publish : 0,
          redeliver: queue.message_stats ? queue.message_stats.redeliver : 0,
      }));
      
      setDataSource(queuesArray); // 更新数据源
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
    getQueues(); // 初次加载队列

    let interval: NodeJS.Timeout | null = null;
    if (isAutoRefresh) {
      interval = setInterval(() => {
        getQueues(); // 定时获取队列
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
      title: formatMessage({ id: 'pages.queue.title.name' }),
      dataIndex: 'name',
      width: 150,
      hideInSearch: true,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: formatMessage({ id: 'pages.queue.title.type' }),
      dataIndex: 'type',
      width: 150,
      hideInSearch: true,
      sorter: (a, b) => a.type.localeCompare(b.type),
    },
    {
      title: formatMessage({ id: 'pages.queue.title.memory' }),
      dataIndex: 'memory',
      width: 100,
      hideInSearch: true,
    },
    {
      title: formatMessage({ id: 'pages.queue.title.state' }),
      dataIndex: 'state',
      width: 100,
      hideInSearch: true,
    },
    {
      title: formatMessage({ id: 'pages.queue.title.messages' }),
      dataIndex: 'messages',
      width: 80,
      hideInSearch: true,
    },
    {
      title: formatMessage({ id: 'pages.queue.title.messages_ready' }),
      dataIndex: 'messages_ready',
      width: 80,
      hideInSearch: true,
    },
    {
      title: formatMessage({ id: 'pages.queue.title.ack' }),
      dataIndex: 'ack',
      width: 100,
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: formatMessage({ id: 'pages.queue.title.deliver' }),
      dataIndex: 'deliver',
      width: 100,
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: formatMessage({ id: 'pages.queue.title.deliver_get' }),
      dataIndex: 'deliver_get',
      width: 120,
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: formatMessage({ id: 'pages.queue.title.deliver_no_ack' }),
      dataIndex: 'deliver_no_ack',
      width: 120,
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: formatMessage({ id: 'pages.queue.title.get' }),
      dataIndex: 'get',
      width: 100,
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: formatMessage({ id: 'pages.queue.title.get_empty' }),
      dataIndex: 'get_empty',
      width: 120,
      hideInSearch: true,
    },
    {
      title: formatMessage({ id: 'pages.queue.title.get_no_ack' }),
      dataIndex: 'get_no_ack',
      width: 120,
      hideInSearch: true,
    },
    {
      title: formatMessage({ id: 'pages.queue.title.publish' }),
      dataIndex: 'publish',
      width: 100,
      hideInSearch: true,
    },
    {
      title: formatMessage({ id: 'pages.queue.title.redeliver' }),
      dataIndex: 'redeliver',
      width: 100,
      hideInSearch: true,
    },
    {
      title: formatMessage({ id: 'pages.queue.title.createTime' }),
      dataIndex: 'create_time',
      width: 120,
      hideInSearch: true,
      render: (text: any) => new Date(text).toLocaleString(),
    },
    {
      title: formatMessage({ id: 'pages.queue.title.updateTime' }),
      dataIndex: 'update_time',
      width: 120,
      hideInSearch: true,
      render: (text: any) => {
        const date = new Date(text);
        return (text && !isNaN(date.getTime())) ? date.toLocaleString() : '';
      },
    },
  ];

  return (
    <Card>
      <ProTable<any>
        headerTitle={formatMessage({ id: 'pages.queue.title.queueList' })}
        search={{ defaultCollapsed: false, optionRender: false, labelWidth: 120 }}
        rowKey="queue_id"
        size="small"
        options={{
          density: false,
          fullScreen: false,
          reload: () => {
            setLoading(true);
            getQueues();
          },
        }}
        loading={loading}
        pagination={{
          pageSize: 20,
          showQuickJumper: true,
        }}
        columns={columns}
        dataSource={dataSource} // 传入数据源
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
          </div>
        ]}
      />
    </Card>
  );
};

export default QueueListPage;
