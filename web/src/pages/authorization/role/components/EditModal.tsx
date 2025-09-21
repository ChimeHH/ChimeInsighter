import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Radio, TreeSelect } from 'antd';
import type { TableListItem, MenuList, MenuTreeProp } from '../data';
import { getMenu } from '../service';

type Props = {
    visible: boolean;
    current: Partial<TableListItem> | undefined;
    onSubmit: (values: TableListItem) => void;
    onCancel: () => void;
};

const formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 }
};

const formatData = (data: MenuList[]) => {
    const arr: MenuTreeProp[] = data.map((item) => {
        const obj = {
            title: item.name,
            value: item.id,
            children: item.children ? formatData(item.children) : []
        }
        if (obj.children.length == 0) {
            //@ts-ignore
            delete obj.children;
        }
        return obj;
    });
    return arr;
};

const EditModal: React.FC<Props> = (props) => {
    const { visible, current, onCancel, onSubmit } = props;
    const [form] = Form.useForm();
    const [menuData, setMenuData] = useState<MenuTreeProp[]>([]);

    useEffect(() => {
        if (form && !visible) {
            form.resetFields();
        }
        if (visible) {
            getMenuList();
        }
    }, [visible]);

    useEffect(() => {
        if (current) {
            const _current = { ...current };
            _current.menuIds = (_current.menuIds as string).split(',').map(Number);
            if (_current.visibilityIds) {
                _current.visibilityIds = (_current.visibilityIds as string).split(',').map(Number);
            }
            form.setFieldsValue({
                ..._current
            });
        }
    }, [current]);

    const getMenuList = async () => {
        const { code, data } = await getMenu();
        if (code == 0 && data) {
            const _data = formatData(data?.[0]?.children);
            setMenuData(_data);
        }
    };

    const handleSubmit = () => {
        if (!form) return;
        form.submit();
    };

    const handleFinish = (values: Record<string, any>) => {
        if (onSubmit) {
            onSubmit(values as TableListItem);
        }
    };

    const modalFooter = { okText: '保存', onOk: handleSubmit, onCancel };

    return (
        <Modal
            title={`数据${current ? '编辑' : '添加'}`}
            width={640}
            bodyStyle={{ padding: '28px 0 0' }}
            destroyOnClose
            visible={visible}
            maskClosable={false}
            {...modalFooter}
            forceRender
        >
            <Form {...formLayout} form={form} onFinish={handleFinish}>
                <Form.Item name='id' label='ID' rules={[{ required: current ? true : false }]} hidden={current ? false : true}>
                    <Input placeholder='请输入' disabled />
                </Form.Item>
                <Form.Item name='name' label='名称' rules={[{ required: true }]}>
                    <Input placeholder='请输入' />
                </Form.Item>
                <Form.Item name='description' label='描述' rules={[{ required: true }]}>
                    <Input placeholder='请输入' />
                </Form.Item>
                <Form.Item name='menuIds' label='菜单权限' rules={[{ required: true }]}>
                    <TreeSelect
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        treeData={menuData}
                        multiple
                        treeDefaultExpandAll
                        style={{ width: '100%' }}
                        placeholder='请选择'
                        allowClear
                        showSearch
                        autoClearSearchValue
                        treeNodeFilterProp='title'
                    />
                </Form.Item>
                <Form.Item name='sequence' label='排序' rules={[{ required: true }]} initialValue={400000000}>
                    <InputNumber placeholder='请输入' min={0} max={400000000} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name='rowStatus' label='状态' rules={[{ required: true }]} initialValue={true}>
                    <Radio.Group>
                        <Radio value={true}>有效</Radio>
                        <Radio value={false}>无效</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item name='updatedAt' label='更新时间' rules={[{ required: current ? true : false }]} hidden>
                    <Input disabled />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditModal;
