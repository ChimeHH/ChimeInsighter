import React, { useState, useEffect } from 'react';
import { Modal, Form, Table, Select, Checkbox, Button, Card } from 'antd';
import { RightOutlined, LeftOutlined } from '@ant-design/icons'; // 导入图标组件
import { getProjectSummary } from '../service'; // 确保路径正确

const { Option } = Select;

interface PermissionModalProps {
  visible: boolean;
  type: string;
  current: Partial<Project> | undefined;
  onCancel: () => void;
  onSubmit: (data: Partial<Project>) => void;
}

const PermissionModal: React.FC<PermissionModalProps> = ({ visible, type, current, onCancel, onSubmit }) => {
  const [form] = Form.useForm();
  const [candidates, setCandidates] = useState<API.User[]>([]);
  const [projectUsers, setProjectUsers] = useState<API.ProjectUser[]>([]);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [selectedProjectUsers, setSelectedProjectUsers] = useState<string[]>([]);

  useEffect(() => {
    if (current && current.project_id) {
      getProjectSummary(current.project_id).then(summary => {
        if (summary.status_code === 0) {
          const candidatesList = Array.isArray(summary.data.candidates) ? summary.data.candidates : [];
          const usersList = Array.isArray(summary.data.users) ? summary.data.users : [];

          // 过滤掉已经在 projectUsers 中的用户
          const filteredCandidatesList = candidatesList.filter(candidate => 
            !usersList.some(user => user.username === candidate.username)
          );

          setCandidates(filteredCandidatesList);
          setProjectUsers(usersList);
        } else {
          console.error('Failed to get project summary');
        }
      }).catch(error => {
        console.error('Error fetching project summary:', error);
      });
    } else {
      setCandidates([]);
      setProjectUsers([]);
    }
  }, [current]);

  const handleCandidateCheckboxChange = (username: string) => {
    setSelectedCandidates(prev => prev.includes(username) ? prev.filter(u => u !== username) : [...prev, username]);
  };

  const handleProjectUserCheckboxChange = (username: string) => {
    setSelectedProjectUsers(prev => prev.includes(username) ? prev.filter(u => u !== username) : [...prev, username]);
  };

  const handleRemoveUsers = () => {
    const usersToRemove = selectedProjectUsers.map(username => ({ username }));
    setCandidates(prev => [...prev, ...usersToRemove]);
    setProjectUsers(prev => prev.filter(user => !selectedProjectUsers.includes(user.username)));
    setSelectedProjectUsers([]); // 清空 selectedProjectUsers 数组
  };
  
  const handleAddUsers = () => {
    const usersToAdd = selectedCandidates.map(username => ({ username, role: 'member' })); // 默认角色为 'member'
    setProjectUsers(prev => [...prev, ...usersToAdd]);
    setCandidates(prev => prev.filter(user => !selectedCandidates.includes(user.username)));
    setSelectedCandidates([]); // 清空 selectedCandidates 数组
  };
  
  const handleSubmit = () => {
    form.validateFields().then(values => {
      const updatedUsers = projectUsers.reduce((acc, user) => {
        acc[user.username] = user.role;
        return acc;
      }, {} as { [key: string]: string });

      onSubmit({
        ...values,
        project_id: current?.project_id,
        users: updatedUsers,
      });
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };
  
  const columns = [
    {
      title: '',
      dataIndex: 'checkbox',
      width: 20, // 调整宽度
      render: (text: any, record: API.User) => (
        <Checkbox onChange={() => handleCandidateCheckboxChange(record.username)} />
      ),
    },
    {
      title: '用户名',
      dataIndex: 'username',
      width: 40, // 调整宽度
    },
  ];

  const projectUserColumns = [
    {
      title: '',
      dataIndex: 'checkbox',
      width: 20, // 调整宽度
      render: (text: any, record: API.ProjectUser) => (
        <Checkbox onChange={() => handleProjectUserCheckboxChange(record.username)} />
      ),
    },
    {
      title: '用户名',
      dataIndex: 'username',
      width: 40, // 调整宽度
    },
    {
      title: '角色',
      dataIndex: 'role',
      width: 60, // 调整宽度
      render: (text: string, record: API.ProjectUser) => (
        <Select defaultValue={text} style={{ width: 120 }} onChange={(value) => {
          const updatedProjectUsers = projectUsers.map(user => user.username === record.username ? { ...user, role: value } : user);
          setProjectUsers(updatedProjectUsers);
        }}>
          <Option value="admin">Admin</Option>
          <Option value="member">Member</Option>
          <Option value="viewer">Viewer</Option>
        </Select>
      ),
    },
  ];

  return (
    <Modal
      visible={visible}
      title="项目成员管理"
      okText="提交"
      cancelText="取消"
      onCancel={onCancel}
      onOk={handleSubmit}
      width={800}
      bodyStyle={{ padding: '24px', height: 'calc(100% - 120px)', overflow: 'auto' }} // 增加窗口高度并设置滚动条
    >
      <Form
        form={form}
        layout="vertical"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', height: '100%' }}>
          <div style={{ width: '45%', height: '100%' }}>
            <Card title="系统用户" headStyle={{ padding: '8px 16px', fontSize: '14px' }} bodyStyle={{ padding: '16px', height: 240, overflow: 'auto' }}>
              <Table
                rowKey="username"
                dataSource={candidates}
                columns={columns}
                pagination={false}
                showHeader={false} // 隐藏表格标题行
                className="custom-table" // 添加自定义类
              />
            </Card>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '10%', height: '100%', justifyContent: 'center', marginTop: 'auto', marginBottom: 'auto' }}>
            <Button type="primary" icon={<RightOutlined />} onClick={handleAddUsers} disabled={selectedCandidates.length === 0} />
            <Button type="primary" icon={<LeftOutlined />} onClick={handleRemoveUsers} disabled={selectedProjectUsers.length === 0} />
          </div>
          <div style={{ width: '45%', height: '100%' }}>
            <Card title="项目成员" headStyle={{ padding: '8px 16px', fontSize: '14px' }} bodyStyle={{ padding: '16px', height: 240, overflow: 'auto' }}>
              <Table
                rowKey="username"
                dataSource={projectUsers}
                columns={projectUserColumns}
                pagination={false}
                showHeader={false} // 隐藏表格标题行
                className="custom-table" // 添加自定义类
              />
            </Card>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default PermissionModal;

// 在文件末尾添加内联样式
const styles = `
  .custom-table .ant-table-cell {
    padding: 4px 8px; /* 调整单元格内边距 */
  }

  .custom-table .ant-table-thead > tr > th,
  .custom-table .ant-table-tbody > tr > td {
    border-right: none; /* 移除列之间的边框 */
    border-bottom: none; /* 移除行之间的边框 */
  }
`;

const styleElement = document.createElement('style');
styleElement.type = 'text/css';
styleElement.appendChild(document.createTextNode(styles));
document.head.appendChild(styleElement);
