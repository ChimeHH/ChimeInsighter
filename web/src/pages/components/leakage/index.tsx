import { severityMap, severityColorMap, infoleakTypeMap } from '@/utils/constant';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Select, Tag, Button } from 'antd';
import type { DefaultOptionType } from 'antd/lib/select';
import { useEffect, useState } from 'react';
import { history, useParams, useIntl } from 'umi';
import type { Version } from '../version/data';
import { selectThreats } from './service';
import { CopyOutlined } from '@ant-design/icons'; 

const colorsMap = {
  1: '#b7c5c7',
  2: '#fd9e38',
  3: '#f56767',
  4: '#e50100',
};

const queryParams = {
  'filters[0].threat_type': 'infoleak',
};


const categories: DefaultOptionType[] = Object.entries(infoleakTypeMap).map(([value, label]) => ({
    value,
    label,
  }));

const baseMessageId = 'pages.table';

const ThreatsTable: React.FC = () => {
  const { vid: version_id } = useParams<{ vid: string; name: string }>();
  const [version, setVersion] = useState<Version>();
  const [dataSource, setDataSource] = useState<LeakageThreat[]>([]);
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

  const setFilter = (params: Record<string, any[]>) => {
    setFilters((s) => ({
      ...s,
      ...params,
    }));
  };
 
  const columns: ProColumns<LeakageThreat>[] = [   
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
      width: 40,
      hideInSearch: true,
      ellipsis: true,
      render: (_, entity) => {
        if (infoleakTypeMap && entity.sub_type) {
          return infoleakTypeMap[entity.sub_type];
        }
        return null; // 或者返回一个默认值
      },
      sorter: (a, b) => a.sub_type.localeCompare(b.sub_type),
    },

    {
      title: formatMessage({ id: `${baseMessageId}.title.data` }),
      width: 120,
      hideInSearch: true,
      ellipsis: true,
      render: (_, entity) => entity.metadata.text,
      sorter: (a, b) => a.metadata.text.localeCompare(b.metadata.text),
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
      title: formatMessage({ id: `${baseMessageId}.title.offset` }),
      width: 30,
      hideInSearch: true,
      render: (_, entity) => {
        // 确保 entity.metadata.offset 是字符串
        const offset = String(entity.metadata.offset || '');
        const offsetList = offset.split(',');
    
        // 判断数量并返回对应的内容
        return (
          <>
            {offsetList.slice(0, 3).map((value, index) => (
              <div key={index}>{value}</div>
            ))}
            {offsetList.length > 3 && (
              <div>... {offsetList.length - 3} more</div>
            )}
          </>
        );
      },
    },    
    {
      title: formatMessage({ id: `${baseMessageId}.title.filepath` }),
      width: 160,
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
          <a onClick={() => history.push(`./${entity.threat_id}/leakage`)}>
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

  const copyToClipboard = () => {
    const filteredData = dataSource.filter(
      (item) => !filters?.category || item.sub_type === filters.category,
    );
  
    const jsonStr = JSON.stringify(filteredData, null, 2);
    navigator.clipboard.writeText(jsonStr).catch((err) => {
      console.error('Could not copy text: ', err);
    });
  };
  

  return (
    <>
      <ProTable<LeakageThreat>
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
        toolBarRender={() => [  
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>              
            <Button icon={<CopyOutlined />} onClick={copyToClipboard} style={{ marginLeft: 8 }} />
          </div>,  
        ]} 
      />
    </>
  );
};

export default ThreatsTable;
