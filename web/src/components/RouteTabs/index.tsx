import React, { useRef, useState, useEffect } from 'react';
import { history } from 'umi';
import { PageContainer, RouteContext } from '@ant-design/pro-layout';
import type { RouteContextType, MenuDataItem } from '@ant-design/pro-layout';
import { Tabs, Dropdown } from 'antd';
import type { TabsProps } from 'antd/lib/tabs';
import type { MenuProps } from 'antd/lib/menu';
import style from './index.less';
import { useIntl } from 'umi';

const { TabPane } = Tabs;

type Props = {
  home: string;
};

type menuItem = {
  menu: MenuDataItem | undefined;
  isSeek: boolean;
};

type TabsItemProps = {
  title?: string;
  path?: string;
  active?: boolean;
  children?: React.ReactNode;
  closable: boolean;
};

enum TabMenuKey {
  Current = 'current',
  Others = 'others',
  All = 'all',
}

const getMenu = (
  rData: menuItem,
  menuData: MenuDataItem[] | undefined,
  layer: number,
  target?: string,
): menuItem => {
  if (target) {
    for (const i in menuData) {
      if (rData.menu) break;
      if (menuData[i].path == target && menuData[i].component) {
        rData = {
          menu: menuData[i],
          isSeek: true,
        };
        break;
      } else {
        if (menuData[i].children && Array.isArray(menuData[i].children)) {
          const _layer = layer + 1;
          rData = getMenu(rData, menuData[i].children, _layer, target);
        }
      }
    }
  }

  if (!target || (layer == 0 && !rData.isSeek)) {
    for (const i in menuData) {
      if (rData.menu) break;
      if (menuData[i].path && menuData[i].component) {
        rData = {
          menu: menuData[i],
          isSeek: true,
        };
        break;
      } else {
        if (menuData[i].children && Array.isArray(menuData[i].children)) {
          const _layer = layer + 1;
          rData = getMenu(rData, menuData[i].children, _layer);
        }
      }
    }
  }

  return rData;
};

