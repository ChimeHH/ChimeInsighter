import React, { useState } from 'react';
import { Card, Form, Button, Upload, message } from 'antd';
import { useIntl } from 'umi';
import ReactJson from 'react-json-view';
import { installLicense, getLicenseInfo, getServerId } from './service'; // 假设service.ts文件中定义了installLicense、getLicenseInfo和getServerId函数

const LicensePage = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, any>>();
  const [resultType, setResultType] = useState<string>('');
  const { formatMessage } = useIntl();

  const handleInstallLicense = async (values: any) => {
    setLoading(true);
    const hide = message.loading(formatMessage({ id: 'pages.license.message.loading' }), 0);
    try {
      const res = await installLicense(values.file[0].originFileObj);
      if (res?.status_code === 0) {
        hide();
        setLoading(false);
        message.success(formatMessage({ id: 'pages.license.install.success' }));
        setResult(res.data);
        setResultType('license');
        return;
      }

      hide();
      setLoading(false);
    } catch (error) {
      hide(); // 隐藏加载提示      
      setLoading(false);
    }
  };

  const handleGetLicenseInfo = async () => {
    setLoading(true);
    const hide = message.loading(formatMessage({ id: 'pages.license.message.loading' }), 0);
    try {
      const res = await getLicenseInfo();
      if (res?.data) {
        hide();
        setLoading(false);
        // message.success(formatMessage({ id: 'pages.license.getInfo.success' }));
        setResult(res.data);
        setResultType('license');
        return;
      }

      hide();
      setLoading(false);
    } catch (error) {
      hide(); // 隐藏加载提示      
      setLoading(false);
    }
  };

  const handleGetServerId = async () => {
    setLoading(true);
    const hide = message.loading(formatMessage({ id: 'pages.license.message.loading' }), 0);
    try {
      const res = await getServerId();
      if (res?.data) {
        hide();
        setLoading(false);
        // message.success(formatMessage({ id: 'pages.license.getServerId.success' }));
        setResult(res.data);
        setResultType('serverId');
        return;
      }

      hide();
      setLoading(false);
    } catch (error) {
      hide(); // 隐藏加载提示      
      setLoading(false);
    }
  };

  return (
    <Card title={formatMessage({ id: 'pages.license.title' })}>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'center' }}>
        <Form onFinish={handleInstallLicense} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <Form.Item
            name="file"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
  
              return e && e.fileList;
            }}
            rules={[{ required: true }]}
            style={{ marginBottom: 0 }}
          >
            <Upload multiple={false} beforeUpload={() => false}>
              <Button>{formatMessage({ id: 'pages.license.btn.selectFile' })}</Button>
            </Upload>
          </Form.Item>
          
          <Form.Item noStyle>
            <Button loading={loading} type="primary" htmlType="submit" style={{ marginLeft: 16 }}>
              {formatMessage({ id: 'pages.license.btn.install' })}
            </Button>
          </Form.Item>
          
          <Form.Item noStyle>
            <Button loading={loading} type="primary" onClick={handleGetServerId} style={{ marginLeft: 48 }}>
              {formatMessage({ id: 'pages.license.btn.getServerId' })}
            </Button>
          </Form.Item>
          
          <Form.Item noStyle>
            <Button loading={loading} type="primary" onClick={handleGetLicenseInfo} style={{ marginLeft: 48 }}>
              {formatMessage({ id: 'pages.license.btn.getInfo' })}
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div style={{ paddingTop: 24 }}>
        {result && (
          <>
            <div>{resultType === 'license' ? formatMessage({ id: 'pages.license.info' }) : formatMessage({ id: 'pages.license.serverId' })}</div>
            <ReactJson
              style={{ paddingTop: 12 }}
              name={false}
              src={result as object}
              collapsed={false}
              collapseStringsAfterLength={50}
              displayDataTypes={false}
            />
          </>
        )}
      </div>
    </Card>
  );
  
  
};

export default LicensePage;
