import { download } from '@/utils/common';
import { ScanOutlined, DownOutlined, DeleteOutlined, ReloadOutlined, StopOutlined } from '@ant-design/icons'; // 导入 ReloadOutlined 图标
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Dropdown, Menu, message, Popconfirm, Progress, Input, Switch } from 'antd';
import moment from 'moment';
import { useEffect, useRef, useState, version } from 'react';
import { getLocale, history, useIntl, useModel, useParams } from 'umi';
import EditModal from './components/EditModal';
import type { Version, VersionFormData } from './data';
import { exportProject, scanVersion, deleteVersions, cancelVersions, selectVersions, updateVersion, rescanVersion } from './service';

// 定义常量
const DEFAULT_REFRESH_INTERVAL = 10; // 默认刷新间隔时间（秒）

const baseMessageId = 'pages.table';

const locale = getLocale();

const VersionTable: React.FC = () => {
  const { id: project_id } = useParams<{ id: string }>();
  const [actionType, setActionType] = useState<string>('');
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState<Partial<Version> | undefined>();
  const [progressInfo, setProgressInfo] = useState<{ open: boolean; percent: number }>({
    open: false,
    percent: 0,
  });
  const [dataSource, setDataSource] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState<{ [key: string]: number }>({});
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]); // 添加状态以保存选中的版本ID
  const { formatMessage } = useIntl();
  const { projectArr } = useModel('data', (ret) => ({
    projectArr: ret.projects,
  }));
  const project = projectArr.find((item) => item.project_id === project_id);

  const [isAutoRefresh, setIsAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(DEFAULT_REFRESH_INTERVAL); // 使用常量
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // 保持 interval 的引用

  useEffect(() => {
    if (isAutoRefresh) {
      // 启动定时器
      intervalRef.current = setInterval(() => {
        getData();
      }, refreshInterval * 1000); // 将秒转换为毫秒
    } else {
      // 停止定时器
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      // 清理定时器
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoRefresh, refreshInterval]);

  const getData = async (showLoading: boolean | undefined = true) => {
    if (showLoading) {
      setLoading(true);
    }
    
    // 获取版本数据
    const res = await selectVersions({
      project_id,
    });
    const versions = res?.data?.versions;
    if (Array.isArray(versions)) {
      setDataSource(
        versions.sort(
          (a, b) => new Date(b.created_time).getTime() - new Date(a.created_time).getTime(),
        ),
      );

      // 更新 progressData
      const newProgressData: { [key: string]: number } = {};
      versions.forEach((version) => {
        newProgressData[version.version_id] = version.progress?.percent || 0; // 假设这里有 progress 属性
      });
      setProgressData(newProgressData);
    }

    if (showLoading) {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (selectedRowKeys.length > 0) {
      const { status_code } = await deleteVersions(selectedRowKeys);
      if (status_code === 0) {
        message.success(formatMessage({ id: `pages.message.deleteSuccess` }));
        getData(); // 刷新数据
        setSelectedRowKeys([]); // 清空选中的项
      }
    } else {
      message.warning(formatMessage({ id: `pages.message.noSelected` })); // 提示没有选中的项
    }
  };

  const handleCancel = async () => {
    if (selectedRowKeys.length > 0) {
      const { status_code } = await cancelVersions(selectedRowKeys);
      if (status_code === 0) {
        message.success(formatMessage({ id: `pages.message.cancelSuccess` }));
        getData(); // 刷新数据
        setSelectedRowKeys([]); // 清空选中的项
      }
    } else {
      message.warning(formatMessage({ id: `pages.message.noSelected` })); // 提示没有选中的项
    }
  };

  // 处理重新扫描
  const handleRescan = () => {
    if (selectedRowKeys.length === 1) {
      const selectedVersionId = selectedRowKeys[0];
      const selectedVersion = dataSource.find(item => item.version_id === selectedVersionId);
      if (selectedVersion) {
        setActionType('rescan');
        setCurrent(selectedVersion);
        setVisible(true); // 显示扫描文件的弹出窗
      }
    }
  };

  const columns: ProColumns<Version>[] = [
    {
      title: formatMessage({ id: `${baseMessageId}.title.versionId` }),
      width: 120,
      render: (_dom, _entity) => _entity.version_id,
      sorter: (a, b) => a.version_id.localeCompare(b.version_id),
    },
    {
      title: formatMessage({ id: `${baseMessageId}.title.versionName` }),
      dataIndex: 'version_name',
      width: 120,
      sorter: (a, b) => a.version_name.localeCompare(b.version_name),
    },
    {
      title: formatMessage({ id: `${baseMessageId}.title.versionDate` }),
      width: 80,
      dataIndex: 'version_date',
      render: (_, entity) => {
        if (entity.version_date) {
          return moment(entity.version_date, moment.defaultFormatUtc).format('YYYY-MM-DD HH:mm:ss');
        } else {
          return ''; // 或者返回一个默认值，如 'N/A'
        }
      },
      sorter: (a, b) => new Date(a?.version_date).valueOf() - new Date(b?.version_date).valueOf(),
    },
    {
      title: formatMessage({ id: `${baseMessageId}.title.created` }),
      width: 80,
      dataIndex: 'created_time',
      render: (_, entity) => {
        if (entity.created_time) {
          return moment.utc(entity.created_time).local().format('YYYY-MM-DD HH:mm:ss'); // 转换为当地时区
        } else {
          return ''; // 或者返回一个默认值，如 'N/A'
        }
      },
      sorter: (a, b) =>
        moment.utc(a?.created_time).local().valueOf() - moment.utc(b?.created_time).local().valueOf(),
    },
    {
      title: formatMessage({ id: `${baseMessageId}.title.start` }),
      width: 80,
      dataIndex: 'start_time',
      render: (_, entity) => {
        if (entity.start_time) {
          return moment.utc(entity.start_time).local().format('YYYY-MM-DD HH:mm:ss'); // 转换为当地时区
        } else {
          return ''; // 或者返回一个默认值，如 'N/A'
        }
      },
      sorter: (a, b) =>
        moment.utc(a?.start_time).local().valueOf() - moment.utc(b?.start_time).local().valueOf(),
    },
    {
      title: formatMessage({ id: `${baseMessageId}.title.finish` }),
      width: 80,
      dataIndex: 'finish_time',
      render: (_, entity) => {
        if (entity.finish_time) {
          return moment.utc(entity.finish_time).local().format('YYYY-MM-DD HH:mm:ss'); // 转换为当地时区
        } else {
          return ''; // 或者返回一个默认值，如 'N/A'
        }
      },
      sorter: (a, b) =>
        moment.utc(a.finish_time).local().valueOf() - moment.utc(b.finish_time).local().valueOf(),
    },
    {
      title: formatMessage({ id: `${baseMessageId}.title.status` }),
      width: 80,
      dataIndex: 'status',
      sorter: (a, b) => {
        const statusA = a.status || ''; // 如果 status 无效，则使用空字符串
        const statusB = b.status || ''; // 如果 status 无效，则使用空字符串
        return statusA.localeCompare(statusB); // 比较状态
      },
    },    
    {
      title: formatMessage({ id: `${baseMessageId}.title.progress` }),
      width: 60,
      render: (_, entity) => {
        const is_cancelled = entity.status === 'cancelled';
        const percent = Math.floor(progressData[entity.version_id] * 100);
        let strokeColor;
        
        if (is_cancelled) {
          strokeColor = 'grey'; // 如果状态为 'cancelled'，显示灰色
        } else if (percent >= 100) {
          strokeColor = 'green';
        } else {
          strokeColor = entity.finish_time ? 'red' : 'blue';
        }    
        return (
          <Progress
            percent={percent}
            size="small"
            strokeColor={strokeColor}
          />
        );
      },
    },
  
    {
      title: formatMessage({ id: `${baseMessageId}.title.action` }),
      valueType: 'option',
      width: locale === 'zh-CN' ? 120 : 180,
      render: (_, record) => {
        return [
          <a
            key="detail"
            onClick={() => {
              history.push(`./${record.version_id}/summary`);
            }}
          >
            {formatMessage({ id: `${baseMessageId}.action.summary` })}
          </a>,
          <a
            key="edit"
            onClick={() => {
              setActionType('edit');
              setCurrent(record);
              setVisible(true);
            }}
          >
            {formatMessage({ id: `${baseMessageId}.action.edit` })}
          </a>,
        ];
      },
      fixed: 'right',
    },
  ];

  useEffect(() => {
    getData(); // 初次加载数据
  }, []);

  const addScan = async (data: VersionFormData) => {
    const params = {
      project_id,
      version_name: data.version_name,
      version_date: data.version_date.format('YYYY-MM-DD HH:mm:ss'),
      description: data.description,
      priority: data.priority,
      allow_cache: data.allowCache,
      allow_blacklist: data.allowBlacklist,
      auto_cleanup: data.autoCleanup,
      strategy: data.strategy,
    };
    const files = {};
    if (data.files?.length) {
      data.files.forEach((item) => {
        const index = Object.keys(files).length;
        files[`file`] = item.originFileObj;
      });
    }

    const res = await scanVersion(Object.assign(params, files));
    return res;
  };

  const restartScan = async (data: VersionFormData) => {
    const params = {
      version_id: current?.version_id!, // 确保当前版本ID存在，使用非空断言
      version_name: data.version_name,
      version_date: data.version_date ? data.version_date.format('YYYY-MM-DD HH:mm:ss') : undefined, // 可选处理
      description: data.description,
      priority: data.priority,
      allow_cache: data.allowCache,
      allow_blacklist: data.allowBlacklist,
      auto_cleanup: data.autoCleanup,
      strategy: data.strategy,
    };
  
    const files: { [key: string]: any } = {};
    if (data.files?.length) {
      data.files.forEach((item) => {
        const index = Object.keys(files).length;
        files[`file`] = item.originFileObj;
      });
    }
  
    const res = await rescanVersion(Object.assign(params, files));
    return res;
  };
  

  const updateVersionData = async (data: VersionFormData) => {
    const params = {
      version_id: current?.version_id,
      version_name: data.version_name,
      version_date: data.version_date.format('YYYY-MM-DD HH:mm:ss'),
      description: data.description,
    };

    const res = await updateVersion(Object.assign(params, files));
    return res;
  };

  const handleSubmit = async (data: VersionFormData) => {
    const hide = message.loading(formatMessage({ id: 'pages.message.loading' }), 300000);
    let res: any = null;
    if (actionType === 'add') {
      res = await addScan(data);
    }
    else if (actionType === 'edit') {
      res = await updateVersionData(data);
    }
    else if (actionType ==='rescan') {
      res = await restartScan(data);
    }

    hide();
    if (res.status_code === 0) {
      const tip = formatMessage({ id: `pages.message.${actionType}Success` });
      message.success(tip);
      setVisible(false);
      getData();
    }
  };

  // 下拉菜单
  const [menuVisible, setMenuVisible] = useState(false); // 添加新的状态管理下拉菜单可见性
  const menu = (
    <Menu>
      <Menu.Item key="auto-refresh-toggle">
        <span>{formatMessage({ id: 'pages.version.autoRefresh' })}: </span>
        <Switch 
          checked={isAutoRefresh} 
          onChange={(checked) => {
            setIsAutoRefresh(checked);
            if (!checked) {
              setRefreshInterval(DEFAULT_REFRESH_INTERVAL); // 使用常量
            }
          }} 
        />
      </Menu.Item>
      <Menu.Item key="refresh-interval">
        <span>{formatMessage({ id: 'pages.version.refreshInterval' })} (秒): </span>
        <Input 
          type="text" // 将类型改为文本输入
          value={isAutoRefresh ? refreshInterval.toString() : ''}
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            if (!isNaN(value) && value > 0) {
              setRefreshInterval(value); // 直接更新为秒
            }
          }}
          disabled={!isAutoRefresh}
          style={{ width: '100px', marginLeft: '8px', color: isAutoRefresh ? 'black' : 'gray' }}
          onClick={(e) => e.stopPropagation()} // 阻止点击事件传播
        />
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <ProTable<Version>
        headerTitle={project?.project_name}
        rowKey="version_id"
        search={false}
        size="small"
        options={{
          density: false,
          fullScreen: false,
          reload: () => {
            setLoading(true);
            getData();
          },
        }}
        pagination={{
          pageSize: 10,
          showQuickJumper: true,
        }}
        rowSelection={{
          selectedRowKeys,
          onChange: (newSelectedRowKeys) => setSelectedRowKeys(newSelectedRowKeys), // 更新选中项
        }} // 使用 rowSelection 属性来管理选中项
        toolBarRender={() => {
          const canRescan = selectedRowKeys.length === 1; // 只有一个勾选项时可用
          return [
            <Button
              type="primary"
              key="add"
              onClick={() => {
                setActionType('add');
                setVisible(true);
                setCurrent(undefined);
              }}
            >
              <ScanOutlined /> {formatMessage({ id: 'pages.table.action.scan' })}
            </Button>,
            <Button
              type="default"
              key="rescan"
              icon={<ReloadOutlined />}
              onClick={handleRescan} // 处理重新扫描
              disabled={!canRescan} // 只有一个勾选项时可用
              style={{ marginLeft: 8 }} // 添加左边距
            >
              {formatMessage({ id: 'pages.table.action.rescan' })}
            </Button>,
            <Popconfirm
              title={formatMessage({ id: `pages.version.deleteConfirm` })}
              onConfirm={handleRemove}
              disabled={selectedRowKeys.length === 0} // 如果没有选中项则禁用
            >
              <Button
                type="danger"
                key="delete"
                icon={<DeleteOutlined />}
                style={{ marginLeft: 8 }} // 添加左边距
                disabled={selectedRowKeys.length === 0} // 如果没有选中项则禁用
              >
                {formatMessage({ id: 'pages.table.action.delete' })}
              </Button>
            </Popconfirm>,

            <Popconfirm
            title={formatMessage({ id: `pages.version.cancelConfirm` })}
            onConfirm={handleCancel}
            disabled={selectedRowKeys.length === 0} // 如果没有选中项则禁用
            >
              <Button
                type="danger"
                key="cancel"
                icon={<StopOutlined />}
                style={{ marginLeft: 8 }} // 添加左边距
                disabled={selectedRowKeys.length === 0} // 如果没有选中项则禁用
              >
                {formatMessage({ id: 'pages.table.action.cancel' })}
              </Button>
            </Popconfirm>,

            <Dropdown 
              overlay={menu} 
              trigger={['click']}
              open={menuVisible}
              onOpenChange={setMenuVisible}
            >
              <Button icon={<DownOutlined />} onClick={() => setMenuVisible(!menuVisible)} />
            </Dropdown>
          ];
        }}
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        scroll={{ x: 1220 }}
        bordered
      />
      <EditModal
        visible={visible}
        type={actionType}
        current={current}
        onCancel={() => {
          setCurrent(undefined);
          setVisible(false);
        }}
        onSubmit={(values) => {
          handleSubmit(values);
        }}
      />
    </>
  );
};

export default VersionTable;
