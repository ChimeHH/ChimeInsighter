import DefaultAvatar from '@/assets/DefaultAvatar.png';
import { logout } from '@/services/login';
import { LogoutOutlined } from '@ant-design/icons';
import { Avatar, Menu, message } from 'antd';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React, { useState } from 'react';
import { history, useModel, useIntl } from 'umi';
import ChangePWD from '../ChangePWD';
import CustomIcon from '../CustomIcon';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import { setLocale } from '@/.umi/plugin-locale/localeExports';

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

/**
 * 退出登录，并且将当前的 url 保存
 */
const handleLogout = async () => {
  // await outLogin();
  const { status_code, data, error } = await logout();
  if (status_code === 0 && data?.logout) {
    const { query = {}, search, pathname } = history.location;
    const { redirect } = query;
    // Note: There may be security issues, please note
    if (!window.location.pathname.includes('/login') && !redirect) {
      location.replace(`/login?redirect=${pathname + search}`);
    }
  
    return;
  }

  message.error(error?.message);
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = () => {
  const [show, setShow] = useState<boolean>(false);
  const { initialState, setInitialState } = useModel('@@initialState');
  const currentUser  = initialState?.currentUser;
  const { formatMessage } = useIntl();

  const onMenuClick = (event: MenuInfo) => {
    const { key } = event;

    if (key == 'changePWD') {
      setShow(true);
    }

    if (key == 'logout') {
      handleLogout();
      setInitialState((s) => ({ ...s, currentUser: undefined }));
    }

    if (key === 'zh' || key === 'en' || key === 'de' || key === 'fr' || key === 'ja' || key === 'ru' || key === 'ko' || key === 'zh-tw') {
      let locale = 'en-US';
      let language = 'English';

      switch (key) {
        case 'zh':
          locale = 'zh-CN';
          language = '中文';
          break;
        case 'de':
          locale = 'de-DE';
          language = 'Deutsch';
          break;
        case 'fr':
          locale = 'fr-FR';
          language = 'Français';
          break;
        case 'ja':
          locale = 'ja-JP';
          language = '日本語';
          break;
        case 'ru':
          locale = 'ru-RU';
          language = 'Русский';
          break;
        case 'ko':
          locale = 'ko-KR';
          language = '한국어';
          break;
        case 'zh-tw':
          locale = 'zh-TW';
          language = '繁體中文';
          break;
      }

      setLocale(locale);
      message.success(formatMessage({ id: 'menu.message.languageSwitched' }, { language }));
    }
  };

  const handleClose = (code?: number) => {
    setShow(false);
    if (code === 0) {
      message.success(formatMessage({ id: 'menu.message.passwordChanged' }));
      handleLogout();
    }
  };

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      <>
        <Menu.Item key="changePWD">
          <CustomIcon type="icon-xiugaimima1" customStyle={{ marginRight: 8 }} />
          {formatMessage({ id: 'menu.changePWD' })}
        </Menu.Item>
        <ChangePWD visible={show} onClose={handleClose} />
      </>
      <Menu.Divider />
      <Menu.SubMenu key="language" title={formatMessage({ id: 'menu.language' })}>
        <Menu.Item key="zh">{formatMessage({ id: 'menu.zh' })}</Menu.Item>
        <Menu.Item key="en">{formatMessage({ id: 'menu.en' })}</Menu.Item>
        <Menu.Item key="de">{formatMessage({ id: 'menu.de' })}</Menu.Item>
        <Menu.Item key="fr">{formatMessage({ id: 'menu.fr' })}</Menu.Item>
        <Menu.Item key="ja">{formatMessage({ id: 'menu.ja' })}</Menu.Item>
        <Menu.Item key="ru">{formatMessage({ id: 'menu.ru' })}</Menu.Item>
        <Menu.Item key="ko">{formatMessage({ id: 'menu.ko' })}</Menu.Item>
        <Menu.Item key="zh-tw">{formatMessage({ id: 'menu.zh-tw' })}</Menu.Item>
      </Menu.SubMenu>
      <Menu.Divider />
      <Menu.Item key="logout">
        <LogoutOutlined />
        {formatMessage({ id: 'menu.logout' })}
      </Menu.Item>
    </Menu>
  );

  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar size="small" className={styles.avatar} src={DefaultAvatar} alt="avatar" />
        <span className={`${styles.name} anticon`}>{currentUser?.username}</span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
