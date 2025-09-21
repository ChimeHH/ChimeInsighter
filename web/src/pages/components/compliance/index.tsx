import { severityMap, severityColorMap, complianceTypeMap } from '@/utils/constant';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Select, Tag } from 'antd';
import type { DefaultOptionType } from 'antd/lib/select';
import { useEffect, useState } from 'react';
import { useParams, history, useIntl } from 'umi';
import type { Version } from '../version/data';
import { selectThreats } from './service';

const colorsMap = {
  1: '#b7c5c7',
  2: '#fd9e38',
  3: '#f56767',
  4: '#e50100',
};

const queryParams = {
  'filters[0].threat_type': 'compliance',
};

const baseMessageId = 'pages.table';

const ThreatsTable: React.FC = () => {
  const { vid: version_id } = useParams<{ vid: string; name: string }>();
  const [version, setVersion] = useState<Version>();
  const [dataSource, setDataSource] = useState<ComplianceThreat[]>([]);  
  const [loading, setLoading] = useState(true);
  const [categoryInfo, setCategoryInfo] = useState<DefaultOptionType[]>([]);
  const [filters, setFilters] = useState<Partial<{ category: string }>>({});
  const { formatMessage } = useIntl();
  
  const getComplianceThreats = async () => {
    const res = await selectThreats({
      version_id,
      ...queryParams,
    });
    const threats = res?.data?.threats;

    // 预处理数据，添加 groupName 字段
    if (Array.isArray(threats)) {
      const processedThreats = threats.map(threat => {
        const groupName = complianceTypeMap[threat.sub_type] || threat.sub_type; // 获取对应的 group name
        return { ...threat, groupName };
      });
      
      setDataSource(processedThreats);

      // 生成带数量的 categoryInfo
      const categoryCount: { [key: string]: number } = {};

      processedThreats.forEach(threat => {
        const groupName = threat.groupName;
        categoryCount[groupName] = (categoryCount[groupName] || 0) + 1; // 统计数量
      });

      const newCategoryInfo = Object.entries(categoryCount).map(([category, count]) => ({
        value: category,
        label: `${category} (${count})`, // 显示数量
      }));
      
      setCategoryInfo(newCategoryInfo);
    }

    setVersion(res?.data?.version);
    setLoading(false);
  };

  const setFilter = (params: Record<string, any[]>) => {
    setFilters((s) => ({
      ...s,
      ...params,
    }));
  };

  const columns: ProColumns<ComplianceThreat>[] = [  
    {
      title: formatMessage({ id: `${baseMessageId}.title.threatId` }),
      width: 100,
      dataIndex: 'threat_id',
      hideInSearch: true,
      hideInTable: true,
      sorter: (a, b) => parseInt(a.threat_id.split('-')[1]) - parseInt(b.threat_id.split('-')[1]),
    }, 
    {
      title: formatMessage({ id: `${baseMessageId}.title.rule` }),
      width: 45,
      hideInSearch: true,
      ellipsis: true,
      render: (_, entity) => {
        if (complianceTypeMap && entity.sub_type) {
          return complianceTypeMap[entity.sub_type];
        }
      },
      sorter: (a, b) => a.sub_type.localeCompare(b.sub_type),
    },
    {
      title: formatMessage({ id: `${baseMessageId}.title.name` }),
      width: 45,
      hideInSearch: true,
      ellipsis: true,
      render: (_, entity) => entity.metadata.name,
      sorter: (a, b) => a.metadata.name.localeCompare(b.metadata.name),
    },
    {
      title: formatMessage({ id: `${baseMessageId}.title.category` }),
      dataIndex: 'category',
      hideInTable: true,
      renderFormItem: () => (
        <Select
          allowClear={true}
          showArrow={true}
          filterOption={true}
          options={categoryInfo}
          onChange={(value) => setFilter({ category: value })}
          placeholder={formatMessage({ id: `${baseMessageId}.title.category` })}
        />
      ),
    },
    {
      title: formatMessage({ id: `${baseMessageId}.title.function` }),
      width: 30,
      hideInSearch: true,
      ellipsis: false,
      render: (_, entity) => entity.metadata.function,
      sorter: (a, b) => a.metadata.function.localeCompare(b.metadata.function),
    }, 
    {
      title: formatMessage({ id: `${baseMessageId}.title.description` }),
      width: 160,
      hideInSearch: true,
      ellipsis: false,
      render: (_, entity) => entity.metadata.description,  // 注意，这里是 description
      sorter: (a, b) => a.metadata.description.localeCompare(b.metadata.description),
    },  

    {
      title: formatMessage({ id: `${baseMessageId}.title.severity` }),
      width: 30,
      hideInSearch: true,
      render: (_, record) => {
        const color = severityColorMap[record.severity]; // 使用 severityColorMap 获取颜色
        return (
          <Tag style={{ borderColor: color, color: '#000000' }} color={color}>
            {severityMap[record.severity]}
          </Tag>
        );
      },
      sorter: (a, b) => a.severity - b.severity,
    },
    
    
    {
      title: formatMessage({ id: `${baseMessageId}.title.filepath` }),
      width: 160,
      hideInSearch: true,
      render: (_, entity) => <pre>{entity.filepath.map((path, index) => `${index + 1}. ${path}`).join(",\n")}</pre>,
    },
    
    {
      title: formatMessage({ id: `${baseMessageId}.title.action` }),
      width: 60,
      fixed: 'right',
      hideInSearch: true,
      render: (_, entity) => {
        return (
          <a onClick={() => history.push(`./${entity.threat_id}/compliance`)}>
            {formatMessage({ id: `${baseMessageId}.action.detail` })}
          </a>
        );
      },
    },
  ];

  useEffect(() => {    
    getComplianceThreats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ProTable<ComplianceThreat>
        headerTitle={version?.version_name}
        search={{ defaultCollapsed: false, optionRender: false, labelWidth: 120 }}
        rowKey="threat_id"
        size="small"
        options={{
          density: false,
          fullScreen: false,
          reload: () => {
            setLoading(true);
            getComplianceThreats();
          },
        }}
        loading={loading}
        dataSource={dataSource.filter(
          (item) => !filters?.category || item.groupName === filters.category,
        )}
        pagination={{
          pageSize: 10,
          showQuickJumper: true,
        }}
        columns={columns}
        scroll={{ x: 410 }}
        bordered
      />
    </>
  );
};

export default ThreatsTable;
