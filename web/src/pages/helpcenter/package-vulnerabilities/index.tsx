import React, { useState, useEffect } from 'react';
import { Card, Row, Col, message, Button, Input, Select } from 'antd';
import { useIntl, history } from 'umi';
import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import { getPackageVulnerabilities } from './service'; // 假设service.ts文件中定义了getPackageVulnerabilities函数

const { Option } = Select;

const PackageVulnerabilitiesPage = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, any>>();
  const [packageName, setPackageName] = useState<string>('');
  const [version, setVersion] = useState<string>('');
  const [vendor, setVendor] = useState<string>('');
  const [filterCveId, setFilterCveId] = useState<string>(''); // 新增状态
  const [filterVersion, setFilterVersion] = useState<string>(''); // 新增状态
  const [cveIdOptions, setCveIdOptions] = useState<string[]>([]); // 新增状态
  const [versionOptions, setVersionOptions] = useState<string[]>([]); // 新增状态
  const { formatMessage } = useIntl();

  useEffect(() => {
    handleGetPackageVulnerabilities(); // 默认进入页面时，取当前包的漏洞列表
  }, []);

  const handleGetPackageVulnerabilities = async (packageName?: string, version?: string, vendor?: string) => {
    if (!packageName) return; // 只有当包名有效时才触发API查询

    setLoading(true);
    const hide = message.loading(formatMessage({ id: 'pages.package.vulnerabilities.message.loading' }), 0);
    const res = await getPackageVulnerabilities(packageName, version, vendor);
    if (res?.data) {
      hide();
      setLoading(false);
      message.success(formatMessage({ id: 'pages.package.vulnerabilities.getList.success' }));

      // 预处理数据
      const processedData = res.data.results.map((item: any) => {
        const newItem = { ...item };
        newItem.id = newItem.cve_id;
        delete newItem.cve_id;

        // 处理 cpe 字段
        const cpe = newItem.cpe;
        const specialKeys = Object.keys(cpe).filter(key => !/^[a-zA-Z]+$/.test(key));
        if (specialKeys.length > 0) {
          newItem.version = specialKeys.map(key => `${key} ${cpe[key]}`).join(', ');
        } else {
          newItem.version = cpe.version;
        }

        return newItem;
      });

      setResult({ ...res.data, vulnerabilities: processedData });

      // 更新过滤框选项，去除重复项
      const cveIds = Array.from(new Set(processedData.map(item => item.id)));
      const versions = Array.from(new Set(processedData.map(item => item.version)));
      setCveIdOptions(cveIds);
      setVersionOptions(versions);

      return;
    }

    hide();
    setLoading(false);
  };

  const handlePackageNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPackageName(e.target.value);
  };

  const handleVersionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVersion(e.target.value);
  };

  const handleVendorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVendor(e.target.value);
  };

  const handleSearch = () => {
    handleGetPackageVulnerabilities(packageName, version, vendor);
    setFilterCveId(''); // 清空过滤框内容
    setFilterVersion(''); // 清空过滤框内容
  };

  const handleCveIdFilterChange = (value: string) => {
    setFilterCveId(value);
  };

  const handleVersionFilterChange = (value: string) => {
    setFilterVersion(value);
  };

  const filteredData = result?.vulnerabilities?.filter((item: any) =>
    item.id.toString().includes(filterCveId) && item.version.toString().includes(filterVersion)
  ) || [];

  const columns: ProColumns<any>[] = [
    {
      title: formatMessage({ id: 'pages.package.vulnerabilities.id' }),
      dataIndex: 'id',
      key: 'id',
      width: 100,
      hideInSearch: true,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: formatMessage({ id: 'pages.package.vulnerabilities.description' }),
      dataIndex: 'description',
      key: 'description',
      width: 300, // 增加宽度以显示更多内容
      hideInSearch: true,
      ellipsis: true,
      sorter: (a, b) => a.description.localeCompare(b.description),
    },
    {
      title: formatMessage({ id: 'pages.package.vulnerabilities.product' }),
      dataIndex: ['cpe', 'product'],
      key: 'product',
      width: 120, // 稍微宽些
      hideInSearch: true,
    },
    {
      title: formatMessage({ id: 'pages.package.vulnerabilities.version' }),
      dataIndex: 'version',
      key: 'version',
      width: 80, // 缩小宽度
      hideInSearch: true,
    },
    {
      title: formatMessage({ id: 'pages.package.vulnerabilities.vendor' }),
      dataIndex: ['cpe', 'vendor'],
      key: 'vendor',
      width: 80, // 缩小宽度
      hideInSearch: true,
    },
    {
      title: formatMessage({ id: 'pages.package.vulnerabilities.actions' }),
      key: 'action',
      width: 100,
      fixed: 'right',
      hideInSearch: true,
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => history.push(`/helpcenter/vulnerability/${record.id}`)}
        >
          {formatMessage({ id: 'pages.package.vulnerabilities.viewDetail' })}
        </Button>
      ),
    },
  ];

  return (
    <Card>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={24}>
          <h3>{formatMessage({ id: 'pages.package.vulnerabilities.title' })}</h3>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Select
            mode="combobox"
            style={{ width: '100%' }}
            placeholder={formatMessage({ id: 'pages.package.vulnerabilities.searchCveIdPlaceholder' })}
            value={filterCveId}
            onChange={handleCveIdFilterChange}
            showSearch
            filterOption={(input, option) =>
              option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            <Option value="">{""}</Option>
            {cveIdOptions.map(cveId => (
              <Option key={cveId} value={cveId}>
                {cveId}
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={6}>
          <Select
            mode="combobox"
            style={{ width: '100%' }}
            placeholder={formatMessage({ id: 'pages.package.vulnerabilities.searchVersionPlaceholder' })}
            value={filterVersion}
            onChange={handleVersionFilterChange}
            showSearch
            filterOption={(input, option) =>
              option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            <Option value="">{""}</Option>
            {versionOptions.map(version => (
              <Option key={version} value={version}>
                {version}
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={12} style={{ textAlign: 'right' }}>
          <Input
            style={{ width: '20%', marginRight: 8 }}
            placeholder={formatMessage({ id: 'pages.package.vulnerabilities.packageNamePlaceholder' })}
            value={packageName}
            onChange={handlePackageNameChange}
          />
          <Input
            style={{ width: '20%', marginRight: 8 }}
            placeholder={formatMessage({ id: 'pages.package.vulnerabilities.versionPlaceholder' })}
            value={version}
            onChange={handleVersionChange}
          />
          <Input
            style={{ width: '20%', marginRight: 8 }}
            placeholder={formatMessage({ id: 'pages.package.vulnerabilities.vendorPlaceholder' })}
            value={vendor}
            onChange={handleVendorChange}
          />
          <Button type="primary" onClick={handleSearch}>
            {formatMessage({ id: 'pages.package.vulnerabilities.search' })}
          </Button>
        </Col>
      </Row>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ flex: 1, marginRight: 24, minHeight: 400 }}>
          <Card>
            <ProTable<any>
              headerTitle={formatMessage({ id: 'pages.package.vulnerabilities.title' })}
              search={{ defaultCollapsed: false, optionRender: false, labelWidth: 120 }}
              rowKey="id"
              size="small"
              options={{
                density: false,
                fullScreen: false,
                reload: () => {
                  setLoading(true);
                  handleGetPackageVulnerabilities();
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
        </div>
      </div>
    </Card>
  );
};

export default PackageVulnerabilitiesPage;
