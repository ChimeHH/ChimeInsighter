import React, { useEffect, useState } from 'react';
import { Card, Row, Col, message, Input, Select } from 'antd';
import { useIntl, history } from 'umi';
import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import { getLicenseList } from './service'; // 假设service.ts文件中定义了这些函数
import { License } from './data'; // 假设data.d.ts文件中定义了这些类型

const { Option } = Select;

const LicenseListPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<License[]>([]);
  const { formatMessage, locale } = useIntl();
  
  // 状态变量用于过滤
  const [filterId, setFilterId] = useState<string>(''); 
  const [filterType, setFilterType] = useState<string>(''); 

  // 语言翻译映射
  const localeMap: { [key: string]: string } = {
    'zh-CN': 'cn', // 中文
    'en-US': 'en', // 英文
    // 可以根据需要添加其他语言的映射
  };

  const getLicenses = async () => {
    setLoading(true);
    const hide = message.loading(formatMessage({ id: 'pages.license.message.loading' }), 0);
    const res = await getLicenseList();
    if (res?.data) {
      hide();
      setLoading(false);
      message.success(formatMessage({ id: 'pages.license.getList.success' }));
      setDataSource(res.data.licenses);
      return;
    }
    hide();
    setLoading(false);
  };

  useEffect(() => {
    getLicenses();
  }, []);

  const filteredData = dataSource.filter(item =>
    (!filterId || item.license.includes(filterId)) &&
    (!filterType || item.type.includes(filterType))
  );

  const columns: ProColumns<License>[] = [
    {
      title: formatMessage({ id: 'pages.license.title.licenseId' }),
      dataIndex: 'license',
      width: 100,
      hideInSearch: true,
      sorter: (a, b) => a.license.localeCompare(b.license),
      defaultSortOrder: 'ascend', // 默认升序排列
    },
    {
      title: formatMessage({ id: 'pages.license.title.type' }),
      dataIndex: 'type',
      width: 200,
      hideInSearch: true,
      sorter: (a, b) => a.type.localeCompare(b.type),
    },
    {
      title: formatMessage({ id: 'pages.license.title.abbreviation' }),
      dataIndex: 'reference',
      hideInSearch: true,
      render: (reference: any) => {
        const ref = reference[localeMap[locale]] || reference.en; // 获取当前语言的引用信息
        return ref ? ref.abbreviation : '-'; // 如果有就显示，否则显示 "-"
      },
    },
    {
      title: formatMessage({ id: 'pages.license.title.fullName' }),
      dataIndex: 'reference',
      hideInSearch: true,
      render: (reference: any) => {
        const ref = reference[localeMap[locale]] || reference.en; // 获取当前语言的引用信息
        return ref ? ref.fullName : '-'; // 如果有就显示，否则显示 "-"
      },
    },
    {
      title: formatMessage({ id: 'pages.license.title.summary' }),
      dataIndex: 'reference',
      hideInSearch: true,
      render: (reference: any) => {
        const ref = reference[localeMap[locale]] || reference.en; // 获取当前语言的引用信息
        return ref ? ref.summary : '-'; // 如果有就显示，否则显示 "-"
      },
    },
    {
      title: formatMessage({ id: 'pages.license.title.usageSuggestion' }),
      dataIndex: 'reference',
      hideInSearch: true,
      render: (reference: any) => {
        const ref = reference[localeMap[locale]] || reference.en; // 获取当前语言的引用信息
        return ref ? ref.usageSuggestion : '-'; // 如果有就显示，否则显示 "-"
      },
    },
    {
      title: formatMessage({ id: 'pages.license.title.url' }),
      dataIndex: 'url',
      width: 300,
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: formatMessage({ id: 'pages.license.title.action' }),
      width: 100,
      fixed: 'right',
      hideInSearch: true,
      render: (_, entity) => {
        return (
          <a onClick={() => history.push(`/helpcenter/license/${entity.license}`)}>
            {formatMessage({ id: 'pages.license.action.detail' })}
          </a>
        );
      },
    },
  ];

  return (
    <Card>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Input
            placeholder={formatMessage({ id: 'pages.license.title.filterById' })}
            value={filterId}
            onChange={e => setFilterId(e.target.value)}
          />
        </Col>
        <Col span={6}>
          <Select
            placeholder={formatMessage({ id: 'pages.license.title.filterByType' })}
            value={filterType}
            onChange={setFilterType}
            allowClear
            style={{ width: '100%' }}
          >
            {/* 假设可选择的类型 */}
            {[...new Set(dataSource.map(item => item.type))].map(type => (
              <Option key={type} value={type}>{type}</Option>
            ))}
          </Select>
        </Col>
      </Row>

      <ProTable<License>
        headerTitle={formatMessage({ id: 'pages.license.title.licenseList' })}
        search={{ defaultCollapsed: false, optionRender: false, labelWidth: 120 }}
        rowKey="license"
        size="small"
        options={{
          density: false,
          fullScreen: false,
          reload: () => {
            setLoading(true);
            getLicenses();
          },
        }}
        loading={loading}
        dataSource={filteredData} // 直接使用过滤后的数据源
        pagination={{
          pageSize: 10,
          showQuickJumper: true,
        }}
        columns={columns}
        scroll={{ x: 800 }} // 适应更多列
        bordered
      />
    </Card>
  );
};

export default LicenseListPage;
