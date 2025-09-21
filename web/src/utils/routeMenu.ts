import { dynamic } from 'umi';
import pathToRegexp from 'path-to-regexp';

/**
 * 根据url获取component
 * @param url 模板路径
 * @returns
 */
const getComponent = (url: string) => {
  return dynamic({
    loader: async () => import(/* webpackMode: 'eager' */ `@/pages/${url}.tsx`),
  });
};

//路由格式
type extraRoutesType = {
  id: number;
  name: string;
  path: string;
  component?: string;
  routes?: extraRoutesType[];
  children?: extraRoutesType[];
};

//格式化路由
export const parseRoutes = (asyncRouters: extraRoutesType[]) => {
  let Routers: any = [];
  if (asyncRouters && asyncRouters.length > 0) {
    Routers = asyncRouters.map((item: extraRoutesType) => {
      const obj = {
        name: item.name,
        path: item.path,
        component: item.component ? getComponent(item.component) : undefined,
        routes: item.routes ? parseRoutes(item.routes) : [],
      };
      if (obj.routes.length == 0) {
        delete obj.routes;
      }
      return obj;
    });

    //最开始插入跳转
    const arr = Routers[0].path.split('/');
    if (arr.length > 0) {
      let path = '/';
      if (arr.length > 3) {
        path = `/${arr[1]}`;
      }

      Routers.unshift({
        path,
        redirect: path === '/components' ? '/components/default' : Routers[0].path,
        exact: true,
      });
    }

    //最后插入一个404页面
    Routers.push({
      component: getComponent('404'),
    });
  }
  return Routers;
};

//获取menu key数组
export const getFlatMenuKeys = (menuData: API.MenuData[] = []): string[] => {
  let keys: string[] = [];
  menuData.forEach((item) => {
    keys.push(item.key);
    if (item.children) {
      keys = keys.concat(getFlatMenuKeys(item.children));
    }
  });
  return keys;
};

export const getMenuMatches = (flatMenuKeys: string[] = [], path: string): string[] => {
  return flatMenuKeys.filter((item) => item && pathToRegexp(item).test(path));
};

export function urlToList(url: string): string[] {
  if (url === '/') {
    return ['/'];
  }
  const urlList = url.split('/').filter((i) => i);
  return urlList.map((urlItem, index) => `/${urlList.slice(0, index + 1).join('/')}`);
}

export const getSelectedMenuKeys = (pathname: string, flatMenuKeys: string[]) => {
  return urlToList(pathname)
    .map((itemPath) => getMenuMatches(flatMenuKeys, itemPath).pop())
    .filter((item) => item) as string[];
};

export const getDefaultCollapsedSubMenus = (pathname: string, flatMenuKeys: string[]) => {
  return urlToList(pathname)
    .map((item) => getMenuMatches(flatMenuKeys, item)[0])
    .filter((item) => item)
    .reduce((acc, curr) => [...acc, curr], ['/']);
};
