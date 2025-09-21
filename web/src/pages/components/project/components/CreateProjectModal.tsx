import { Modal, Form, Input, Select, Checkbox, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import React from 'react';
import { Button } from 'antd'; // 确保导入 Button 组件

const { Option } = Select;

interface CreateProjectModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  visible,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields()
      .then((values) => {
        // 手动设置未选中的复选框值为 false
        const scanTypes = [
          'sbom', 'public', 'zeroday', 'mobile', 'infoleak', 'malware', 'password', 'interface', 'misconfiguration'
        ];
        const scanTypesDict = scanTypes.reduce((acc, type) => {
          acc[type] = values.scan_options?.scan_types?.includes(type) || false;
          return acc;
        }, {} as { [key: string]: boolean });

        const scanOptions = {
          scan_types: scanTypesDict,
          raw_binary: values.scan_options?.raw_binary || false,
        };
        onSubmit({ ...values, scan_options: scanOptions });
        form.resetFields(); // 提交成功后重置表单字段
      })
      .catch((errorInfo) => {
        console.log('Validation failed:', errorInfo); // 添加这行代码
      });
  };

  return (
    <Modal
      title="Create Project"
      visible={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText="Create"
      cancelText="Cancel"
    >
      <Form form={form} layout="vertical" style={{ margin: '-12px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '120px', textAlign: 'right', marginRight: '12px' }}>Project Name</div>
          <Form.Item
            name="project_name"
            rules={[{ required: true, message: 'Please input project name' }]}
            style={{ flex: 1, marginBottom: '4px' }}
          >
            <Input />
          </Form.Item>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '120px', textAlign: 'right', marginRight: '12px' }}>Description</div>
          <Form.Item name="description" style={{ flex: 1, marginBottom: '04px' }}>
            <Input.TextArea />
          </Form.Item>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '120px', textAlign: 'right', marginRight: '12px' }}>Vendors</div>
          <Form.Item name="vendors" style={{ flex: 1, marginBottom: '4px' }}>
            <Select mode="tags" tokenSeparators={[',']} />
          </Form.Item>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '120px', textAlign: 'right', marginRight: '12px' }}>Department</div>
          <Form.Item name="department" style={{ flex: 1, marginBottom: '4px' }}>
            <Input />
          </Form.Item>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '120px', textAlign: 'right', marginRight: '12px' }}>Logo File</div>
          <Form.Item name="logo_file" style={{ flex: 1, marginBottom: '4px' }}>
            <Upload>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
        </div>
        <div>
          <div style={{ marginLeft: '50px' }}>
            <div>Scan Options</div>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <div style={{ marginLeft: '80px' }}>
              <div>Scan Types</div>
            </div>
          </div>
          <div style={{ marginLeft: '80px' }}>
            <div style={{ marginLeft: '12px' }}>              
              <Form.Item name={['scan_options', 'scan_types']} initialValue={['sbom', 'public', 'infoleak', 'malware', 'password', 'interface', 'misconfiguration']} style={{ marginBottom: '0' }}>
                <Checkbox.Group style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <Checkbox value="sbom" style={{ width: '33%' }}>SBOM</Checkbox>
                    <Checkbox value="public" style={{ width: '33%' }}>PUBLIC</Checkbox>
                    <Checkbox value="infoleak" style={{ width: '33%' }}>INFOLEAK</Checkbox>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <Checkbox value="misconfiguration" style={{ width: '33%' }}>MISCONFIGURATION</Checkbox>
                    <Checkbox value="password" style={{ width: '33%' }}>PASSWORD</Checkbox>
                    <Checkbox value="malware" style={{ width: '33%' }}>MALWARE</Checkbox>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <Checkbox value="zeroday" style={{ width: '33%' }}>ZERODAY</Checkbox>
                    <Checkbox value="mobile" style={{ width: '33%' }}>MOBILE</Checkbox>
                    <Checkbox value="interface" style={{ width: '33%' }}>INTERFACE</Checkbox>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  </div>
                </Checkbox.Group>
              </Form.Item>
            </div>
            <Form.Item name={['scan_options', 'raw_binary']} valuePropName="checked" initialValue={false} style={{ marginRight: '12px', flex: 1, marginBottom: '0' }}>
              <Checkbox>Raw Binary</Checkbox>
            </Form.Item>            
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '120px', textAlign: 'right', marginRight: '12px' }}>Customerized Data</div>
          <Form.Item name="customerized_data" style={{ flex: 1, marginBottom: '0' }}>
            <Input.TextArea />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateProjectModal;
