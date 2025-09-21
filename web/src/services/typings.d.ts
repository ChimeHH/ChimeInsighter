// @ts-ignore
/* eslint-disable */

declare namespace API {
  type CommonResponse = {
    status_code: number;
    error?: {
      error_code: number;
      message: string;
    };
  };

  type Response<T> = {
    data?: T;
  } & CommonResponse;

  type Token = {
    access_token: string;
    refresh_token: string;
  };

  type JWTUser = {
    iat: number;
    nbf: number;
    jti: string;
    exp: number;
    identity: string;
    fresh: boolean;
    type: string;
    user_claims: {
      username: string;
      stamp: string;
      role: string;
      session_expiry: number;
    };
  }

  type LoginInfo = {
    auth?: {
      access_token: string;
      refresh_token: string;
    };
    user?: JWTUser;
  };

  type MenuTree = {
    component: string;
    icon: string;
    id: number;
    name: string;
    parentId: number;
    path: string;
    routes?: MenuTree[];
    hideInMenu?: boolean;
  };

  type MenuData = {
    children?: MenuData[];
    icon?: string | React.ReactNode;
    key: string;
    label: string;
    title?: string;
  };

  type User = {
    username: string;
    role: string;
    password?: string;
    active: boolean; // 添加 active 参数
  };
}
