import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Select, Tag, Tooltip } from 'antd';
import type { DefaultOptionType } from 'antd/lib/select';
import { useEffect, useRef, useState } from 'react';
import { useParams, history, useIntl } from 'umi';
import type { Version } from '../version/data';
import { getPackagesList } from './service';

const colorsMap = {
  1: '#b7c5c7',
  2: '#fd9e38',
  3: '#f56767',
  4: '#e50100',
};

const baseMessageId = 'pages.table';

const PackagesTable: React.FC = () => {
  const { vid: version_id } = useParams<{ vid: string; name: string }>();
  const [version, setVersion] = useState<Version>();
  const [dataSource, setDataSource] = useState<PackageInfo[]>([]);
  const tags = useRef<Tag[]>();
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState<Partial<{
    checksums: DefaultOptionType[];
    fullnames: DefaultOptionType[];
    versions: DefaultOptionType[];
    licenses: DefaultOptionType[];
    filenames: DefaultOptionType[];
  }>>({});
  const [filters, setFilters] = useState<Partial<{
    checksums: string[];
    fullnames: string[];
    versions: string[];
    licenses: string[];
    filenames: string[];
  }>>({});
  const { formatMessage } = useIntl();

  const [filterOption, setFilterOption] = useState<string>('all'); // 新增的状态管理过滤选项

  const getPackages = async () => {
    const res = await getPackagesList({
      version_id,
    });
    const packages = res?.data?.packages;
    if (Array.isArray(packages)) {
      setDataSource(packages);
      tags.current = res.data?.tags;
    }

    setVersion(res?.data?.version);
    setLoading(false);
  };

  const setFilter = (params: Partial<{
    checksum: string[];
    fullname: string[];
    version: string[];
    licenses: string[];
    
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
    const isChecksums =
      filters.checksums?.length === 0 || (filters.checksums?.includes(item.checksum) ?? true);
    const isFullnames =
      filters.fullnames?.length === 0 || (filters.fullnames?.includes(item.fullname) ?? true);
    const isVersions =
      filters.versions?.length === 0 || (filters.versions?.includes(item.version) ?? true);
    const isLicenses =
      filters.licenses?.length === 0 || (filters.licenses?.every(license => item.licenses?.includes(license)) ?? true);
    const isFilenames =
      filters.filenames?.length === 0 || (filters.filenames?.some(filename => item.filepath?.some(filepath => filepath.split('/').pop() === filename)) ?? true);
  
    return isChecksums && isFullnames && isVersions && isLicenses && isFilenames;
  });
  

  const columns: ProColumns<PackageInfo>[] = [  
    {
      title: formatMessage({ id: `${baseMessageId}.title.uid` }),
      width: 100,
      dataIndex: 'uid',
      hideInSearch: true,
      hideInTable: true,
      sorter: (a, b) => (a.uid).localeCompare(b.uid),
    }, 
    {
      title: formatMessage({ id: 'pages.packages.fullname' }),
      dataIndex: 'fullname',
      key: 'fullname',
      ellipsis: true,
      width: 200,
      renderFormItem: () => (
        <Select
          mode="multiple"
          allowClear={true}
          showArrow={true}
          filterOption={true}
          options={searchParams.fullnames}
          onChange={(value) => setFilter({ fullnames: value })}
          placeholder={formatMessage({ id: 'pages.packages.fullname' })}
        />
      ),
    },
    {
      title: formatMessage({ id: 'pages.packages.version' }),
      dataIndex: 'version',
      key: 'version',
      ellipsis: true,
      width: 120,
      renderFormItem: () => (
        <Select
          mode="multiple"
          allowClear={true}
          showArrow={true}
          filterOption={true}
          options={searchParams.versions}
          onChange={(value) => setFilter({ versions: value })}
          placeholder={formatMessage({ id: 'pages.packages.version' })}
        />
      ),
    },
    {
      title: formatMessage({ id: 'pages.packages.licenses' }),
      dataIndex: 'licenses',
      key: 'licenses',
      ellipsis: true,
      width: 200,
      render: (_, entity) => {
        if (!entity.licenses) {
          console.log("entity::", entity);
          return formatMessage({ id: 'pages.packages.none' });
        }
        return entity.licenses.map((license, index) => (
          <div key={index}>
            {index + 1}. {license === "Other" ? (
              <span>{license}</span>
            ) : (
              <a onClick={() => history.push(`/helpcenter/license/${license}`)}>
                {license}
              </a>
            )}
          </div>
        ));
      },
      renderFormItem: () => (
        <Select
          mode="multiple"
          allowClear={true}
          showArrow={true}
          filterOption={true}
          options={searchParams.licenses}
          onChange={(value) => setFilter({ licenses: value })}
          placeholder={formatMessage({ id: 'pages.packages.licenses' })}
        />
      ),
    }, 
    {
      title: formatMessage({ id: 'pages.packages.scale' }),
      dataIndex: 'scale',
      key: 'scale',
      width: 100,
      hideInSearch: true,
      render: (value) => {
        return typeof value === 'number' ? `${(value * 100).toFixed(1)}%` : '';
      },
    },
    {
      title: formatMessage({ id: 'pages.packages.integrity' }),
      dataIndex: 'integrity',
      key: 'integrity',
      width: 100,
      hideInSearch: true,
      render: (value) => {
        return typeof value === 'number' ? `${(value * 100).toFixed(1)}%` : '';
      },
    },
    {
      title: formatMessage({ id: 'pages.packages.clone' }),
      dataIndex: 'clone',
      key: 'clone',
      width: 100,
      hideInSearch: true,
    },
    {
      title: formatMessage({ id: 'pages.packages.releasedatetime' }),
      dataIndex: 'release_time',
      key: 'release_time',
      width: 150,
      hideInSearch: true,
      render: (release_time: string | null) => release_time || formatMessage({ id: 'pages.packages.none' }),
    },
    {
      title: formatMessage({ id: 'pages.packages.checksum' }),
      dataIndex: 'checksum',
      key: 'checksum',
      ellipsis: true,
      width: 200,
      hideInSearch: true,
      renderFormItem: () => (
        <Select
          mode="multiple"
          allowClear={true}
          showArrow={true}
          filterOption={true}
          options={searchParams.checksums}
          onChange={(value) => setFilter({ checksums: value })}
          placeholder={formatMessage({ id: 'pages.packages.checksum' })}
        />
      ),
    },
    {
      title: formatMessage({ id: 'pages.packages.filepath' }),
      dataIndex: 'filepath',
      key: 'filepath',
      width: 300,
      hideInSearch: false,
      render: (filepath: string[]) => (
        <Tooltip title={filepath.map((path, index) => `${index + 1}. ${path}`).join('\n')}>
          <pre style={{ 
            whiteSpace: 'nowrap', 
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            margin: 0,
            maxWidth: '300px'
          }}>
            {filepath[0]} {filepath.length > 1 ? `(+${filepath.length - 1} more)` : ''}
          </pre>
        </Tooltip>
      ),
      renderFormItem: () => (
        <Select
          mode="multiple"
          allowClear={true}
          showArrow={true}
          filterOption={true}
          options={searchParams.filenames} // 使用文件名作为过滤选项
          onChange={(value) => setFilter({ filenames: value })} // 设置文件名过滤
          placeholder={formatMessage({ id: 'pages.packages.filepath' })}
        />
      ),
    },
    {
      title: formatMessage({ id: 'pages.packages.downloadurl' }),
      dataIndex: 'downloadurl',
      key: 'downloadurl',
      width: 200,
      hideInSearch: true,
      render: (downloadurl: string | null) => {
        if (downloadurl) {
          return (
            <Tooltip title={downloadurl}>
              <a 
                href={downloadurl} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  maxWidth: '200px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {downloadurl}
              </a>
            </Tooltip>
          );
        } else {
          return formatMessage({ id: 'pages.packages.none' });
        }
      },
      renderFormItem: () => (
        <Select
          mode="multiple"
          allowClear={true}
          showArrow={true}
          filterOption={true}
          options={searchParams.downloadurls} // 这里改为实际的 downloadurl 数据源
          onChange={(value) => setFilter({ downloadurls: value })} // 这里改为实际的 downloadurl 数据源
          placeholder={formatMessage({ id: 'pages.packages.downloadurl' })}
        />
      ),
    },   
    {
      title: formatMessage({ id: `${baseMessageId}.title.action` }),
      width: 60,
      fixed: 'right',
      hideInSearch: true,
      render: (_, entity) => (
        <a onClick={() => history.push(`./${entity.uid}/package`)}>
          {formatMessage({ id: `${baseMessageId}.action.detail` })}
        </a>
      ),
    },
  ];
  
  const initSearchParams = (packages: PackageInfo[]) => {
    const checksums: DefaultOptionType[] = [];
    packages.forEach((record) => {
      const checksum = record.checksum;
      if (checksum && !checksums.find(item => item.value === checksum)) {
        checksums.push({
          label: checksum,
          value: checksum,
        });
      }
    });
    const fullnames: DefaultOptionType[] = [];
    packages.forEach((record) => {
      const fullname = record.fullname;
      if (fullname && !fullnames.find(item => item.value === fullname)) {
        fullnames.push({
          label: fullname,
          value: fullname,
        });
      }
    });
    const versions: DefaultOptionType[] = [];
    packages.forEach((record) => {
      const version = record.version;
      if (version && !versions.find(item => item.value === version)) {
        versions.push({
          label: version,
          value: version,
        });
      }
    });
    const licenses: DefaultOptionType[] = [];
    packages.forEach((record) => {
      const licenseArray = record.licenses;
      if (licenseArray) {
        licenseArray.forEach(license => {
          if (!licenses.find(item => item.value === license)) {
            licenses.push({
              label: license,
              value: license,
            });
          }
        });
      }
    });
  
    const filenames: DefaultOptionType[] = [];
    packages.forEach((record) => { // 这里改为对 packages 数组中每个对象的访问
      const filepathArray = record.filepath;
      if (filepathArray) {
        filepathArray.forEach(filepath => {
          const filename = filepath.split('/').pop(); // 提取文件名
          if (filename && !filenames.find(item => item.value === filename)) {
            filenames.push({
              label: filename,
              value: filename,
            });
          }
        });
      }
    });
  
    setSearchParams({
      checksums,
      fullnames,
      versions,
      licenses,
      filenames,
    });
  };
  
  
  useEffect(() => {
    getPackages();
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
      

      <ProTable<PackageInfo>
        headerTitle={version?.version_name}
        search={{ defaultCollapsed: false, optionRender: false, labelWidth: 120 }}
        rowKey="uid"
        size="small"
        options={{
          density: false,
          fullScreen: false,
          reload: () => {
            setLoading(true);
            getPackages();
          },
        }}
        loading={loading}
        dataSource={filteredDataSource}
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

export default PackagesTable;
