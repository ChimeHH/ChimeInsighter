/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, DatePicker, Upload, Select, Switch } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import moment from 'moment';
import type { Version, VersionFormData } from '../data';
import { useIntl } from 'umi';

type Props = {
  visible: boolean;
  type: string; 
  current: Partial<Version> | undefined;
  onSubmit: (values: VersionFormData) => void;
  onCancel: () => void;
};

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const baseMessageId = 'pages.form';

const OperateModal: React.FC<Props> = (props) => {
  const { visible, type, current, onCancel, onSubmit } = props;
  const [form] = Form.useForm();
  const { formatMessage } = useIntl();
  
  const [allowCache, setAllowCache] = useState(true);
  const [priority, setPriority] = useState<number>(1);
  const [allowBlacklist, setAllowBlacklist] = useState(true);
  const [autoCleanup, setAutoCleanup] = useState(false);
  const [strategy, setStrategy] = useState<string>('FAST');

  useEffect(() => {
    if (form && !visible) {
      form.resetFields();
    }
  }, [visible]);

  useEffect(() => {
    if (current) {
      form.setFieldsValue({
        ...current,
        version_date: moment.utc(current?.version_date),
      });
    }
  }, [current]);

  const handleSubmit = () => {
    if (!form) return;
    form.submit();
  };

  const handleFinish = (values: VersionFormData) => {
    onSubmit({ ...values, allowCache, allowBlacklist, autoCleanup, priority, strategy });
  };

  const modalFooter = {
    okText: formatMessage({ id: `${baseMessageId}.submit` }),
    onOk: handleSubmit,
    onCancel,
  };

  const action = current ? (type === 'rescan' ? 'Rescan' : 'Edit') : 'Add';

  return (
    <Modal
      title={formatMessage({
        id: `${baseMessageId}.title.${action.toLocaleLowerCase()}`,
        defaultMessage: action,
      })}
      width={640}
      bodyStyle={{ padding: '28px 0 0' }}
      destroyOnClose
      open={visible}
      maskClosable={false}
      {...modalFooter}
      forceRender
    >
      {(type === 'add' || type === 'rescan') && (
        <div style={{ marginBottom: 16, marginLeft: 120, marginRight: 120 }}>
          <div style={{ marginTop: 16, marginLeft: 30, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: 8 }}>{formatMessage({ id: `${baseMessageId}.allowCache` })}</span>
              <Switch checked={allowCache} onChange={setAllowCache} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: 8 }}>{formatMessage({ id: `${baseMessageId}.allowBlacklist` })}</span>
              <Switch checked={allowBlacklist} onChange={setAllowBlacklist} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: 8 }}>{formatMessage({ id: `${baseMessageId}.autoCleanup` })}</span>
              <Switch checked={autoCleanup} onChange={setAutoCleanup} />
            </div>
          </div>

          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center' }}>
            <span style={{ marginLeft: 16 }}>{formatMessage({ id: `${baseMessageId}.priority` })}：</span>
            <Select value={priority} onChange={setPriority} style={{ width: 80, marginLeft: 8 }}>
              <Select.Option value={2}>{formatMessage({ id: `${baseMessageId}.priority.low` })}</Select.Option>
              <Select.Option value={1}>{formatMessage({ id: `${baseMessageId}.priority.medium` })}</Select.Option>
              <Select.Option value={0}>{formatMessage({ id: `${baseMessageId}.priority.high` })}</Select.Option>
            </Select>
            
            <div style={{ flex: '1 1 auto' }}></div> {/* 占位元素，增加间距 */}

            <span style={{ marginLeft: 16 }}>{formatMessage({ id: `${baseMessageId}.strategy` })}：</span>
            <Select value={strategy} onChange={setStrategy} style={{ width: 100, marginLeft: 8 }}>
              <Select.Option value="FAST">{formatMessage({ id: `${baseMessageId}.strategy.fast` })}</Select.Option>
              <Select.Option value="BALANCE">{formatMessage({ id: `${baseMessageId}.strategy.balance` })}</Select.Option>
              <Select.Option value="COVERAGE">{formatMessage({ id: `${baseMessageId}.strategy.coverage` })}</Select.Option>
            </Select>
          </div>
        </div>
      )}

      
      <Form
        {...formLayout}
        form={form}
        onFinish={handleFinish}
        initialValues={{
          version_date: moment.utc(),
        }}
      >
        <Form.Item name="version_id" rules={[{ required: current ? true : false }]} hidden={true}>
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="version_name"
          label={formatMessage({ id: `${baseMessageId}.versionNameLabel` })}
          rules={[{ required: true, message: formatMessage({ id: `${baseMessageId}.versionName.required` }) }]}
        >
          <Input placeholder={formatMessage({ id: `${baseMessageId}.versionName.placeholder` })} />
        </Form.Item>
        <Form.Item
          name="version_date"
          label={formatMessage({ id: `${baseMessageId}.versionDateLabel` })}
        >
          <DatePicker allowClear={false} />
        </Form.Item>
        <Form.Item name="description" label={formatMessage({ id: `${baseMessageId}.descLabel` })}>
          <Input placeholder={formatMessage({ id: `${baseMessageId}.desc.placeholder` })} />
        </Form.Item>
        
        {(type === 'add') && (
          <Form.Item
            name="files"
            valuePropName="fileList"
            wrapperCol={{ offset: 7, span: 13 }}
            rules={[{ required: true, message: formatMessage({ id: `${baseMessageId}.uploadFile.required` }) }]}
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e && e.fileList;
            }}
          >
            <Upload.Dragger beforeUpload={() => false} maxCount={1}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                {formatMessage({ id: `${baseMessageId}.upload.tip` })}
              </p>
            </Upload.Dragger>
          </Form.Item>
        )}

        {(type === 'rescan') && (
          <Form.Item
            name="files"
            valuePropName="fileList"
            wrapperCol={{ offset: 7, span: 13 }}
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e && e.fileList;
            }}
          >
            <Upload.Dragger beforeUpload={() => false} maxCount={1}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                {formatMessage({ id: `${baseMessageId}.upload.tip` })}
              </p>
            </Upload.Dragger>
          </Form.Item>
        )}

        {(type === 'edit') && (
          <Form.Item
            name="files"
            hidden
          >
            <Input disabled />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default OperateModal;
