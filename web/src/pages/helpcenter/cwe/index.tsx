import React, { useEffect, useState } from 'react';
import { Card, message, Row, Col, Input } from 'antd';
import { useIntl, history } from 'umi';
import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import { getCweList } from './service'; // 假设service.ts文件中定义了这些函数
import { Cwe } from './data'; // 假设data.d.ts文件中定义了这些类型

const CweListPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<Cwe[]>([]);
  const [filterId, setFilterId] = useState<string>(''); // 新增状态
  const { formatMessage } = useIntl();

  const getCwes = async () => {
    setLoading(true);
    const hide = message.loading(formatMessage({ id: 'pages.cwe.message.loading' }), 0);
    const res = await getCweList();
    if (res?.data) {
      hide();
      setLoading(false);
      message.success(formatMessage({ id: 'pages.cwe.getList.success' }));
      setDataSource(res.data.cwes);
      return;
    }

    hide();
    setLoading(false);
  };

  useEffect(() => {
    getCwes();
  }, []);

  const handleIdFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterId(e.target.value);
  };

  const filteredData = dataSource.filter((item: any) =>
    item.cwe_id.toString().includes(filterId)
  ).sort((a, b) => parseInt(a.cwe_id.split('-')[1]) - parseInt(b.cwe_id.split('-')[1]));

  const columns: ProColumns<Cwe>[] = [
    {
      title: formatMessage({ id: 'pages.cwe.title.cweId' }),
      dataIndex: 'cwe_id',
      width: 100,
      hideInSearch: true,
      sorter: (a, b) => parseInt(a.cwe_id.split('-')[1]) - parseInt(b.cwe_id.split('-')[1]),
      defaultSortOrder: 'ascend', // 默认升序排列
    },
    {
      title: formatMessage({ id: 'pages.cwe.title.name' }),
      dataIndex: 'name',
      width: 200,
      hideInSearch: true,
      ellipsis: true,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: formatMessage({ id: 'pages.cwe.title.description' }),
      dataIndex: 'description',
      width: 300,
      hideInSearch: true,
      ellipsis: true,
      sorter: (a, b) => a.description.localeCompare(b.description),
    },
    {
      title: formatMessage({ id: 'pages.cwe.title.action' }),
      width: 100,
      fixed: 'right',
      hideInSearch: true,
      render: (_, entity) => {
        return (
          <a onClick={() => history.push(`/helpcenter/cwe/${entity.cwe_id}`)}>
            {formatMessage({ id: 'pages.cwe.action.detail' })}
          </a>
        );
      },
    },
  ];

  return (
    <Card>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Input
            style={{ width: '100%' }}
            placeholder={formatMessage({ id: 'pages.cwe.index.searchPlaceholder' })}
            value={filterId}
            onChange={handleIdFilterChange}
          />
        </Col>
      </Row>
      <ProTable<Cwe>
        headerTitle={formatMessage({ id: 'pages.cwe.title.cweList' })}
        search={{ defaultCollapsed: false, optionRender: false, labelWidth: 120 }}
        rowKey="cwe_id"
        size="small"
        options={{
          density: false,
          fullScreen: false,
          reload: () => {
            setLoading(true);
            getCwes();
          },
        }}
        loading={loading}
        dataSource={filteredData}
        pagination={{
          pageSize: 10,
          showQuickJumper: true,
        }}
        columns={columns}
        scroll={{ x: 410 }}
        bordered
      />
    </Card>
  );
};

export default CweListPage;
