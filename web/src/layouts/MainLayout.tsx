import React, { useState, useEffect } from 'react';
import { useModel, useIntl, history, Link } from 'umi';
import { Menu } from 'antd';
import ProLayout from '@ant-design/pro-layout';
import type { BasicLayoutProps as ProLayoutProps } from '@ant-design/pro-layout';
import RouteTabs from '@/components/RouteTabs';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import CustomIcon from '@/components/CustomIcon';
import {
  getFlatMenuKeys,
  getSelectedMenuKeys,
  getDefaultCollapsedSubMenus,
} from '@/utils/routeMenu';
import logo from '@/assets/logo.svg';
import { fetchVendorInfo } from '@/services/systemInfo';

interface BasicLayoutProps extends Omit<ProLayoutProps, 'children'> {
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
}

const MainLayout: React.FC<BasicLayoutProps> = (props) => {
  const { children, route, location } = props;
  const { initialState } = useModel('@@initialState');
  const [menuData, setMenuData] = useState<API.MenuData[]>([]);
  const [menuKeys, setMenuKeys] = useState<{ selectedKeys: string[]; openKeys: string[] }>({
    selectedKeys: [],
    openKeys: [],
  });

  const { formatMessage } = useIntl();

  // 新增的 state 存储供应商信息
  const [vendorInfo, setVendorInfo] = useState<{ title: string; subTitle: string; watermark?: string }>({
    title: '',
    subTitle: '',
    watermark: '',
  });

  // 获取供应商信息
  const loadVendorInfo = async () => {
    const info = await fetchVendorInfo();
    setVendorInfo(info);
  };

  const parseRouterMenu = (asyncRouters: API.MenuTree[], parentId?: string): API.MenuData[] => {
    let RouterMenus: any = [];
    
    if (asyncRouters && asyncRouters.length > 0) {
      RouterMenus = asyncRouters.map((item) => {
        if (item.hideInMenu) {          
          return null;
        }

        const nextParentId = `${parentId ? parentId + '.' : ''}${item.name}`;
        const messageId = `menu.${nextParentId}`;
        const obj: API.MenuData = {
          label: formatMessage({ id: messageId, defaultMessage: item.name }),
          key: item.path,
          children: item.routes ? parseRouterMenu(item.routes, nextParentId) : [],
          icon: item.icon ? <CustomIcon type={item.icon} /> : undefined,
        };
        if (obj.children?.length === 0) {
          delete obj.children;
        }        
    
        return obj;
      });
    }

    return RouterMenus.filter((item: any) => item);
  };

  const formatMenu = parseRouterMenu(initialState?.menuItem || []);

  useEffect(() => {
    setMenuData(formatMenu);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const flatMenuKeys = getFlatMenuKeys(formatMenu);
    const pathname = location?.pathname;
    const selectedKeys = getSelectedMenuKeys(pathname!, flatMenuKeys);
    const openKeys = getDefaultCollapsedSubMenus(pathname!, flatMenuKeys);
    setMenuKeys({
      selectedKeys,
      openKeys,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  // 在组件加载时调用 loadVendorInfo
  useEffect(() => {
    loadVendorInfo();
  }, []);

  // 动态设置 ProLayout 的 title 和 watermarkProps
  const pageTitle = vendorInfo.title || "";
  const waterMarkProps = vendorInfo.watermark ? {
    content: vendorInfo.subTitle || '',
    fontColor: 'rgba(24,144,255,0.15)',
  } : undefined; // 如果 watermark 无效，则不返回 watermarkProps

  return (
    <ProLayout
      navTheme="light"
      title={pageTitle} // 使用 vendorInfo 的 title
      logo={logo}
      fixedHeader
      fixSiderbar
      disableContentMargin
      route={route}
      location={location}
      rightContentRender={() => <RightContent />}
      waterMarkProps={waterMarkProps} // 动态设置 watermarkProps
      menuHeaderRender={(logoEle) => {
        return (
          <>
            {logoEle}
            <h1>{vendorInfo.to_whom || formatMessage({ id: 'app.vendor' })}</h1> {/* 使用 vendorInfo 的 vendor */}
          </>
        );
      }}
      formatMessage={formatMessage}
      breadcrumbRender={(routers = []) => {
        return [
          {
            path: '/',
            breadcrumbName: formatMessage({ id: 'menu.home', defaultMessage: 'home' }),
          },
          ...routers,
        ];
      }}
      itemRender={(routeItem, params, routes) => {
        const first = routes.indexOf(routeItem) === 0;
        return first ? (
          <Link to="/components/default">{routeItem.breadcrumbName}</Link>
        ) : (
          <span>{routeItem.breadcrumbName}</span>
        );
      }}
      footerRender={() => <Footer />}
      menuContentRender={() => {
        return (
          <Menu
            mode="inline"
            items={menuData}
            selectedKeys={menuKeys.selectedKeys}
            openKeys={menuKeys.openKeys}
            onOpenChange={(openKeys) => {
              const keys = openKeys.map((item) => item.toString());
              setMenuKeys({
                ...menuKeys,
                openKeys: keys,
              });
            }}
            onClick={(info) => {
              history.push(info.key);
            }}
          />
        );
      }}
    >
      {<RouteTabs home={'/components/default'}>{children}</RouteTabs>}
    </ProLayout>
  );
};

export default MainLayout;
