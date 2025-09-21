import { AccountLogin } from '@/services/login';
import useUrlState from '@ahooksjs/use-url-state';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-form';
import { useLocalStorageState } from 'ahooks';
import { Form } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { useIntl } from 'umi';
import { fetchVendorInfo } from '@/services/systemInfo';

import logo from '@/assets/logo.svg';
import Footer from '@/components/Footer';

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const [, setLoginInfo] = useLocalStorageState('loginInfo');
  const [pathInfo] = useUrlState<{ redirect: string }>();
  const { formatMessage } = useIntl();

  const [vendorInfo, setVendorInfo] = useState<{ title: string; subTitle: string } | null>(null);

  useEffect(() => {
    setLoginInfo(undefined);
    
    const loadVendorInfo = async () => {
      const info = await fetchVendorInfo();
      // 在这里使用 formatMessage 来填充默认值
      setVendorInfo({
        title: info.title || formatMessage({ id: 'app.title' }),
        subTitle: info.subTitle || formatMessage({ id: 'app.subTitle' }),
      });
    };

    loadVendorInfo();
  }, [setLoginInfo, formatMessage]);

  const login = async () => {
    const values = form.getFieldsValue();
    const { status_code, data } = await AccountLogin({ ...values });
    if (status_code === 0 && data) {
      setLoginInfo((s: any) => ({ ...s, auth: data }));
      location.replace(pathInfo.redirect ? `${pathInfo.redirect}` : '/');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          logo={logo}
          form={form}
          title={vendorInfo?.title || formatMessage({ id: 'app.title' })}
          subTitle={vendorInfo?.subTitle || formatMessage({ id: 'app.subTitle' })}
          initialValues={{}}
          onFinish={async () => {
            login();
          }}
          submitter={{
            submitButtonProps: {
              id: 'loginBtn',
              size: 'large',
              style: { width: '100%' },
            },
            searchConfig: {
              submitText: formatMessage({ id: 'menu.login' }), // 使用国际化文本
            },
          }}
        >
          <ProFormText
            name="username"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined className={styles.prefixIcon} />,
            }}
            placeholder={formatMessage({ id: 'pages.login.username.placeholder' })}
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'pages.login.username.required' }),
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className={styles.prefixIcon} />,
            }}
            placeholder={formatMessage({ id: 'pages.login.password.placeholder' })}
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'pages.login.password.required' }),
              },
            ]}
          />
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
