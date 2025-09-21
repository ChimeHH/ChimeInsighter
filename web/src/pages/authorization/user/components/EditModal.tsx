import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Switch, InputNumber  } from 'antd';
import { useIntl, useModel } from 'umi';

const { Option } = Select;

type Props = {
  visible: boolean;
  type: string;
  current: Partial<API.User> | undefined;
  onSubmit: (values: Partial<API.User>) => void;
  onCancel: () => void;
};

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const OperateModal: React.FC<Props> = (props) => {
  const { visible, type, current, onCancel, onSubmit } = props;
  const [form] = Form.useForm();
  const intl = useIntl();
  const { initialState } = useModel('@@initialState');

  useEffect(() => {
    if (form && !visible) {
      form.resetFields();
    }
  }, [visible]);

  useEffect(() => {
    if (current) {
      form.setFieldsValue({
        ...current,
      });
    }
  }, [current]);

  const handleSubmit = () => {
    if (!form) return;
    form.submit();
  };

  const handleFinish = (values: Record<string, any>) => {
    const filteredValues = Object.keys(values).reduce((acc, key) => {
      if (values[key] === null) {
        acc[key] = undefined;
      } else {
        acc[key] = values[key];
      }
      return acc;
    }, {});
  
    if (onSubmit) {
      onSubmit(type === 'add' ? filteredValues : { ...filteredValues, username: current?.username });
    }
  };
  

  const modalFooter = { okText: intl.formatMessage({ id: 'user.modal.save' }), onOk: handleSubmit, onCancel };

  return (
    <Modal
      title={intl.formatMessage({ id: `user.modal.${current ? 'edit' : 'add'}` })}
      width={640}
      bodyStyle={{ padding: '28px 0 0' }}
      destroyOnClose
      open={visible}
      maskClosable={false}
      {...modalFooter}
      forceRender
    >
      <Form {...formLayout} form={form} onFinish={handleFinish}>
      {type === 'add' && (
          <>
            <Form.Item name="username" label={intl.formatMessage({ id: 'user.modal.username' })} initialValue={''} rules={[{ required: true }]}>
              <Input placeholder={intl.formatMessage({ id: 'user.modal.username' })} />
            </Form.Item>
            <Form.Item name="password" label={intl.formatMessage({ id: 'user.modal.password' })} initialValue={''} rules={[{ required: true }]}>
              <Input.Password placeholder={intl.formatMessage({ id: 'user.modal.password' })} autoComplete="current-password" />
            </Form.Item>
            <Form.Item name="role" label={intl.formatMessage({ id: 'user.modal.role' })} initialValue={'admin'} rules={[{ required: true }]}>
              <Select
                style={{ width: '100%' }}
                placeholder={intl.formatMessage({ id: 'user.modal.role' })}
                showSearch
                optionFilterProp="children"
              >
                <Option value="admin" key="admin">
                  {intl.formatMessage({ id: 'user.modal.role.admin' })}
                </Option>
                <Option value="manager" key="manager">
                  {intl.formatMessage({ id: 'user.modal.role.manager' })}
                </Option>
                <Option value="member" key="member">
                  {intl.formatMessage({ id: 'user.modal.role.member' })}
                </Option>
              </Select>
            </Form.Item>
            <Form.Item name="total_uploads" label={intl.formatMessage({ id: 'user.modal.total_uploads' })} initialValue={null} rules={[{ required: false, type: 'number' }]}>
              <InputNumber style={{ width: '100%' }} placeholder={intl.formatMessage({ id: 'user.modal.total_uploads' })} />
            </Form.Item>
            <Form.Item name="total_uploads_mg" label={intl.formatMessage({ id: 'user.modal.total_uploads_mg' })} initialValue={null} rules={[{ required: false, type: 'number' }]}>
              <InputNumber style={{ width: '100%' }} placeholder={intl.formatMessage({ id: 'user.modal.total_uploads_mg' })} />
            </Form.Item>
            <Form.Item name="max_filesize_mg" label={intl.formatMessage({ id: 'user.modal.max_filesize_mg' })} initialValue={null} rules={[{ required: false, type: 'number' }]}>
              <InputNumber style={{ width: '100%' }} placeholder={intl.formatMessage({ id: 'user.modal.max_filesize_mg' })} />
            </Form.Item>
          </>
        )}
        {type === 'edit' && (
          <>
            <Form.Item name="role" label={intl.formatMessage({ id: 'user.modal.role' })} rules={[{ required: true }]}>
              <Select
                style={{ width: '100%' }}
                placeholder={intl.formatMessage({ id: 'user.modal.role' })}
                showSearch
                optionFilterProp="children"
              >
                <Option value="admin" key="admin">
                  {intl.formatMessage({ id: 'user.modal.role.admin' })}
                </Option>
                <Option value="manager" key="manager">
                  {intl.formatMessage({ id: 'user.modal.role.manager' })}
                </Option>
                <Option value="member" key="member">
                  {intl.formatMessage({ id: 'user.modal.role.member' })}
                </Option>
              </Select>
            </Form.Item>
            <Form.Item name="total_uploads" label={intl.formatMessage({ id: 'user.modal.total_uploads' })} initialValue={null} rules={[{ required: false, type: 'number' }]}>
              <InputNumber style={{ width: '100%' }} placeholder={intl.formatMessage({ id: 'user.modal.total_uploads' })} />
            </Form.Item>
            <Form.Item name="total_uploads_mg" label={intl.formatMessage({ id: 'user.modal.total_uploads_mg' })} initialValue={null} rules={[{ required: false, type: 'number' }]}>
              <InputNumber style={{ width: '100%' }} placeholder={intl.formatMessage({ id: 'user.modal.total_uploads_mg' })} />
            </Form.Item>
            <Form.Item name="max_filesize_mg" label={intl.formatMessage({ id: 'user.modal.max_filesize_mg' })} initialValue={null} rules={[{ required: false, type: 'number' }]}>
              <InputNumber style={{ width: '100%' }} placeholder={intl.formatMessage({ id: 'user.modal.max_filesize_mg' })} />
            </Form.Item>
            <Form.Item name="active" label={intl.formatMessage({ id: 'user.modal.status' })} valuePropName="checked">
              <Switch />
            </Form.Item>
          </>
        )}
        {type === 'reset' && (
          <>
            {current && current.username === initialState?.currentUser?.username && (
              <Form.Item name="current_password" label={intl.formatMessage({ id: 'user.modal.currentPassword' })} rules={[{ required: true }]}>
                <Input.Password placeholder={intl.formatMessage({ id: 'user.modal.currentPassword' })} autoComplete="new-password" />
              </Form.Item>
            )}
            <Form.Item name="password" label={intl.formatMessage({ id: 'user.modal.newPassword' })} rules={[{ required: true }]}>
              <Input.Password
                placeholder={intl.formatMessage({ id: 'user.modal.newPassword' })}
                onChange={() => {
                  if (form.getFieldValue('password2')) {
                    form.validateFields(['password2']);
                  }
                }}
                autoComplete="new-password"
              />
            </Form.Item>
            <Form.Item
              name="password2"
              label={intl.formatMessage({ id: 'user.modal.confirmNewPassword' })}
              rules={[
                { required: true },
                ({ getFieldValue }) => ({
                  validator(role, value) {
                    if (!value) {
                      return Promise.resolve();
                    }
                    if (value !== getFieldValue('password')) {
                      return Promise.reject(intl.formatMessage({ id: 'user.modal.passwordMismatch' }));
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Input.Password placeholder={intl.formatMessage({ id: 'user.modal.confirmNewPassword' })} autoComplete="new-password" />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default OperateModal;
