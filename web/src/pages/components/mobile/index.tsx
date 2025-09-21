import { severityMap, severityColorMap, workStatusMap, workStatusColorMap, } from '@/utils/constant';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { message, Select, Tag } from 'antd';
import type { DefaultOptionType } from 'antd/lib/select';
import { useEffect, useState } from 'react';
import { history, useParams, useIntl } from 'umi';
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
  'filters[0].threat_type': 'mobile',
};

const baseMessageId = 'pages.table';

const ThreatsTable: React.FC = () => {
  const { vid: version_id } = useParams<{ vid: string; name: string }>();
  const [version, setVersion] = useState<Version>();
  const [dataSource, setDataSource] = useState<MobileThreat[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState<
    Partial<{
      severities: DefaultOptionType[];
      threat_sub_types: DefaultOptionType[];
      vulnerability_sub_types: DefaultOptionType[];
      work_statuses: DefaultOptionType[];
    }>
  >({});
  const [filters, setFilters] = useState<Partial<{
    severities: number[];
    threat_sub_types: number[];
    vulnerability_sub_types: number[];
    work_statuses: number[];
  }>>({});
  const { formatMessage } = useIntl();

  const getThreats = async () => {
    const res = await selectThreats({
      version_id,
      ...queryParams,
    });
    const threats = res?.data?.threats;
    if (Array.isArray(threats)) {
      setDataSource(threats);
      setVersion(res.data?.version);
    }
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
    threat_sub_types: number[];
    vulnerability_sub_types: number[];
    work_statuses: string[];
  }>) => {
    setFilters((s) => ({
      ...s,
      ...params,
    }));
  };

  const columns: ProColumns<MobileThreat>[] = [
    {
      title: formatMessage({ id: `${baseMessageId}.title.threatId` }),
      width: 100,
      dataIndex: 'threat_id',
      hideInSearch: true,
      hideInTable: true,
      sorter: (a, b) => parseInt(a.threat_id.split('-')[1]) - parseInt(b.threat_id.split('-')[1]),
    },
    {
      title: formatMessage({ id: `${baseMessageId}.title.type` }),
      width: 20,
      render: (_, entity) => {
        return entity.sub_type;
      },
      renderFormItem: () => {
        return (
          <Select
            mode="multiple"
            allowClear={true}
            showArrow={true}
            filterOption={true}
            options={searchParams.threat_sub_types}
            onChange={(value) => setFilter({ threat_sub_types: value })}
            placeholder={formatMessage({ id: `${baseMessageId}.title.type` })}
          />
        );
      },
      sorter: (a, b) => a.sub_type.localeCompare(b.sub_type),
    },
    {
      title: formatMessage({ id: `${baseMessageId}.title.sub_type` }),
      width: 40,
      render: (_, entity) => {
        return entity.metadata.vulnerability_sub_type;
      },
      renderFormItem: () => {
        return (
          <Select
            mode="multiple"
            allowClear={true}
            showArrow={true}
            filterOption={true}
            options={searchParams.vulnerability_sub_types}
            onChange={(value) => setFilter({ vulnerability_sub_types: value })}
            placeholder={formatMessage({ id: `${baseMessageId}.title.sub_type` })}
          />
        );
      },
      sorter: (a, b) => a.metadata.vulnerability_sub_type.localeCompare(b.metadata.vulnerability_sub_type),
    },
    {
      title: formatMessage({ id: `${baseMessageId}.title.severity` }),
      width: 30,
      render: (_, entity) => {
        const color = severityColorMap[entity.severity] || '#000'; 
        return (
          <Tag color={color} style={{ borderColor: color, color: '#fff' }}>
            {severityMap[entity.severity]}
          </Tag>
        );
      },
      renderFormItem: () => {
        return (
          <Select
            mode="multiple"
            allowClear={true}
            showArrow={true}
            filterOption={true}
            options={searchParams.severities}
            onChange={(value) => setFilter({ severities: value })}
            placeholder={formatMessage({ id: `${baseMessageId}.title.severity` })}
          />
        );
      },
      sorter: (a, b) => a.severity.localeCompare(b.severity),
    },
    
    {
      title: formatMessage({ id: `${baseMessageId}.title.name` }),
      width: 60,
      hideInSearch: true,
      render: (_, entity) => {
        if (entity.metadata.name) {
        return entity.metadata.name;
        } else if (entity.metadata.category) {
          if (entity.metadata.file_object) {
            return `${entity.metadata.category} - ${entity.metadata.file_object.split(/[\\/]/).pop()}`;
          } else {
            return entity.metadata.category;
          }
        }
      }
    },  
    
    {
      title: formatMessage({ id: `${baseMessageId}.title.description` }),
      width: 100,
      hideInSearch: true,
      render: (_, entity) => {
        if (entity.metadata.description) {
          return entity.metadata.description;
        } else if (entity.metadata.urls) {
          return Array.isArray(entity.metadata.urls) ? entity.metadata.urls.join(', ') : entity.metadata.urls.toString();
        } else if (entity.metadata.activities) {
          return Array.isArray(entity.metadata.activities) ? entity.metadata.activities.join(', ') : entity.metadata.activities.toString();
        }  else if (entity.metadata.yara_issue) {
          return Array.isArray(entity.metadata.yara_issue) ? entity.metadata.yara_issue.join(', ') : entity.metadata.yara_issue.toString();
        } else if (entity.metadata.domain) {
          return entity.metadata.domain;
        }  else if (entity.metadata.data) {
          if (typeof entity.metadata.data === 'object' && !Array.isArray(entity.metadata.data)) {
            // 如果是对象，则返回其键，用换行符分隔
            return <pre>{Object.keys(entity.metadata.data).join('\n')}</pre>;
          } else if (Array.isArray(entity.metadata.data)) {
            // 如果是数组，则返回其元素，用逗号分隔
            return <pre>{entity.metadata.data.join(', ')}</pre>;
          } else if (typeof entity.metadata.data === 'string') {
            // 如果是字符串，则直接返回
            return <pre>{entity.metadata.data}</pre>;
          } else {
            // 如果是其他类型，则返回空字符串或自定义的默认值
            return <pre>''</pre>;
          }        
        } else {
          return ''; // 或者你希望在所有都不存在时显示的默认值
        }
      },
    },
    
    {
      title: formatMessage({ id: `${baseMessageId}.title.risks` }),
      width: 30,
      hideInSearch: true,
      render: (_, entity) => {
        const cwes = entity.metadata.cwes || entity.metadata.cwe;
        if (Array.isArray(cwes)) {
          return cwes.join(' | ');
        } else if (typeof cwes === 'string') {
          return cwes.replaceAll(',', ' | ');
        }
        return ''; 
      },      
    },    
    {
      title: formatMessage({ id: `${baseMessageId}.title.status` }),
      width: 40,
      render: (_, record) => {
        const statusColor = workStatusColorMap[record?.work_status ?? 'NoStatus'] || '#000'; 
        return (
          <Select
            value={record?.work_status ?? 'NoStatus'}
            bordered={false}
            style={{ width: 112, backgroundColor: statusColor, color: '#fff', padding: '2px 5px', borderRadius: '4px' }}
            onChange={(value) => reviseThreatStatus({ threat_id: record.threat_id, work_status: value })}
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
          options={searchParams.work_statuses}
          onChange={(value) => setFilter({ work_statuses: value })}
          placeholder={formatMessage({ id: `${baseMessageId}.title.status` })}
        />
      ),
      sorter: (a, b) =>
        (a?.work_status ?? 'NoStatus').localeCompare(b?.work_status ?? 'NoStatus'),
      fixed: 'right',
    },
    {
      title: formatMessage({ id: `${baseMessageId}.title.filepath` }),
      width: 200,
      hideInSearch: true,
      render: (_, entity) => <pre>{entity.filepath.map((path, index) => `${index + 1}. ${path}`).join(",\n")}</pre>,
    },
    {
      title: formatMessage({ id: `${baseMessageId}.title.action` }),
      width: 40,
      fixed: 'right',
      hideInSearch: true,
      render: (_, entity) => {
        return (
          <a onClick={() => history.push(`./${entity.threat_id}/mobile`)}>
            {formatMessage({ id: `${baseMessageId}.action.detail` })}
          </a>
        );
      },
    },
  ];

  const initSearchParams = (threats: MobileThreat[]) => {
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
    
    const threat_sub_types: DefaultOptionType[] = [];
    const vulnerability_sub_types: DefaultOptionType[] = [];    
    const work_statuses: DefaultOptionType[] = [];

    threats.forEach((threat) => {
      const vulnerability_type = threat_sub_types.find((item) => item.value === threat.sub_type);
      if (!vulnerability_type) {
        const originalType = threat.sub_type; // 原始信息
        threat_sub_types.push({
          label: originalType,
          value: originalType,
        });
      }

      // 新增：处理 vulnerability_sub_types
      const vulnerability_sub_type = vulnerability_sub_types.find((item) => item.value === threat.metadata.vulnerability_sub_type);
      if (!vulnerability_sub_type) {
        const originalSubType = threat.metadata.vulnerability_sub_type; // 原始信息
        vulnerability_sub_types.push({
          label: originalSubType, // 使用映射，如果没有找到就用原始信息
          value: originalSubType, // 使用原始信息作为 value
        });
      }

      // 新增：处理 vulnerability_sub_types
      const work_status = work_statuses.find((item) => item.value === (threat?.work_status||'NoStatus'));
      if (!work_status) {
        const originalStatus = threat?.work_status ?? 'NoStatus'; // 原始信息
        work_statuses.push({
          label: workStatusMap[originalStatus] ?? originalStatus,
          value: originalStatus,
        });
      }
      
    });

    setSearchParams({
      severities,
      threat_sub_types,
      vulnerability_sub_types,
      work_statuses,
    });
  };

  const getData = async () => {
    await getThreats();
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (dataSource.length) initSearchParams(dataSource);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSource]);

  return (
    <>
      <ProTable<MobileThreat>
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
        dataSource={dataSource.filter((item) => {
          const isSeverity =
            filters.severities?.length === 0 || (filters.severities?.includes(item.severity) ?? true);          
          const isTheatSubType =
            filters.threat_sub_types?.length === 0 || (filters.threat_sub_types?.includes(item.sub_type) ?? true);
          const isVulnerabilitySubType =
            filters.vulnerability_sub_types?.length === 0 || (filters.vulnerability_sub_types?.includes(item.metadata.vulnerability_sub_type) ?? true);
          const isStatus =
            filters.work_statuses?.length === 0 ||
            (filters.work_statuses?.includes(item?.work_status ?? 'NoStatus') ?? true);
  
          const result = isSeverity && isTheatSubType && isVulnerabilitySubType && isStatus;

          return result;
        })}
        pagination={{
          pageSize: 10,
          showQuickJumper: true,
        }}
        columns={columns}
        scroll={{ x: 900 }}
        bordered
      />
    </>
  );
};

export default ThreatsTable;
