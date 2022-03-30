/**
 * 基础model
 * 在src/store/index.js 中被挂载到store上，命名为 app
 * **/

import { Dispatch } from "@/store";
import {
  UserInfo,
  AppState,
} from "./index.type";

const defaultState = {
  userinfo: {
    conditions: '',
    menus: [],
    phone: '',
    powers: [],
    roles: '',
    token: '',
    userId: '',
    userName: '',
  }
};
export const userInfo = {
  state: defaultState,
  reducers: {
    reducerUserInfo(state: any, payload: any):any {
      return {
        ...state,
        userinfo: payload,
      };
    },
    reducerLogout(state: any) {
      return {
        ...state,
        userinfo: {
          menus: [],
          roles: [],
          powers: [],
        },
      };
    },
  },

  effects: (dispatch: Dispatch) => ({
    /**
     * 设置用户信息
     * @param: {*} params
     * **/
    async setUserInfo(payload: UserInfo) {
       dispatch.userInfo.reducerUserInfo(payload);
      return 'success';
    },
  }),
};
