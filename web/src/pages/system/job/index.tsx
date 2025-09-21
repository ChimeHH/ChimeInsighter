import React, { useEffect, useState } from 'react';  
import { DeleteOutlined, DeleteFilled, CopyOutlined } from '@ant-design/icons';  
import { Card, message, Row, Col, Select, Button, Switch, Input, Modal } from 'antd';  
import { useIntl } from 'umi';  
import ProTable, { ActionType } from '@ant-design/pro-table';  
import type { ProColumns } from '@ant-design/pro-table';  
import { getActiveJobList, removeActiveJobs } from './service';  
import BlacklistModal from './BlacklistModal';  

const { Option } = Select;  
const DEFAULT_REFRESH_INTERVAL = 5; 

const JobListPage: React.FC = () => {  
  const { formatMessage } = useIntl();  
  const [dataSource, setDataSource] = useState<any[]>([]);  
  const [loading, setLoading] = useState<boolean>(false);  
  const [selectedJobIds, setSelectedJobIds] = useState<React.Key[]>([]);  
  const [modalVisible, setModalVisible] = useState<boolean>(false);  
  const [isAutoRefresh, setIsAutoRefresh] = useState<boolean>(false);  
  const [refreshInterval, setRefreshInterval] = useState<number>(DEFAULT_REFRESH_INTERVAL);  
  const [filterVersionId, setFilterVersionId] = useState<string | undefined>(undefined);  
  const [filterPipelineId, setFilterPipelineId] = useState<string | undefined>(undefined);  
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);  

  const [versionOptions, setVersionOptions] = useState<string[]>([]);  
  const [pipelineOptions, setPipelineOptions] = useState<string[]>([]);  
  const [statusOptions, setStatusOptions] = useState<string[]>([]);  

  const getJobs = async () => {  
    setLoading(true);
    const hide = message.loading(formatMessage({ id: 'pages.job.message.loading' }), 0);
    try {
      const res = await getActiveJobList();  
      if (res && res.data) {  
        hide();
        setLoading(false);

        const jobsArray = Object.entries(res.data.jobs).map(([jobId, job]) => ({  
          job_id: jobId,  
          process_id: job.process_id,  
          pipeline_id: job.pipeline_id,  
          version_id: job.version_id,  
          checksum: job.checksum,  
          filepath: job.filepath,  
          create_time: job.create_time,  
          start_time: job.start_time,  
          update_time: job.update_time,  
          status: job.status,  
          reason: job.reason,  
          command: job.command,  
        }));  

        setDataSource(jobsArray);  

        const versions = [...new Set(jobsArray.map(job => job.version_id))];  
        const pipelines = [...new Set(jobsArray.map(job => job.pipeline_id))];  
        const statuses = [...new Set(jobsArray.map(job => job.status))];  

        setVersionOptions(versions);  
        setPipelineOptions(pipelines);  
        setStatusOptions(statuses);  
      }  else {
        hide();
        setLoading(false);
      }
      
      setLoading(false);  
    } catch (error) {
      hide(); // 隐藏加载提示      
      setLoading(false);
    }
  };  

  useEffect(() => {  
    getJobs();  

    let interval: NodeJS.Timeout | null = null;  
    if (isAutoRefresh) {  
      interval = setInterval(() => {  
        getJobs();  
      }, refreshInterval * 1000);  
    }  

    return () => {  
      if (interval) {  
        clearInterval(interval);  
      }  
    };  
  }, [isAutoRefresh, refreshInterval]);  

  const handleVersionChange = (value: string | undefined) => {  
    setFilterVersionId(value);  
  };  

  const handlePipelineChange = (value: string | undefined) => {  
    setFilterPipelineId(value);  
  };  

  const handleStatusChange = (value: string | undefined) => {  
    setFilterStatus(value);  
  };  

  const handleResetFilters = () => {  
    setFilterVersionId(undefined);  
    setFilterPipelineId(undefined);  
    setFilterStatus(undefined);  
    setSelectedJobIds([]);  // 清空选中的作业 ID
  };  

  const filteredData = dataSource.filter((item: any) => {  
    return (  
      (filterVersionId ? item.version_id === filterVersionId : true) &&  
      (filterPipelineId ? item.pipeline_id === filterPipelineId : true) &&  
      (filterStatus ? item.status === filterStatus : true)  
    );  
  });  

  const handleDeleteJobs = () => {  
    Modal.confirm({  
      title: formatMessage({ id: 'pages.job.delete.confirm.title' }),  
      content: formatMessage({ id: 'pages.job.delete.confirm.content' }),  
      onOk: async () => {  
        try {  
          await removeActiveJobs(selectedJobIds);  
          message.success(formatMessage({ id: 'pages.job.delete.success' }));  
          setSelectedJobIds([]);  
          getJobs();  
        } catch (error) {  
          message.error(formatMessage({ id: 'pages.job.delete.error' }));  
        }  
      },  
    });  
  };  

  const handleDeleteAllJobs = () => {
    const allJobIds = filteredData.map(job => job.job_id);
    if (allJobIds.length === 0) return;
  
    Modal.confirm({
      title: formatMessage({ id: 'pages.job.delete.confirm.title' }),
      content: formatMessage({ id: 'pages.job.delete.all.confirm.content' }),
      onOk: async () => {
        try {
          // 每次请求的数量
          const batchSize = 100;
          for (let i = 0; i < allJobIds.length; i += batchSize) {
            const batchJobIds = allJobIds.slice(i, i + batchSize); // 获取当前的100个任务ID
            await removeActiveJobs(batchJobIds); // 删除当前批次的任务
          }
          
          message.success(formatMessage({ id: 'pages.job.delete.success' }));
          setSelectedJobIds([]);
          getJobs();
        } catch (error) {
          message.error(formatMessage({ id: 'pages.job.delete.error' }));
        }
      },
    });
  };
  

  const getAllJobIds = () => {  
    return filteredData.map(job => job.job_id);  
  };  

  const handleSelectAllChange = (selected: boolean) => {  
    if (selected) {  
      const allIds = getAllJobIds();  
      setSelectedJobIds(allIds);  
    } else {  
      const currentSelectedIds = filteredData  
        .filter(item => selectedJobIds.includes(item.job_id))  
        .map(item => item.job_id);  
      setSelectedJobIds(currentSelectedIds);  
    }  
  };  

  const copyToClipboard = () => {
    const jsonData = JSON.stringify(filteredData, null, 2); // 格式化为JSON字符串
    navigator.clipboard.writeText(jsonData).catch((err) => {
      console.error('Could not copy text: ', err);
    });
  };

  const columns: ProColumns<any>[] = [  
    {  
      title: formatMessage({ id: 'pages.job.title.jobId' }),  
      dataIndex: 'job_id',  
      width: 150,  
      hideInTable: true,  
      hideInSearch: true,  
      sorter: (a, b) => a.job_id.localeCompare(b.job_id),  
    },  
    {  
      title: formatMessage({ id: 'pages.job.title.versionId' }),  
      dataIndex: 'version_id',  
      width: 100,  
      hideInSearch: true,  
      sorter: (a, b) => a.version_id.localeCompare(b.version_id),  
      render: (text: any) => (  
        <a onClick={() => setModalVisible(true)}>{text}</a>  
      ),  
    },  
    {  
      title: formatMessage({ id: 'pages.job.title.checksum' }),  
      dataIndex: 'checksum',  
      width: 200,  
      ellipsis: true,  
      hideInTable: true,  
      hideInSearch: true,  
      sorter: (a, b) => (a?.checksum || '').localeCompare(b?.checksum || ''),  
    },  
    {  
      title: formatMessage({ id: 'pages.job.title.pipelineId' }),  
      dataIndex: 'pipeline_id',  
      width: 60,  
      hideInSearch: true,  
      render: (text: any, entry: any) => entry?.pipeline_id || '',  
    },  
    {  
      title: formatMessage({ id: 'pages.job.title.processId' }),  
      dataIndex: 'process_id',  
      width: 60,  
      hideInSearch: true,  
      render: (text: any, entry: any) => entry?.process_id || '',  
    },  
    {  
      title: formatMessage({ id: 'pages.job.title.status' }),  
      dataIndex: 'status',  
      width: 80,  
      hideInSearch: true,  
      render: (text: any, entry: any) => entry?.status || '',  
    },  
    {  
      title: formatMessage({ id: 'pages.job.title.filepath' }),  
      dataIndex: 'filepath',  
      width: 200,  
      ellipsis: true,  
      hideInSearch: true,  
      render: (text: any, entry: any) => {  
        const filepath = entry?.filepath || '';  
        const displayFilepath = filepath.length > 24 ? `...${filepath.slice(-24)}` : filepath; // 仅在显示时处理路径
        return displayFilepath;  
      },  
    },  
    {  
      title: formatMessage({ id: 'pages.job.title.command' }),  
      dataIndex: 'command',  
      width: 200,  
      ellipsis: true,  
      hideInSearch: true,  
      render: (text: any, entry: any) => entry?.command || '',  
    },  
    {  
      title: formatMessage({ id: 'pages.job.title.reason' }),  
      dataIndex: 'reason',  
      width: 200,  
      ellipsis: true,  
      hideInSearch: true,  
      render: (text: any, entry: any) => entry?.reason || '',  
    },  
    {  
      title: formatMessage({ id: 'pages.job.title.startTime' }),  
      dataIndex: 'start_time',  
      width: 120,  
      hideInSearch: true,  
      render: (text: any) => {  
        const date = new Date(text);  
        return text && !isNaN(date.getTime()) ? 
          new Date(date.getTime() - date.getTimezoneOffset() * 60000).toLocaleString() : '';  
      },  
    }, 
    {  
      title: formatMessage({ id: 'pages.job.title.updateTime' }),  
      dataIndex: 'update_time',  
      width: 120,  
      hideInSearch: true,  
      render: (text: any) => {  
        const date = new Date(text);  
        return text && !isNaN(date.getTime()) ? 
          new Date(date.getTime() - date.getTimezoneOffset() * 60000).toLocaleString() : '';  
      },  
    }, 
  ];  

  return (  
    <Card>  
      <Row gutter={16} style={{ marginBottom: 16 }}>  
        <Col span={6}>  
          <Select  
            style={{ width: '100%' }}  
            placeholder={formatMessage({ id: 'pages.job.title.versionId' })}  
            value={filterVersionId}  // 绑定过滤器值
            onChange={handleVersionChange}  
            allowClear  
          >  
            {versionOptions.map(option => (  
              <Option key={option} value={option}>{option}</Option>  
            ))}  
          </Select>  
        </Col>  
        <Col span={6}>  
          <Select  
            style={{ width: '100%' }}  
            placeholder={formatMessage({ id: 'pages.job.title.pipelineId' })}  
            value={filterPipelineId}  // 绑定过滤器值
            onChange={handlePipelineChange}  
            allowClear  
          >  
            {pipelineOptions.map(option => (  
              <Option key={option} value={option}>{option}</Option>  
            ))}  
          </Select>  
        </Col>  
        <Col span={6}>  
          <Select  
            style={{ width: '100%' }}  
            placeholder={formatMessage({ id: 'pages.job.title.status' })}  
            value={filterStatus}  // 绑定过滤器值
            onChange={handleStatusChange}  
            allowClear  
          >  
            {statusOptions.map(option => (  
              <Option key={option} value={option}>{option}</Option>  
            ))}  
          </Select>  
        </Col>  
        <Col span={6}>  
          <Button onClick={handleResetFilters}>  
            {formatMessage({ id: 'pages.job.resetFilters' })}  
          </Button>  
          <Button  
            type="primary"  
            onClick={() => {  
              if (filterVersionId) {  
                setModalVisible(true);  
              } else {  
                message.warning(formatMessage({ id: 'pages.job.selectVersionIdWarning' }));  
              }  
            }}  
            style={{ marginLeft: 8 }}  
            disabled={!filterVersionId}  
          >  
            {formatMessage({ id: 'pages.job.blacklistManagement' })}  
          </Button>  
        </Col>  
      </Row>  
      <ProTable<any>  
        headerTitle={formatMessage({ id: 'pages.job.title.jobList' })}  
        search={{ defaultCollapsed: false, optionRender: false, labelWidth: 120 }}  
        rowKey="job_id"  
        size="small"  
        rowSelection={{  
          selectedRowKeys: selectedJobIds,  
          onChange: (selectedRowKeys: React.Key[]) => {  
            setSelectedJobIds(selectedRowKeys);  
          },  
          onSelectAll: (selected: boolean) => {  
            handleSelectAllChange(selected);  
          }  
        }}  
        options={{  
          density: false,  
          fullScreen: false,  
          reload: () => {  
            setLoading(true);  
            getJobs();  
          },  
        }}  
        loading={loading}  
        dataSource={filteredData}  
        pagination={{  
          pageSize: 10,  
          showQuickJumper: true,  
        }}  
        columns={columns}  
        scroll={{ x: 800 }}  
        bordered  
        toolBarRender={() => [  
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>  
            <span style={{ marginRight: 8 }}>{formatMessage({ id: 'pages.autoRefresh' })}:</span>  
            <Switch  
              checked={isAutoRefresh}  
              onChange={(checked) => setIsAutoRefresh(checked)}  
              style={{ marginRight: 8 }}  
            />  
            <Input  
              type="text"  
              value={isAutoRefresh ? refreshInterval : ''}  
              onChange={(e) => {  
                const value = e.target.value;  
                if (!isNaN(value) && value > 0) {  
                  setRefreshInterval(Number(value));  
                }  
              }}  
              disabled={!isAutoRefresh}  
              style={{ width: 100, marginRight: 8 }}  
              placeholder={DEFAULT_REFRESH_INTERVAL.toString()}  
            />  
            <Button type="primary" onClick={handleDeleteJobs} disabled={selectedJobIds.length === 0}>  
              <DeleteOutlined /> 
            </Button>  
            <Button type="danger" onClick={handleDeleteAllJobs} disabled={filteredData.length === 0 || !filterVersionId && !filterPipelineId && !filterStatus}>  
              <DeleteFilled />  
            </Button>  
            <Button icon={<CopyOutlined />} onClick={copyToClipboard} style={{ marginLeft: 8 }} />
          </div>,  
        ]}  
      />  
      {modalVisible && (  
        <BlacklistModal  
          visible={modalVisible}  
          onClose={() => setModalVisible(false)}  
          filterVersionId={filterVersionId}  // 确保传递正确的 filterVersionId
        />  
      )} 
      {console.log('Filter Version ID:', filterVersionId)} 
    </Card>  
  );  
};  

export default JobListPage;  
