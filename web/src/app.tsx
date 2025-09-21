import { useModel, history, getIntl } from 'umi';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import type { RequestOptionsInit, ResponseError } from 'umi-request';
import { message } from 'antd';
import { PageLoading } from '@ant-design/pro-layout';
import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import defaultSettings from '../config/defaultSettings';
// import { getMenuTree } from '@/services/routeMenu';
import { parseRoutes } from '@/utils/routeMenu';
import { getLoginInfo, removeLoginInfo, setLoginInfo } from './utils/common';
import defaultRoutes from '../config/defaultRoutes';
import { refreshToken } from './services/login';

const { formatMessage } = getIntl();

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

//动态路由
let authRoutes: API.MenuTree[] = [];

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.User;
  loading?: boolean;
  menuItem?: API.MenuTree[];
}> {
  const loginInfo = getLoginInfo();
  if (!loginInfo) {
    history.replace('/login');
  }

  // console.log('getInitialState loginInfo: ', loginInfo);
  const refreshTokenStr = loginInfo?.auth?.refresh_token;
  
  if (history.location.pathname !== '/login' && refreshTokenStr) {    
    try {
      const res = await refreshToken(refreshTokenStr);    
      if(res?.data) {
        loginInfo.auth = res.data;
        setLoginInfo(loginInfo);
        const jwtUserInfo = JSON.parse(
          decodeURIComponent(encodeURIComponent(window.atob(res.data?.access_token.split('.')[1]))),
        ) as API.JWTUser;

        
        // console.log("getInitialState (not login) defaultSettings: ", defaultSettings);
        // console.log("getInitialState (not login) authRoutes", authRoutes);

        return {
          currentUser: {
            username: jwtUserInfo.username,
            role: jwtUserInfo.role
          },
          settings: defaultSettings,
          menuItem: authRoutes,
        };
      } else {
        console.error("Refresh token failed: Server responded without data");
        removeLoginInfo();            
      }
    } catch (error) {
      console.error("Refresh token failed: ", error);
      removeLoginInfo();            
    }
    
    location.replace(`/login?redirect=${location.pathname + location.search}`);
  }
  
  // console.log("getInitialState defaultSettings: ", defaultSettings);
  // console.log("getInitialState authRoutes", authRoutes);
  return {
    settings: defaultSettings,
    menuItem: authRoutes,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  // console.log("RunTimeLayoutConfig: ", initialState)
  return {
    ...initialState?.settings,
    pure: true,
  };
};

export const patchRoutes = ({ routes }: { routes: any }) => {
  const parse = parseRoutes(authRoutes);
  if (process.env.NODE_ENV === 'production') {
    routes[0].routes[1].routes.push(...parse);
  } else {
    routes[1].routes[4].routes.push(...parse);
  }
};

// eslint-disable-next-line @typescript-eslint/ban-types
export const render = async (oldRender: Function) => {
  if (!window.location.pathname.includes('/login')) {
    // const { code, data } = await getMenuTree();
    // if (code == 0 && data) {
    //     authRoutes = data;
    // }
    authRoutes = defaultRoutes;
    // console.log("render authRoutes", authRoutes);
  }
  oldRender();
};

//请求拦截
/** 异常处理程序
 * @see https://beta-pro.ant.design/docs/request-cn
 */
const errorHandler = async (error: ResponseError) => {
  const { response } = error;
  let tips = '';
  if (response && response.status) {
    // const errorText = codeMessage[response.status] || response.statusText;
    tips = formatMessage({ id: 'app.error.default' });
    try {
      const result: API.CommonResponse = await response.clone().json();
      if (result?.error?.message) {
        tips = result.error.message;
      }
    } catch (e) {}
  }

  if (!response) {
    tips = formatMessage({ id: 'app.error.network' });
  }

  if (tips) {
    message.error(tips);
  }

  throw error;
};

const setTokenInRequest = (url: string, options: RequestOptionsInit) => {
  const loginInfo = getLoginInfo();
  if (loginInfo?.auth?.access_token && url && !url.includes('/login')) {
    return {
      url,
      options: {
        ...options,
        headers: {
          Authorization: 'Bearer ' + loginInfo?.auth?.access_token,
          ...options.headers,
        },
      },
    };
  }
  return {
    url,
    options,
  };
};

const handleLoginExpired = async (response: Response) => {
  try {
    // const result: API.CommonResponse = await response.clone().json();
    const { pathname } = window.location;
    if (
      // result?.error?.error_code === 18 &&
      !response.url.includes('/login') &&
      !pathname.includes('/login') &&
      response.status === 401
    ) {
      removeLoginInfo();
      location.replace(`/login?redirect=${location.pathname + location.search}`);
      message.error(formatMessage({ id: `app.error.login.expired` }));
    }
  } catch (error) {}
  return response;
};

// https://umijs.org/zh-CN/plugins/plugin-request
export const request: RequestConfig = {
  errorHandler,
  requestInterceptors: [setTokenInRequest],
  // responseInterceptors: [handleLoginExpired],
};
