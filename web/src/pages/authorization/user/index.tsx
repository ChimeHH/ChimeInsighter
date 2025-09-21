import { PlusOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, message, Popconfirm } from 'antd';
import React, { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';

import { deleteUser, insertUser, resetPassword, updateUser, changePassword } from '@/services/user';
import EditModal from './components/EditModal';

const UserTable: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false); //弹窗-显示
  const [current, setCurrent] = useState<Partial<API.User> | undefined>(undefined); //弹窗-值
  const [actionType, setType] = useState('');
  const { initialState } = useModel('@@initialState');
  const { users, loading, run } = useModel('user');
  const intl = useIntl();

  /* 弹窗-编辑显示 */
  const showEditModal = (item: API.User) => {
    setVisible(true); //显示
    setCurrent(item); //赋值
  };

  /* 弹窗-取消 */
  const handleCancel = () => {
    setVisible(false); //隐藏
    setCurrent(undefined); //此处必须赋空值
  };

  /* 弹窗-确定 */
  const handleSubmit = async (values: Partial<API.User>) => {
    // console.log('current:', current); // 调试 current 的值
    // console.log('values:', values); // 调试 values 的值

    const hide = message.loading(intl.formatMessage({ id: 'user.modal.submitting' }));
    let res: any = {};
    let text = intl.formatMessage({ id: 'user.modal.add' });
    if (!current) {
      res = await insertUser({
        username: values.username!,
        password: values.password!,
        total_uploads: values.total_uploads!,
        total_uploads_mg: values.total_uploads_mg!,
        max_filesize_mg: values.max_filesize_mg!,
        role: values.role!,
      });
    } else {
      if (actionType === 'edit') {
        res = await updateUser({
          username: values.username!,
          role: values.role,
          total_uploads: values.total_uploads!,
          total_uploads_mg: values.total_uploads_mg!,
          max_filesize_mg: values.max_filesize_mg!,
          active: values.active,
        });
        text = intl.formatMessage({ id: 'user.modal.edit' });
      } else if (actionType === 'reset') {
        if (current.username === initialState?.currentUser?.username) {
          res = await changePassword({
            current_password: values.current_password!,
            new_password: values.password!,
          });
          text = intl.formatMessage({ id: 'user.modal.changePassword' });
        } else {
          res = await resetPassword({
            username: values.username!,
            new_password: values.password!,
          });
          text = intl.formatMessage({ id: 'user.modal.resetPassword' });
        }
      }
    }

    hide();

    if (res.status_code === 0) {
      message.success(`${text} ${intl.formatMessage({ id: 'user.modal.success' })}`);
      setVisible(false);
      run();
    }
  };

  const removeUser = async (usernames: string[]) => {
    const { status_code } = await deleteUser(usernames);
    if (status_code === 0) {
      message.success(intl.formatMessage({ id: 'user.table.deleteSuccess' }));
      run();
    }
  };

  const columns: ProColumns<API.User>[] = [
    {
      title: intl.formatMessage({ id: 'user.table.serialNumber' }),
      width: 40,
      render: (_dom, _entity, index) => index + 1,
    },
    {
      title: intl.formatMessage({ id: 'user.table.username' }),
      dataIndex: 'username',
      width: 100,
    },
    {
      title: intl.formatMessage({ id: 'user.table.role' }),
      dataIndex: 'role',
      width: 60,
    },
    {
      title: intl.formatMessage({ id: 'user.modal.total_uploads' }),
      dataIndex: 'total_uploads',
      width: 60,
    },
    {
      title: intl.formatMessage({ id: 'user.modal.total_uploads_mg' }),
      dataIndex: 'total_uploads_mg',
      width: 60,
    },
    {
      title: intl.formatMessage({ id: 'user.modal.max_filesize_mg' }),
      dataIndex: 'max_filesize_mg',
      width: 60,
    },
    {
      title: intl.formatMessage({ id: 'user.table.status' }),
      dataIndex: 'active',
      width: 40,
      render: (active) => active ? intl.formatMessage({ id: 'user.table.active' }) : intl.formatMessage({ id: 'user.table.inactive' }),
    },
    {
      title: intl.formatMessage({ id: 'user.table.actions' }),
      dataIndex: 'option',
      valueType: 'option',
      width: 200,
      render: (_, record) => [
        <a
          key="reset"
          onClick={() => {
            setType('reset');
            showEditModal(record);
          }}
        >
          {intl.formatMessage({ id: 'user.table.resetPassword' })}
        </a>,
        <Popconfirm
          key='delete'
          title={intl.formatMessage({ id: 'user.table.deleteConfirm' })}
          onConfirm={() => removeUser([record.username])}
          okText={intl.formatMessage({ id: 'user.modal.save' })}
          cancelText={intl.formatMessage({ id: 'user.modal.cancel' })}
        >
          <a>{intl.formatMessage({ id: 'user.table.delete' })}</a>
        </Popconfirm>,
        <a
          key="edit"
          onClick={() => {
            setType('edit');
            showEditModal(record);
          }}
        >
          {intl.formatMessage({ id: 'user.table.editRole' })}
        </a>,
      ],
      fixed: 'right',
    },
  ];

  useEffect(() => {
    run();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 定义内联样式
  const inactiveRowStyle = `
    .inactive-row {
      background-color: #f0f0f0; /* 灰色背景 */
    }
  `;

  return (
    <>
      {/* 使用 <style> 标签插入内联样式 */}
      <style>{`
        .inactive-row {
          color: #888; /* 灰色字体 */
        }
      `}</style>
      <ProTable<API.User>
        rowKey="username"
        search={false}
        size="small"
        options={{ density: false, fullScreen: false, reload: () => run() }}
        pagination={{
          pageSize: 10,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setType('add');
              setVisible(true);
              setCurrent(undefined);
            }}
          >
            <PlusOutlined /> {intl.formatMessage({ id: 'user.modal.add' })}
          </Button>,
        ]}
        loading={loading}
        dataSource={users}
        columns={columns}
        scroll={{ x: 510 }}
        rowClassName={(record) => (record.active ? '' : 'inactive-row')}
      />
      <EditModal
        visible={visible}
        type={actionType}
        current={current}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </>
  );
};


export default UserTable;
