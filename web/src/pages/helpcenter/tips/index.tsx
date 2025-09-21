import React, { useState } from 'react';
import { Card, Button, message, Select } from 'antd';
import { useIntl } from 'umi';
import ReactJson from 'react-json-view';
import { threatTypes, threatSubtypes, threatStatuses, scanSettings } from './service'; // 假设service.ts文件中定义了这些函数

const { Option } = Select;

const ThreatPage = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, any>>();
  const [resultType, setResultType] = useState<string>('');
  const [threatTypesList, setThreatTypesList] = useState<string[]>([]);
  const { formatMessage } = useIntl();

  const handleGetThreatTypes = async () => {
    setLoading(true);
    const hide = message.loading(formatMessage({ id: 'pages.threat.message.loading' }), 0);
    const res = await threatTypes();
    if (res?.data) {
      hide();
      setLoading(false);
      message.success(formatMessage({ id: 'pages.threat.getTypes.success' }));
      setResult(res.data);
      setResultType('threatTypes');
      setThreatTypesList(res.data.threat_types);
      return;
    }

    hide();
    setLoading(false);
  };

  const handleGetThreatSubtypes = async (threatType: string) => {
    setLoading(true);
    const hide = message.loading(formatMessage({ id: 'pages.threat.message.loading' }), 0);
    const res = await threatSubtypes(threatType);
    if (res?.data) {
      hide();
      setLoading(false);
      message.success(formatMessage({ id: 'pages.threat.getSubtypes.success' }));
      setResult(res.data);
      setResultType('threatSubtypes');
      return;
    }

    hide();
    setLoading(false);
  };

  const handleGetThreatStatuses = async () => {
    setLoading(true);
    const hide = message.loading(formatMessage({ id: 'pages.threat.message.loading' }), 0);
    const res = await threatStatuses();
    if (res?.data) {
      hide();
      setLoading(false);
      message.success(formatMessage({ id: 'pages.threat.getStatuses.success' }));
      setResult(res.data);
      setResultType('threatStatuses');
      return;
    }

    hide();
    setLoading(false);
  };

  const handleGetScanSettings = async () => {
    setLoading(true);
    const hide = message.loading(formatMessage({ id: 'pages.threat.message.loading' }), 0);
    const res = await scanSettings();
    if (res?.data) {
      hide();
      setLoading(false);
      message.success(formatMessage({ id: 'pages.threat.getSettings.success' }));
      setResult(res.data);
      setResultType('scanSettings');
      return;
    }

    hide();
    setLoading(false);
  };

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ flex: 1, marginRight: 24, minHeight: 400 }}>
          <Card title={resultType ? formatMessage({ id: `pages.threat.${resultType}` }) : ''}>
            <div style={{ maxHeight: 400, overflow: 'auto' }}>
              {result && (
                <ReactJson
                  style={{ paddingTop: 12 }}
                  name={false}
                  src={result as object}
                  collapsed={false} // 默认展开JSON信息
                  collapseStringsAfterLength={50}
                  displayDataTypes={false} // 不显示类型说明
                />
              )}
            </div>
          </Card>
        </div>
        <div style={{ width: 200 }}>
          <Button loading={loading} type="primary" onClick={handleGetThreatTypes} style={{ width: '100%', marginBottom: 16 }}>
            {formatMessage({ id: 'pages.threat.btn.getTypes' })}
          </Button>
          <Select
            loading={loading}
            style={{ width: '100%', marginBottom: 16 }}
            placeholder={formatMessage({ id: 'pages.threat.btn.getSubtypes' })}
            onSelect={handleGetThreatSubtypes}
            dropdownMatchSelectWidth={false}
          >
            {threatTypesList.map((type) => (
              <Option key={type} value={type}>
                {type}
              </Option>
            ))}
          </Select>
          <Button loading={loading} type="primary" onClick={handleGetThreatStatuses} style={{ width: '100%', marginBottom: 16 }}>
            {formatMessage({ id: 'pages.threat.btn.getStatuses' })}
          </Button>
          <Button loading={loading} type="primary" onClick={handleGetScanSettings} style={{ width: '100%', marginBottom: 16 }}>
            {formatMessage({ id: 'pages.threat.btn.getSettings' })}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ThreatPage;