const RouteTabs: React.FC<Props> = (props) => {
  const { children, home } = props;
  const routeContextRef = useRef<RouteContextType>();
  const [routeInt, setRouteInt] = useState<boolean>(true);
  const [tabList, setTabList] = useState<TabsItemProps[]>([]);
  const [activeKey, setActiveKey] = useState<string>();
  const [routeHome, setRouteHome] = useState<string>();
  const { formatMessage } = useIntl();

  const menuItems = [
    {
      key: TabMenuKey.Current,
      label: formatMessage({ id: 'app.tab.close.current' }),
    },
    {
      key: TabMenuKey.Others,
      label: formatMessage({ id: 'app.tab.close.others' }),
    },
    {
      key: TabMenuKey.All,
      label: formatMessage({ id: 'app.tab.close.all' }),
    },
  ];

  useEffect(() => {
    if (routeContextRef.current) {
      handleOnChange(routeContextRef.current);
    }
  }, [routeContextRef.current]);

  const initTabs = (routeContext: RouteContextType) => {
    const { menuData } = routeContext;
    if (tabList.length === 0 && menuData) {
      //获取第一个Tab，假如没有符合home的就取数组的第一个
      const { menu: firstTab } = getMenu(
        {
          menu: undefined,
          isSeek: false,
        },
        menuData,
        0,
        home,
      );

      if (firstTab) {
        const { path, locale } = firstTab;
        setRouteHome(path);

        const _first = {
          title: formatMessage({
            id: locale || '',
            defaultMessage: '',
          }),
          path,
          closable: false,
        };

        //获取网页当前路径
        //@ts-ignore
        const curPath = routeContext.location.pathname;
        //判断网页是否是在首页
        if (path == curPath) {
          setTabList([
            {
              ..._first,
              children,
              active: true,
            },
          ]);
          setActiveKey(path);
        } else {
          //获取网页路径的Tab
          const { menu: targetTab } = getMenu(
            {
              menu: undefined,
              isSeek: false,
            },
            menuData,
            0,
            curPath,
          );

          //判断获取的Tab的路径是否与网页当前路径相符（权限导致的判断）
          if (curPath == targetTab?.path) {
            setTabList([
              _first,
              {
                title: formatMessage({
                  id: targetTab?.locale || '',
                  defaultMessage: '',
                }),
                path: targetTab?.path,
                children,
                active: true,
                closable: true,
              },
            ]);
            setActiveKey(curPath);
          } else {
            //跳转到首页
            history.push({ pathname: path });
            setTabList([
              {
                ..._first,
                children,
                active: true,
              },
            ]);
            setActiveKey(path);
          }
        }
      } else {
        setRouteInt(false);
      }
    }
  };

  const handleOnChange = (routeContext: RouteContextType) => {
    //@ts-ignore
    const { location } = routeContext; //currentMenu
    const _path = location.pathname;

    if (tabList.length == 0) {
      if (routeInt) initTabs(routeContext);
      return;
    }

    let hasOpen = false;
    const _tabList: TabsItemProps[] = tabList?.map((item) => {
      if (_path === item.path || _path == '/' || _path === '/components') {
        hasOpen = true;
        return { ...item, active: true, children };
      } else {
        return { ...item, active: false };
      }
    });

    if (!hasOpen) {
      const title = formatMessage({
        id: routeContext.currentMenu?.locale || '',
        defaultMessage: ''
      });
      const path = _path;
      _tabList.push({
        title,
        path,
        children,
        active: true,
        closable: true,
      });
    }

    setTabList(_tabList);
    setActiveKey(_path);
  };

  const handleChange = (key: string) => {
    history.push(key);
  };

  const handleEdit = (targetKey: string, action: 'add' | 'remove') => {
    if (action == 'remove') {
      const idx = tabList.findIndex((item) => item.path == targetKey);

      const _tabList = tabList.slice();
      _tabList.splice(idx, 1);
      setTabList(_tabList);

      if (activeKey == targetKey) {
        let _idx = idx;
        idx == 0 ? _idx++ : _idx--;
        history.push({ pathname: tabList[_idx].path });
      }
    }
  };

  const handleRemoveOthers = (targetKey: string) => {
    const _tabList = tabList.filter((item) => item.path == targetKey || item.path == routeHome);
    setTabList(_tabList);

    if (activeKey != targetKey) {
      history.push({ pathname: targetKey });
    }
  };

  const handleRemoveAll = () => {
    const _tabList = tabList.filter((item) => item.path == routeHome);
    setTabList(_tabList);
    history.push({ pathname: routeHome });
  };

  const handleTabsMenuClick =
    (tabKey: string): MenuProps['onClick'] =>
    (event) => {
      const { key, domEvent } = event;
      domEvent.stopPropagation();

      if (key === TabMenuKey.Current) {
        handleEdit(tabKey, 'remove');
      } else if (key === TabMenuKey.Others) {
        handleRemoveOthers(tabKey);
      } else if (key === TabMenuKey.All) {
        handleRemoveAll();
      }
    };

  const initTabTitle = (title: string, key: string) => {
    if (key == routeHome) {
      return title;
    } else {
      return (
        <span
          onContextMenu={(e) => {
            e.preventDefault();
          }}
        >
          <Dropdown
            // overlay={<Menu onClick={handleTabsMenuClick(key)} items={menuItems} />}
            menu={{ onClick: handleTabsMenuClick(key), items: menuItems }}
            trigger={['contextMenu']}
          >
            <span>{title}</span>
          </Dropdown>
        </span>
      );
    }
  };

  return (
    <>
      <RouteContext.Consumer>
        {(value: RouteContextType) => {
          routeContextRef.current = value;
          return null;
        }}
      </RouteContext.Consumer>
      {routeInt ? (
        <Tabs
          className={style['route-tabs']}
          type="editable-card"
          hideAdd
          activeKey={activeKey}
          onChange={handleChange}
          onEdit={handleEdit as TabsProps['onEdit']}
        
          items={tabList?.map((item) => ({
            label: initTabTitle(item.title!, item.path!),
            key: item.path,
            closable: item.closable,
            children: <PageContainer>{item.children}</PageContainer>
          }
          ))}>
        </Tabs>
      ) : (
        children
      )}
    </>
  );
};

export default RouteTabs;
