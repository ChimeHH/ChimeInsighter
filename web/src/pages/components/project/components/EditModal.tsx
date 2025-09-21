import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select } from 'antd';

const { Option } = Select;

interface EditModalProps {
  visible: boolean;
  type: string;
  current: Partial<Project> | undefined;
  onCancel: () => void;
  onSubmit: (data: Partial<Project>) => void;
  formatMessage: (id: { id: string }) => string;
}

const EditModal: React.FC<EditModalProps> = ({ visible, type, current, onCancel, onSubmit, formatMessage }) => {
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState<Partial<Project>>({});

  useEffect(() => {
    if (current) {
      setInitialValues({
        project_id: current.project_id,
        project_name: current.project_name,
        description: current.description,
        vendors: current.vendors,
        department: current.department,
        customerized_data: current.customerized_data,
        scan_options: current.scan_options ? formatScanOptions(current.scan_options) : '', // 格式化scan_options
        // 其他字段可以根据需要添加
      });
    }
  }, [current]);

  const formatScanOptions = (scan_options: any): string => {
    const result = [];
    for (const [key, value] of Object.entries(scan_options)) {
      if (typeof value === 'object' && value !== null) {
        result.push(`${key}:`);
        result.push(formatNestedObject(value, '  '));
      } else {
        result.push(formatKeyValue(key, value));
      }
    }
    return result.join('\n');
  };

  const formatNestedObject = (obj: any, indent: string): string => {
    const result = [];
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object' && value !== null) {
        result.push(`${indent}${key}:`);
        result.push(formatNestedObject(value, `${indent}  `));
      } else {
        result.push(`${indent}${formatKeyValue(key, value)}`);
      }
    }
    return result.join('\n');
  };

  const formatKeyValue = (key: string, value: any): string => {
    if (value === true) {
      return `<span style="color: green;">${key}: ${JSON.stringify(value)}</span>`;
    } else {
      return `${key}: ${JSON.stringify(value)}`;
    }
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      const { project_name, scan_options, ...restValues } = values;
      onSubmit({
        ...restValues,
        project_id: current?.project_id,
      });
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  const handleVendorsChange = (value: string[]) => {
    // 过滤掉空字符串，包括只有空格、制表符的字符串
    const filteredValue = value.filter(item => item.trim() !== '');
    form.setFieldsValue({ vendors: filteredValue });
  };

  return (
    <Modal
      visible={visible}
      title={type === 'add' ? formatMessage({ id: 'pages.modal.title.addProject' }) : formatMessage({ id: 'pages.modal.title.editProject' })}
      okText={formatMessage({ id: 'pages.modal.button.update' })}
      cancelText={formatMessage({ id: 'pages.modal.button.cancel' })}
      onCancel={onCancel}
      onOk={handleSubmit}
    >
      <Form
        form={form}
        layout="horizontal"
        initialValues={initialValues}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
      >
        <Form.Item
          name="project_name"
          label={formatMessage({ id: 'pages.modal.label.projectName' })}
        >
          <Input readOnly style={{ backgroundColor: '#f5f5f5' }} />
        </Form.Item>
        <Form.Item
          name="department"
          label={formatMessage({ id: 'pages.modal.label.department' })}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label={formatMessage({ id: 'pages.modal.label.description' })}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="vendors"
          label={formatMessage({ id: 'pages.modal.label.vendors' })}
        >
          <Select mode="tags" tokenSeparators={[',']} onChange={handleVendorsChange}></Select>
        </Form.Item>
        <Form.Item
          name="customerized_data"
          label={formatMessage({ id: 'pages.modal.label.customerizedData' })}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="scan_options"
          label={formatMessage({ id: 'pages.modal.label.scanOptions' })}
        >
          <div
            style={{ backgroundColor: '#f5f5f5', borderRadius: '4px', padding: '16px', whiteSpace: 'pre-wrap' }}
            dangerouslySetInnerHTML={{ __html: initialValues.scan_options }}
          />
        </Form.Item>
        {/* 其他字段可以根据需要添加 */}
      </Form>
    </Modal>
  );
};

export default EditModal;
