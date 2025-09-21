import { severityMap, severityColorMap, misconfigurationTypeMap } from '@/utils/constant';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Select, Tag } from 'antd';
import type { DefaultOptionType } from 'antd/lib/select';
import { useEffect, useState } from 'react';
import { history, useParams, useIntl } from 'umi';
import type { Version } from '../version/data';
import { selectThreats } from './service';

const colorsMap = {
  1: '#b7c5c7',
  2: '#fd9e38',
  3: '#f56767',
  4: '#e50100',
};

const queryParams = {
  'filters[0].threat_type': 'misconfiguration',
};

const categories: DefaultOptionType[] = Object.entries(misconfigurationTypeMap).map(([value, label]) => ({
  value,
  label,
}));

const baseMessageId = 'pages.table';

const ThreatsTable: React.FC = () => {
  const { vid: version_id } = useParams<{ vid: string; name: string }>();
  const [version, setVersion] = useState<Version>();
  const [dataSource, setDataSource] = useState<MisconfigurationThreat[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryInfo, setCategoryInfo] = useState<DefaultOptionType[]>([]);
  const [filters, setFilters] = useState<
    Partial<{
      category: number;
    }>
  >({});
  const { formatMessage } = useIntl();
  
  const getThreats = async () => {
    const res = await selectThreats({
      version_id,
      ...queryParams,
    });
    const threats = res?.data?.threats;
    if (Array.isArray(threats)) {
      setDataSource(threats);
    }

    setVersion(res?.data?.version);
    setLoading(false);
  };

  const setFilter = (params: Partial<{
    category: number;
  }>) => {
    setFilters((s) => ({
      ...s,
      ...params,
    }));
  };
 
  const columns: ProColumns<MisconfigurationThreat>[] = [      
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
      width: 80,
      hideInSearch: true,
      ellipsis: false,
      render: (_, entity) => {
        if (misconfigurationTypeMap && entity.sub_type) {
          return misconfigurationTypeMap[entity.sub_type];
        }
        return null; // 或者返回一个默认值
      },
      sorter: (a, b) => a.sub_type.localeCompare(b.sub_type),
    },
    {
      title: formatMessage({ id: `${baseMessageId}.title.category` }),
      width: 80,
      hideInSearch: true,
      ellipsis: false,
      render: (_, entity) => entity.metadata.category,
      sorter: (a, b) => a.metadata.category.localeCompare(b.metadata.category),
    },
    {
      title: formatMessage({ id: `${baseMessageId}.title.prop` }),
      width: 80,
      hideInSearch: true,
      ellipsis: false,
      render: (_, entity) => entity.metadata.prop,
      sorter: (a, b) => a.metadata.prop.localeCompare(b.metadata.prop),
    },
    {
      title: formatMessage({ id: `${baseMessageId}.title.configured` }),
      width: 60,
      hideInSearch: true,
      ellipsis: false,
      render: (_, entity) => entity.metadata.configured,
      sorter: (a, b) => (a.metadata.configured || '').localeCompare(b.metadata.configured || ''),
    },
    {
      title: formatMessage({ id: `${baseMessageId}.title.suggested` }),
      width: 60,
      hideInSearch: true,
      ellipsis: false,
      render: (_, entity) => entity.metadata.suggested,
      sorter: (a, b) => a.metadata.suggested - b.metadata.suggested,
    },
      
    {
      title: formatMessage({ id: `${baseMessageId}.title.severity` }),
      width: 40,
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
      width: 120,
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
          <a onClick={() => history.push(`./${entity.threat_id}/misconfiguration`)}>
            {formatMessage({ id: `${baseMessageId}.action.detail` })}
          </a>
        );
      },
    },
  ];

  useEffect(() => {
    getThreats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (dataSource.length) {
      const newCategoryInfo = categories.map((item) => {
        const count = dataSource.filter((data) => data.sub_type === item.value)?.length || 0;
        const label = `${item.label} (${count})`;
        return { ...item, label };
      });
      setCategoryInfo(newCategoryInfo);
    }
  }, [dataSource]);

  return (
    <>
      <ProTable<MisconfigurationThreat>
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
        dataSource={dataSource.filter(
          (item) => !filters?.category || item.sub_type === filters.category,
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
