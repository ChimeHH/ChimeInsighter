import React, { useRef, useState } from 'react';
import { Button, message, Modal, notification } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { TableListItem } from './data';
import { queryRule, postRule, removeRule } from './service';
import EditModal from './components/EditModal';

const TableList: React.FC = () => {
    const actionRef = useRef<ActionType>();
    const [selectedRows, setSelectedRows] = useState<TableListItem[]>([]);
    const [visible, setVisible] = useState<boolean>(false); //弹窗-显示
    const [current, setCurrent] = useState<Partial<TableListItem> | undefined>(undefined); //弹窗-值

    /* 删除节点 */
    const handleRemove = async (selectedRows: TableListItem[]) => {
        const hide = message.loading('正在删除');

        const { data } = await removeRule(selectedRows);
        const arr = data.filter((e) => {
            return e.code != 0;
        });

        hide();

        if (arr.length > 0) {
            const text = (
                <React.Fragment>
                    {arr.map((e) => {
                        return (<div key={e.id}>id{e.id}: {e.message}</div>);
                    })}
                </React.Fragment>
            );
            notification.error({
                message: '删除失败',
                description: <React.Fragment>{text}</React.Fragment>
            });
            return true;
        } else {
            message.success('删除成功，即将刷新');
            setSelectedRows([]);
            actionRef.current?.reloadAndRest?.();
            return true;
        }
    };

    /* 弹窗-编辑显示 */
    const showEditModal = (item: TableListItem) => {
        setVisible(true); //显示
        setCurrent(item); //赋值
    };

    /* 弹窗-取消 */
    const handleCancel = () => {
        setVisible(false); //隐藏
        setCurrent(undefined); //此处必须赋空值
    };

    /* 弹窗-确定 */
    const handleSubmit = async (values: TableListItem) => {
        const text = current ? '修改' : '新增';
        const hide = message.loading(`正在${text}`);

        const { code, message: msg } = await postRule({ ...values, username: current?.username });

        hide();

        if (code == 0) {
            message.success(`${text}成功`);
            setVisible(false);
            actionRef.current?.reloadAndRest?.(); //刷新
        } else {
            message.error(msg);
        }
    };

    //列定义
    const columns: ProColumns<TableListItem>[] = [{
        title: 'ID',
        dataIndex: 'id',
        tip: 'ID是唯一的key',
        width: 70
    }, {
        title: '名称',
        dataIndex: 'name',
        width: 120,
        hideInSearch: true
    }, {
        title: '描述',
        dataIndex: 'description',
        width: 200,
        hideInSearch: true
    }, {
        title: '菜单权限',
        dataIndex: 'menuNames',
        ellipsis: true,
        hideInSearch: true
    }, {
        title: '排序',
        dataIndex: 'sequence',
        width: 100,
        hideInSearch: true
    }, {
        title: '状态',
        dataIndex: 'rowStatus',
        width: 80,
        hideInSearch: true,
        render: (record) => {
            let s = record ? '有效' : '无效';
            return s;
        }
    }, {
        title: '操作',
        dataIndex: 'option',
        valueType: 'option',
        width: 90,
        render: (_, record) => [
            <a
                key='config'
                onClick={() => {
                    showEditModal(record);
                }}
            >
                编辑
            </a>
        ],
        fixed: 'right'
    }];

    return (
        <PageContainer>
            <ProTable<TableListItem>
                headerTitle='查询表格'
                actionRef={actionRef}
                rowKey='id'
                search={false}
                size='small'
                options={{ density: false, fullScreen: false }}
                pagination={{
                    pageSize: 10
                }}
                toolBarRender={() => [ //渲染工具栏
                    <Button
                        type='primary'
                        key='primary'
                        onClick={() => {
                            setVisible(true);
                            setCurrent(undefined);
                        }}
                    >
                        <PlusOutlined /> 新增
                    </Button>,
                    <Button
                        onClick={() => {
                            let count = selectedRows.length;
                            Modal.confirm({
                                title: '删除',
                                content: '确定删除选择的' + count + '条数据吗？',
                                okText: '确认',
                                cancelText: '取消',
                                onOk: async () => {
                                    await handleRemove(selectedRows);
                                }
                            });
                        }}
                        disabled={selectedRows.length > 0 ? false : true}
                    >
                        <DeleteOutlined /> 删除
                    </Button>
                ]}
                request={async (params, sorter, filter) => {
                    const { code, data, total } = await queryRule({
                        ...params,
                        ...sorter
                    });
                    return {
                        data,
                        success: code == 0,
                        total
                    }
                }}
                columns={columns}
                rowSelection={{
                    onChange: (_, selectedRows) => {
                        setSelectedRows(selectedRows);
                    }
                }}
                scroll={{ x: columns.length * 150, y: undefined }}
            />

            {/* 弹框 */}
            <EditModal
                visible={visible}
                current={current}
                onCancel={handleCancel}
                onSubmit={handleSubmit}
            />
        </PageContainer>
    );
};

export default TableList;
