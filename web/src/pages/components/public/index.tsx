import { severityMap, workStatusMap, severityColorMap, workStatusColorMap } from '@/utils/constant';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { message, Select, Tag } from 'antd';
import type { DefaultOptionType } from 'antd/lib/select';
import { useEffect, useRef, useState } from 'react';
import { useParams, history, useIntl } from 'umi';
import type { Version } from '../version/data';
import { selectThreats, updateThreatStatus } from './service';

const colorsMap = {
  1: '#b7c5c7',
  2: '#fd9e38',
  3: '#f56767',
  4: '#e50100',
};

const statusOptions: DefaultOptionType[] = Object.entries(workStatusMap).map(([value, label]) => ({
  value,
  label,
}));

const queryParams = {  
  'filters[0].threat_type': 'public',
};

const baseMessageId = 'pages.table';

const ThreatsTable: React.FC = () => {
  const { vid: version_id } = useParams<{ vid: string; name: string }>();
  const [version, setVersion] = useState<Version>();
  const [dataSource, setDataSource] = useState<PublicThreat[]>([]);
  const tags = useRef<Tag[]>();
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState<Partial<{
    cve_id: DefaultOptionType[];
    severities: DefaultOptionType[];
    packages: DefaultOptionType[];
    work_status: DefaultOptionType[];
  }>>({});
  const [filters, setFilters] = useState<Partial<{
    cve_id: string[];
    severities: number[];
    packages: string[];
    work_status: string[];
  }>>({});
  const { formatMessage } = useIntl();

  const [filterOption, setFilterOption] = useState<string>('all'); // 新增的状态管理过滤选项

  const getThreats = async () => {
    const res = await selectThreats({
      version_id,
      ...queryParams,
    });
    const threats = res?.data?.threats;
    if (Array.isArray(threats)) {
      setDataSource(threats);
      tags.current = res.data?.tags;
    }

    setVersion(res?.data?.version);
    setLoading(false);
  };

  const reviseThreatStatus = async (params: { threat_id: string; work_status: string }) => {
    const res = await updateThreatStatus(params);
    if (res?.status_code === 0) {
      message.success(formatMessage({ id: 'pages.message.changeStatusSuccess' }));
      getThreats();
    }
  };

  const setFilter = (params: Partial<{
    severities: number[];
    packages: string[];
    work_status: string[];
  }>) => {
    setFilters((s) => ({
      ...s,
      ...params,
    }));
  };

  const handleFilterChange = (value: string) => {
    setFilterOption(value);
  };

  // 过滤逻辑
  const filteredDataSource = dataSource.filter((item) => {
    if (filterOption === 'not_empty') {
      return item.metadata?.os_filtered || item.metadata?.source_filtered; // 至少一个参数不为空
    }
    if (filterOption === 'empty') {
      return !item.metadata?.os_filtered && !item.metadata?.source_filtered; // 两个参数都为空
    }
    return true; // 显示全部
  });

  const columns: ProColumns<PublicThreat>[] = [  
    {
      title: formatMessage({ id: `${baseMessageId}.title.threatId` }),
      width: 100,
      dataIndex: 'threat_id',
      hideInSearch: true,
      hideInTable: true,
      sorter: (a, b) => parseInt(a.threat_id.split('-')[1]) - parseInt(b.threat_id.split('-')[1]),
    }, 
    {
      title: formatMessage({ id: `${baseMessageId}.title.cveId` }),
      width: 90,
      dataIndex: 'cve_id',      
      render: (_, entity) => (
        <a onClick={() => history.push(`/helpcenter/vulnerability/${entity.metadata.cve_id}`)}>
          {entity.metadata.cve_id}
        </a>
      ),
      sorter: (a, b) => {
        const str1 = a.metadata.cve_id.split('-')[1] + a.metadata.cve_id.split('-')[2];
        const str2 = b.metadata.cve_id.split('-')[1] + b.metadata.cve_id.split('-')[2];
        return parseInt(str1) - parseInt(str2);
      },
      renderFormItem: () => (
        <Select
          mode="multiple"
          allowClear={true}
          showArrow={true}
          filterOption={true}
          options={searchParams.cve_id}
          onChange={(value) => setFilter({ cve_id: value })} // 更新过滤逻辑
          placeholder={formatMessage({ id: `${baseMessageId}.title.cveId` })}
        />
      ),
    },
    {
      title: formatMessage({ id: `${baseMessageId}.title.severity` }),
      width: 60,
      render: (_, entity) => {
        // 获取对应的颜色
        const color = severityColorMap[entity.severity] || '#000'; // 默认颜色
        return (
          <Tag color={color} style={{ borderColor: color, color: '#fff' }}>
            {severityMap[entity.severity]}
          </Tag>
        );
      },
      renderFormItem: () => (
        <Select
          mode="multiple"
          allowClear={true}
          showArrow={true}
          filterOption={true}
          options={searchParams.severities}
          onChange={(value) => setFilter({ severities: value })}
          placeholder={formatMessage({ id: `${baseMessageId}.title.severity` })}
        />
      ),
      sorter: (a, b) => a.severity - b.severity,
    },
    
    {
      title: formatMessage({ id: `${baseMessageId}.title.package` }),
      width: 100,
      render: (_, entity) => entity.metadata.component?.product,
      renderFormItem: () => (
        <Select
          mode="multiple"
          allowClear={true}
          showArrow={true}
          filterOption={true}
          options={searchParams.packages}
          onChange={(value) => setFilter({ packages: value })}
          placeholder={formatMessage({ id: `${baseMessageId}.title.package` })}
        />
      ),
      sorter: (a, b) => (a.metadata.component.product).localeCompare(b.metadata.component.product),
    },
    {
      title: formatMessage({ id: `${baseMessageId}.title.version` }),
      width: 40,
      hideInSearch: true,
      render: (_, entity) => entity.metadata.component?.version,      
    },
    {
      title: formatMessage({ id: `${baseMessageId}.title.osFiltered` }),
      width: 100,      
      hideInSearch: true,
      render: (_, entity) => {
          const osFiltered = entity.metadata?.os_filtered;
          if (!osFiltered) {
              return ''; // 如果不存在则显示为空
          }
  
          return formatMessage({ id: 'pages.public.os_filter' })
              .replace(/<your_os_name>/g, osFiltered.join(', ')); // 假设 osFiltered 是一个数组
      },
    },
    {
      title: formatMessage({ id: `${baseMessageId}.title.sourceFiltered` }),
      width: 180,
      hideInSearch: true,
      render: (_, entity) => {
        const sourceFiltered = entity.metadata?.source_filtered;
        if (!sourceFiltered) {
          return ''; // 如果不存在则显示为空
        }
    
        // 构造多行的 key: value 字符串
        const featurelessKeys = [];
        const missingKeys = [];
    
        Object.entries(sourceFiltered).forEach(([key, value]) => {
          if (value < 0) {
            featurelessKeys.push(key); // 收集 value < 0 的键
          } else {
            missingKeys.push(`${key} (${(value * 100).toFixed(1)}%)`); // 收集 value >= 0 的键和百分比
          }
        });
    
        return (
          <div>
            {featurelessKeys.length > 0 && (
              <div>
                {formatMessage({ id: 'pages.public.source_featureless_filter' })
                  .replace(/<featureless_source_files>/g, featurelessKeys.join(', '))}  {/* 替换占位符 */}
              </div>
            )}
            {missingKeys.length > 0 && (
              <div>
                {formatMessage({ id: 'pages.public.source_missing_filter' })
                  .replace(/<missing_source_files>/g, missingKeys.join(', '))}  {/* 替换占位符 */}
              </div>
            )}
          </div>
        );
      },
    },
    
      
    {
      title: formatMessage({ id: `${baseMessageId}.title.filepath` }),
      width: 300,
      hideInSearch: true,
      render: (_, entity) => <pre>{entity.filepath.map((path, index) => `${index + 1}. ${path}`).join(",\n")}</pre>,
    },
    {
      title: formatMessage({ id: `${baseMessageId}.title.status` }),
      width: 60,
      render: (_, record) => {
        const statusColor = workStatusColorMap[record?.work_status ?? 'NoStatus'] || '#000'; // 默认颜色
        return (
          <Select
            value={record?.work_status ?? 'NoStatus'}
            bordered={false}
            style={{ width: 112, backgroundColor: statusColor, color: '#fff', padding: '2px 5px', borderRadius: '4px' }}
            onChange={(value) =>
              reviseThreatStatus({ threat_id: record.threat_id, work_status: value })
            }
          >
            {statusOptions.map(option => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        );
      },
      renderFormItem: () => (
        <Select
          mode="multiple"
          allowClear={true}
          showArrow={true}
          filterOption={true}
          options={searchParams.work_status}
          onChange={(value) => setFilter({ work_status: value })}
          placeholder={formatMessage({ id: `${baseMessageId}.title.status` })}
        />
      ),
      sorter: (a, b) =>
        (a?.work_status ?? 'NoStatus').localeCompare(b?.work_status ?? 'NoStatus'),
      fixed: 'right',
    },
    
    {
      title: formatMessage({ id: `${baseMessageId}.title.action` }),
      width: 60,
      fixed: 'right',
      hideInSearch: true,
      render: (_, entity) => (
        <a onClick={() => history.push(`./${entity.threat_id}/public`)}>
          {formatMessage({ id: `${baseMessageId}.action.detail` })}
        </a>
      ),
    },
  ];

  const initSearchParams = (threats: PublicThreat[]) => {
    const cve_ids: DefaultOptionType[] = [];
    threats.forEach((threat) => {
      const cve_id = threat.metadata.cve_id;
      if (cve_id && !cve_ids.find(item => item.value === cve_id)) {
        cve_ids.push({
          label: cve_id,
          value: cve_id,
        });
      }
    });
    
    const severities: DefaultOptionType[] = [];
    Object.keys(severityMap).forEach((key) => {
      const threat = threats.find((item) => item.severity.toString() === key);
      if (threat) {
        severities.push({
          label: severityMap[key],
          value: threat.severity,
        });
      }
    });

    const packages: DefaultOptionType[] = [];
    threats.forEach((threat) => {
      const project = threat.metadata.component?.product;
      const packageOption = packages.find((item) => item.value === project);
      if (!packageOption && project) {
        packages.push({
          label: project,
          value: project,
        });
      }
    });

    const work_status = statusOptions.filter((option) =>
      threats.find((threat) => threat?.work_status === option.value),
    );
    if (
      threats.find((threat) => !!threat?.work_status) &&
      !work_status.find((item) => item.value === 'NoStatus')
    ) {
      work_status.push({
        label: 'No Status',
        value: 'NoStatus',
      });
    }

    setSearchParams({
      cve_id: cve_ids,
      severities,
      packages,
      work_status,
    });
  };

  useEffect(() => {
    getThreats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (dataSource.length) {
      initSearchParams(dataSource);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSource]);

  return (
    <>
      

      <ProTable<PublicThreat>
        headerTitle={version?.version_name}
        search={{ defaultCollapsed: false, optionRender: false, labelWidth: 120 }}
        rowKey="threat_id"
        size="small"
        options={{
          density: false,
          fullScreen: false,
          reload: () => {
            setLoading(true);
            getThreats();
          },
        }}
        loading={loading}
        dataSource={filteredDataSource.filter((item) => {
          const isCveId =
            (filters.cve_id || []).length === 0 || (filters.cve_id.includes(item.metadata.cve_id) ?? true); 
          const isSeverity =
            filters.severities?.length === 0 || (filters.severities?.includes(item.severity) ?? true);
          const isPackages =
            filters.packages?.length === 0 || (filters.packages?.includes(item.metadata.component?.product) ?? true);
          const isStatus =
            filters.work_status?.length === 0 ||
            (filters.work_status?.includes(item?.work_status ?? 'NoStatus') ?? true);
          return isCveId && isSeverity && isPackages && isStatus;
        })}
        pagination={{
          pageSize: 10,
          showQuickJumper: true,
        }}
        columns={columns}
        scroll={{ x: 890 }}
        bordered

        toolBarRender={() => [
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Select
              value={filterOption}
              onChange={handleFilterChange}
              style={{ marginLeft: 16 }} // 适当的左边距
            >
              <Select.Option value="all">{formatMessage({ id: `${baseMessageId}.filter.all`, defaultMessage: '显示全部' })}</Select.Option>
              <Select.Option value="empty">{formatMessage({ id: `${baseMessageId}.filter.empty`, defaultMessage: '仅未过滤项' })}</Select.Option>
              <Select.Option value="not_empty">{formatMessage({ id: `${baseMessageId}.filter.not_empty`, defaultMessage: '仅已过滤项' })}</Select.Option>
            </Select>
          </div>
        ]}
      />
    </>
  );
};

export default ThreatsTable;
