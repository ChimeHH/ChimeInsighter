import { severityMap, severityColorMap } from '@/utils/constant';
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
  'filters[0].threat_type': 'password',
};

const baseMessageId = 'pages.table';

const ThreatsTable: React.FC = () => {
  const { vid: version_id } = useParams<{ vid: string; name: string }>();
  const [version, setVersion] = useState<Version>();
  const [dataSource, setDataSource] = useState<PasswordThreat[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryInfo, setCategoryInfo] = useState<DefaultOptionType[]>([]);
  const [severityInfo, setSeverityInfo] = useState<DefaultOptionType[]>([]);
  const [typeInfo, setTypeInfo] = useState<DefaultOptionType[]>([]);
  const [filters, setFilters] = useState<
    Partial<{
      sub_type: string;
      severity: string;
      type: string;
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

  const setFilter = (params: Record<string, any>) => {
    setFilters((s) => ({
      ...s,
      ...params,
    }));
  };
 
  const columns: ProColumns<PasswordThreat>[] = [   
    {
      title: formatMessage({ id: `${baseMessageId}.title.threatId` }),
      width: 100,
      dataIndex: 'threat_id',
      hideInTable: true, // 设置为默认隐藏
      hideInSearch: true,
      sorter: (a, b) => parseInt(a.threat_id.split('-')[1]) - parseInt(b.threat_id.split('-')[1]),
    }, 
    {
      title: formatMessage({ id: `${baseMessageId}.title.type` }),
      width: 30,
      dataIndex: 'sub_type',
      hideInSearch: false,
      ellipsis: true,
      render: (_, entity) => {
        return entity.sub_type; // 直接返回sub_type，因为没有infoleakTypeMap
      },
      sorter: (a, b) => a.sub_type.localeCompare(b.sub_type),
      renderFormItem: () => (
        <Select
          allowClear={true}
          showArrow={true}
          filterOption={true}
          options={categoryInfo}
          onChange={(value) => setFilter({ sub_type: value })}
          placeholder={formatMessage({ id: `${baseMessageId}.title.type` })}
        />
      ),
    },
    {
      title: formatMessage({ id: `${baseMessageId}.title.metadataType` }),
      width: 30,
      dataIndex: ['metadata', 'type'],
      hideInSearch: false,
      ellipsis: true,
      render: (_, entity) => {
        return entity.metadata.type;
      },
      sorter: (a, b) => a.metadata.type.localeCompare(b.metadata.type),
      renderFormItem: () => (
        <Select
          allowClear={true}
          showArrow={true}
          filterOption={true}
          options={typeInfo}
          onChange={(value) => setFilter({ type: value })}
          placeholder={formatMessage({ id: `${baseMessageId}.title.metadataType` })}
        />
      ),
    },
    {
      title: formatMessage({ id: `${baseMessageId}.title.data` }),
      width: 100,
      hideInSearch: true,
      ellipsis: false,
      render: (_, entity) => entity.metadata.text,
      sorter: (a, b) => a.metadata.text.localeCompare(b.metadata.text),
    },
    {
      title: formatMessage({ id: `${baseMessageId}.title.severity` }),
      width: 25,
      dataIndex: 'severity',
      hideInSearch: false,
      render: (_, record) => {
        const color = severityColorMap[record.severity]; // 使用 severityColorMap 获取颜色
        return (
          <Tag style={{ borderColor: color, color: '#000000' }} color={color}>
            {severityMap[record.severity]}
          </Tag>
        );
      },
      sorter: (a, b) => a.severity - b.severity,
      renderFormItem: () => (
        <Select
          allowClear={true}
          showArrow={true}
          filterOption={true}
          options={severityInfo}
          onChange={(value) => setFilter({ severity: value })}
          placeholder={formatMessage({ id: `${baseMessageId}.title.severity` })}
        />
      ),
    },
    {
      title: formatMessage({ id: `${baseMessageId}.title.offset` }),
      width: 25,
      hideInSearch: true,
      render: (_, entity) => entity.metadata.offset,
      sorter: (a, b) => a.metadata.offset - b.metadata.offset,
    },
    {
      title: formatMessage({ id: `${baseMessageId}.title.filepath` }),
      width: 160,
      hideInSearch: true,
      render: (_, entity) => <pre>{entity.filepath.map((path, index) => `${index + 1}. ${path}`).join(",\n")}</pre>,
    },
    {
      title: formatMessage({ id: `${baseMessageId}.title.action` }),
      width: 30,
      fixed: 'right',
      hideInSearch: true,
      render: (_, entity) => {
        return (
          <a onClick={() => history.push(`./${entity.threat_id}/password`)}>
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
      const subTypes = [...new Set(dataSource.map(item => item.sub_type))];
      const newCategoryInfo = subTypes.map(type => ({
        value: type,
        label: type,
      }));
      setCategoryInfo(newCategoryInfo);

      const severities = [...new Set(dataSource.map(item => item.severity))];
      const newSeverityInfo = severities.map(severity => ({
        value: severity,
        label: severityMap[severity],
      }));
      setSeverityInfo(newSeverityInfo);

      const types = [...new Set(dataSource.map(item => item.metadata.type))];
      const newTypeInfo = types.map(type => ({
        value: type,
        label: type,
      }));
      setTypeInfo(newTypeInfo);
    }
  }, [dataSource]);

  return (
    <>
      <ProTable<PasswordThreat>
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
          (item) => (!filters?.sub_type || item.sub_type === filters.sub_type) &&
                    (!filters?.severity || item.severity === filters.severity) &&
                    (!filters?.type || item.metadata.type === filters.type),
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
