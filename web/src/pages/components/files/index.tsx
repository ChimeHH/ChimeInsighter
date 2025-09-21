import React, { useEffect, useState } from 'react';
import { Table, Select, Button, Modal, Checkbox, Card, Tooltip } from 'antd';
import { ReloadOutlined, SettingOutlined } from '@ant-design/icons';
import { useParams, useIntl } from 'umi';
import { getFiles } from './service';
import type { FileInfo } from './data';
import type { Version } from '../version/data';

const { Option } = Select;

const Files = () => {
  const { vid: version_id } = useParams<{ vid: string }>();
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [version, setVersion] = useState<Version | null>(null);
  const [loading, setLoading] = useState(false);
  
  // 修改1: 将 fileTypeFilter 和 labelFilter 更新为数组
  const [fileTypeFilter, setFileTypeFilter] = useState<string[]>([]);
  const [labelFilter, setLabelFilter] = useState<string[]>([]);
  
  const [fileTypes, setFileTypes] = useState<string[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [visible, setVisible] = useState(false);
  
  const { formatMessage } = useIntl();

  const columns = [
    {
      title: formatMessage({ id: 'pages.files.fileId' }),
      dataIndex: '_id',
      key: '_id',
      visible: false,
    },
    {
      title: formatMessage({ id: 'pages.files.filepath' }),
      dataIndex: 'filepath',
      key: 'filepath',
      visible: true,
    },
    {
      title: formatMessage({ id: 'pages.files.filetype' }),
      dataIndex: 'filetype',
      key: 'filetype',
      visible: true,
      render: (filetype: string) => {
        const displayType = filetype || formatMessage({ id: 'pages.files.unknown' });
        const isInvalid = !filetype || filetype === 'n/a'; // 判断条件
        return (
          <span style={{ color: isInvalid ? 'lightgray' : 'inherit' }}>
            {displayType}
          </span>
        );
      },
    },
    {
      title: formatMessage({ id: 'pages.files.labels' }),
      dataIndex: 'labels',
      key: 'labels',
      visible: true,
      render: (labels: string[]) => labels.join(', '),
    },
    {
      title: formatMessage({ id: 'pages.files.size' }),
      dataIndex: 'size',
      key: 'size',
      visible: true,
      render: (size: number) => `${size} bytes`,
    },    
    {
      title: formatMessage({ id: 'pages.files.oss_percent' }),
      dataIndex: 'oss_percent',
      key: 'oss_percent',
      visible: true,
      render: (oss_percent: number) => {
        if (oss_percent === null || oss_percent === undefined) {
          return '';
        }
        const percentValue = (oss_percent * 100).toFixed(1);
        
        return (
          <span style={{ color: oss_percent > 0 ? 'blue' : 'inherit' }}>
            {percentValue}%
          </span>
        );
      },
    },
    {
      title: formatMessage({ id: 'pages.files.checksum' }),
      dataIndex: 'checksum',
      key: 'checksum',
      visible: false,
    },   
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = { version_id };
      const result = await getFiles(params);
      const processedFiles = result.data.files.map(file => ({
        ...file,
        filetype: file.filetype || 'n/a',
      }));
      setFiles(processedFiles);
      setVersion(result.data.version);
      const types = Array.from(new Set(processedFiles.map(file => file.filetype)));
      setFileTypes(types);
      const labelsSet = new Set<string>();
      processedFiles.forEach(file => file.labels.forEach(label => labelsSet.add(label)));
      setLabels(Array.from(labelsSet));
    } catch (error) {
      console.error('Failed to fetch files:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [version_id]);

  // 修改2: 处理文件类型变化，参数更改为数组
  const handleFileTypeChange = (values: string[]) => {
    setFileTypeFilter(values);
  };

  // 修改3: 处理标签变化，参数更改为数组
  const handleLabelChange = (values: string[]) => {
    setLabelFilter(values);
  };

  const filteredFiles = files.filter(file => {
    // 修改4: 更新过滤逻辑以支持多个选择
    const fileTypeMatch = fileTypeFilter.length === 0 || fileTypeFilter.includes(file.filetype);
    const labelMatch = labelFilter.length === 0 || file.labels.some(label => labelFilter.includes(label));
    return fileTypeMatch && labelMatch;
  });

  const visibleColumns = columns.filter(column => column.visible);

  return (
    <Card title={formatMessage({ id: 'pages.files.title' })}>
      {version && <p>{formatMessage({ id: 'pages.files.version' })}: {version.name}</p>}
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: 16 }}>{formatMessage({ id: 'pages.files.filetype' })}: </span>
        {/* 修改5: 多选 Select 组件 */}
        <Select mode="multiple" defaultValue={[]} style={{ width: 320, marginRight: 16 }} onChange={handleFileTypeChange}>
          <Option value="">{formatMessage({ id: 'pages.files.all' })}</Option>
          {fileTypes.map(type => (
            <Option key={type} value={type}>
              {type}
            </Option>
          ))}
        </Select>
        <span style={{ marginRight: 16 }}>{formatMessage({ id: 'pages.files.labels' })}: </span>
        {/* 修改6: 多选 Select 组件 */}
        <Select mode="multiple" defaultValue={[]} style={{ width: 320 }} onChange={handleLabelChange}>
          <Option value="">{formatMessage({ id: 'pages.files.all' })}</Option>
          {labels.map(label => (
            <Option key={label} value={label}>
              {label}
            </Option>
          ))}
        </Select>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <Tooltip title={formatMessage({ id: 'pages.files.refresh' })}>
          <Button icon={<ReloadOutlined />} onClick={fetchData} style={{ marginRight: 8 }} />
        </Tooltip>
        <Tooltip title={formatMessage({ id: 'pages.files.settings' })}>
          <Button icon={<SettingOutlined />} onClick={() => setVisible(true)} />
        </Tooltip>
      </div>
      <Table columns={visibleColumns} dataSource={filteredFiles} rowKey="_id" loading={loading} />
      <Modal
        title={formatMessage({ id: 'pages.files.settings' })}
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
      >
        {columns.map(column => (
          <div key={column.key} style={{ marginBottom: 8 }}>
            <Checkbox
              checked={column.visible}
              onChange={() => handleColumnChange(column.key)}
            >
              {column.title}
            </Checkbox>
          </div>
        ))}
      </Modal>
    </Card>
  );
};

export default Files;
