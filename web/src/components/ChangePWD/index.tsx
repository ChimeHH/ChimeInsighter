import React, { useEffect } from 'react';
import { useLocalStorageState } from 'ahooks';
import { Modal, Form, Input, message } from 'antd';
import { changePassword } from './service';

type Props = {
    visible: boolean;
    onClose: (string?: any) => void;
};

const formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 }
};

const ChangePWD: React.FC<Props> = (props) => {
    const { visible, onClose } = props;
    const [adminInfo] = useLocalStorageState<any>('adminInfo');
    const [form] = Form.useForm();

    useEffect(() => {
        if (form && !visible) {
            form.resetFields();
        }
        if (form && visible) {
            const userId = adminInfo?.id;
            form.setFieldsValue({
                userId
            });
        }
    }, [visible]);

    const handleSubmit = () => {
        if (!form) return;
        form.submit();
    };

    const handleFinish = async (values: any) => {
        const hide = message.loading(`正在修改`);

        const { status_code, error } = await changePassword(values);

        hide();

        if (status_code === 0) {
            onClose(status_code);
        } else {
            message.error(error?.message);
        }
    };

    const modalFooter = { okText: '确定', onOk: handleSubmit, onCancel: onClose };

    return (
        <Modal
            title={`密码修改`}
            width={640}
            bodyStyle={{ padding: '28px 0 0' }}
            destroyOnClose
            visible={visible}
            maskClosable={false}
            {...modalFooter}
            forceRender
        >
            <Form {...formLayout} form={form} onFinish={handleFinish}>
                <Form.Item name='current_password' label='原密码' rules={[{ required: true }]}>
                    <Input.Password placeholder='请输入' />
                </Form.Item>
                <Form.Item name='new_password' label='新密码' rules={[{ required: true }]}>
                    <Input.Password
                        placeholder='请输入'
                        onChange={() => {
                            if(form.getFieldValue('new_password2')) {
                                form.validateFields(['new_password2']);
                            }
                        }}
                    />
                </Form.Item>
                <Form.Item name='new_password2' label='新密码（重输入）' rules={[
                    { required: true },
                    ({ getFieldValue }) => ({
                        validator(role, value) {
                            if (!value) {
                                return Promise.resolve();
                            }
                            if (value !== getFieldValue('new_password')) {
                                return Promise.reject('两次密码不一样');
                            }
                            return Promise.resolve();
                        }
                    })
                ]}>
                    <Input.Password placeholder='请输入' />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ChangePWD;
