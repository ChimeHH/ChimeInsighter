import { monitorEventReasons } from '@/utils/constant';
import React, { useEffect, useState } from 'react';
import { Card, message, Row, Col, DatePicker, Button, Tooltip, Select } from 'antd'; 
import { useIntl, history } from 'umi';
import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import { getMonitorEvents } from './service'; 
import { MonitorEventsResponse, Event } from './data'; 
import moment from 'moment'; 

const { Option } = Select; 

const MAX_DATE_RANGE_MONTHS = 12;

const UpdatedEventsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<Event[]>([]);
  const [startDate, setStartDate] = useState<moment.Moment | null>(moment().subtract(MAX_DATE_RANGE_MONTHS, 'months').add(1, 'days')); 
  const [endDate, setEndDate] = useState<moment.Moment | null>(moment()); 
  const [filterProduct, setFilterProduct] = useState<string>(''); 
  const [filterReason, setFilterReason] = useState<string>(''); // 新增状态
  const { formatMessage } = useIntl();

  const getEvents = async (fromDatetime: string, toDatetime: string) => {
    setLoading(true);
    const hide = message.loading(formatMessage({ id: 'pages.event.message.loading' }), 0);
    
    const res = await getMonitorEvents(fromDatetime, toDatetime);
    
    if (res?.data?.events) {
        hide();
        setLoading(false);
        message.success(formatMessage({ id: 'pages.event.getList.success' }));
        setDataSource(res.data.events);
        
        return;
    }
    
    hide();
    setLoading(false);
  };

  const validateDateRange = () => {
    if (startDate && endDate) {
      const maxDate = startDate.clone().add(MAX_DATE_RANGE_MONTHS, 'months');
      return endDate.isBefore(startDate) || endDate.isAfter(maxDate);
    }
    return false;
  };

  const filteredData = dataSource.filter((item: Event) =>
    (!filterProduct || item.component.product.includes(filterProduct)) &&
    (!filterReason || item.reason.includes(filterReason)) // 新增过滤条件
  );

  const columns: ProColumns<Event>[] = [
    {
      title: formatMessage({ id: 'pages.event.title.cveId' }),
      dataIndex: 'cve_id',
      width: 200,
      hideInSearch: true,
      render: (text, record) => (
        <Button
          type="link"
          onClick={() => history.push(`/helpcenter/vulnerability/${record.cve_id}`)}
        >
          {record.cve_id}
        </Button>
      ),
    },
    
    {
      title: formatMessage({ id: 'pages.event.title.product' }),
      dataIndex: 'component',
      width: 200,
      hideInSearch: true,
      render: (component) => component.product,
    },
    {
      title: formatMessage({ id: 'pages.event.title.vendor' }),
      dataIndex: 'component',
      width: 200,
      hideInSearch: true,
      render: (component) => component.vendor,
    },
    {
      title: formatMessage({ id: 'pages.event.title.version' }),
      dataIndex: 'component',
      width: 200,
      hideInSearch: true,
      render: (component) => component.version,
    },
    {
      title: formatMessage({ id: 'pages.event.title.description' }),
      dataIndex: 'description',
      width: 300,
      hideInSearch: true,
    },
    {
      title: formatMessage({ id: 'pages.event.title.lastModified' }),
      dataIndex: 'last_modified_date',
      width: 200,
      hideInSearch: true,
    },    
    {
      title: formatMessage({ id: 'pages.event.title.exploitId' }),
      dataIndex: 'exploits',
      width: 200,
      hideInSearch: true,
      render: (exploits) => (
          <>
              {Object.keys(exploits).map(exploitId => (
                  <div key={exploitId}>
                      <a 
                          onClick={() => history.push(`/exploit/${exploitId}`)} // 跳转到指定路径
                          style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                      >
                          {exploitId}
                      </a>
                  </div>
              ))}
          </>
      ),
    },
  
    {
      title: formatMessage({ id: 'pages.event.title.reason' }),
      dataIndex: 'reason',
      width: 200,
      hideInSearch: true,
      render: (reason) => formatMessage({ id: `pages.monitorEventReasons.${reason}` }) || reason, // 国际化处理
    },
  ];

  return (
    <Card>
      <Row gutter={0} style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Col span={6} style={{ padding: 0 }}>  {/* 适当调整宽度 */}
          <Select
            style={{ width: '100%' }}
            placeholder="Product"
            value={filterProduct}
            onChange={value => setFilterProduct(value)}
          >
            <Option value=""> </Option> 
            {Array.from(new Set(dataSource.map(event => event.component.product))) // 产品去重
              .map(product => (
                <Option key={product} value={product}>{product}</Option>
              ))}
          </Select>
        </Col>
        <Col span={6} style={{ padding: 0 }}> 
          <Select
            style={{ width: '100%' }}
            placeholder="Reason"
            value={filterReason} // 新增 filterReason 状态
            onChange={value => setFilterReason(value)} // 新设置状态的函数
          >
            <Option value=""> </Option> 
            {Array.from(new Set(dataSource.map(event => event.reason))) // 理由去重
              .map(reason => (
                <Option key={reason} value={reason}>
                  {formatMessage({ id: `pages.monitorEventReasons.${reason}` }) || reason}
                </Option>
              ))}
          </Select>
        </Col>

        <Col style={{ marginLeft: 'auto', padding: 0, display: 'flex', alignItems: 'center' }}>
          <DatePicker
            format="YYYY-MM-DD"
            value={startDate}
            onChange={date => setStartDate(date)}
            style={{ width: '200px', marginRight: '8px' }} // 控制日期选择框右侧间距
            allowClear
            placeholder="选择开始日期"
          />
          <span style={{ lineHeight: '32px', margin: '0 8px' }}>--</span>
          <DatePicker
            format="YYYY-MM-DD"
            value={endDate}
            onChange={date => setEndDate(date)}
            style={{ width: '200px', marginRight: '8px' }} // 控制日期选择框右侧间距
            allowClear
            placeholder="选择结束日期"
          />
          <Tooltip title={`查询时间段超过 ${MAX_DATE_RANGE_MONTHS} 个月`} visible={validateDateRange()}>
            <span>
              <Button 
                type="primary" 
                onClick={() => {
                  if (startDate && endDate) {
                    const fromDate = startDate.format('YYYY-MM-DD');
                    const toDate = endDate.format('YYYY-MM-DD');
                    getEvents(fromDate, toDate);
                  }
                }} 
                disabled={validateDateRange()} 
                style={{ marginLeft: '8px' }} // 控制按钮左侧间距
              >
                查询
              </Button>
            </span>
          </Tooltip>
        </Col>
      </Row>

  
      <ProTable<Event>
        search={{ defaultCollapsed: false, optionRender: false, labelWidth: 120 }}
        rowKey="cve_id"
        size="small"
        options={{
          density: false,
          fullScreen: false,
          reload: () => {
            if (startDate && endDate) {
              const fromDate = startDate.format('YYYY-MM-DD');
              const toDate = endDate.format('YYYY-MM-DD');
              getEvents(fromDate, toDate);
            }
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
      />
    </Card>
  );
};

export default UpdatedEventsPage;
