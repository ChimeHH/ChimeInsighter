import { securityTypeMap } from '@/utils/constant';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Select } from 'antd';
import type { DefaultOptionType } from 'antd/lib/select';
import { useEffect, useState } from 'react';
import { useParams, history, useIntl } from 'umi';
import type { Version } from '../version/data';
import { selectThreats } from './service';

const queryParams = {  
  'filters[0].threat_type': 'security',
};

const baseMessageId = 'pages.table';

const ThreatsTable: React.FC = () => {
  const { vid: version_id } = useParams<{ vid: string; name: string }>();
  const [version, setVersion] = useState<Version>();
  const [dataSource, setDataSource] = useState<SecurityThreat[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryInfo, setCategoryInfo] = useState<DefaultOptionType[]>([]);
  const [filters, setFilters] = useState<
    Partial<{
      sub_type: string; // 修改为字符串类型
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
    sub_type: string; // 修改为字符串类型
  }>) => {
    setFilters((s) => ({
      ...s,
      ...params,
    }));
  };

  const renderMetadata = (metadata: { data: string[] }) => {
    if (typeof metadata !== 'object' || metadata === null) {
      return JSON.stringify(metadata);
    }
  
    // 生成每个元素及其索引的字符串
    return metadata.data.map((item, index) => `${index}: ${item}`).join('\n');
  };
  
  

  const columns: ProColumns<SecurityThreat>[] = [  
    {
      title: formatMessage({ id: `${baseMessageId}.title.threatId` }),
      width: 150,
      dataIndex: 'threat_id',
      hideInSearch: true,
      hideInTable: true,
      sorter: (a, b) => parseInt(a.threat_id.split('-')[1]) - parseInt(b.threat_id.split('-')[1]),
    }, 
    {
      title: formatMessage({ id: `${baseMessageId}.title.category` }),
      dataIndex: 'sub_type',
      width: 80,
      ellipsis: true,
      render: (_, entity) => {
        if (securityTypeMap && entity.sub_type) {
          return securityTypeMap[entity.sub_type];
        }
        return entity.sub_type; // 默认返回 sub_type 的值
      },
      renderFormItem: () => (
        <Select
          allowClear={true}
          showArrow={true}
          filterOption={true}
          options={categoryInfo}
          onChange={(value) => setFilter({ sub_type: value })}
          placeholder={formatMessage({ id: `${baseMessageId}.title.category` })}
        />
      ),
      sorter: (a, b) => a.sub_type.localeCompare(b.sub_type),
    },
    {
      title: formatMessage({ id: `${baseMessageId}.title.metadata` }),
      width: 280,
      hideInSearch: true,
      render: (_, entity) => <pre>{renderMetadata(entity.metadata)}</pre>,
    },
    {
      title: formatMessage({ id: `${baseMessageId}.title.filepath` }),
      width: 300,
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
          <a onClick={() => history.push(`./${entity.threat_id}/security`)}>
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
      const uniqueSubTypes = [...new Set(dataSource.map(item => item.sub_type))];
      const newCategoryInfo = uniqueSubTypes.map(subType => {
        const count = dataSource.filter(item => item.sub_type === subType).length;
        return {
          value: subType,
          label: `${securityTypeMap[subType] || subType} (${count})`,
        };
      });
      setCategoryInfo(newCategoryInfo);
    }
  }, [dataSource]);

  const filteredDataSource = dataSource.filter(
    (item) => !filters?.sub_type || item.sub_type === filters.sub_type,
  );

  return (
    <>
      <ProTable<SecurityThreat>
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
        dataSource={filteredDataSource}
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
