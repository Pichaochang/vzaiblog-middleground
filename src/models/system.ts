/**
 * 基础model,系统权限相关功能
 * 在src/store/index.js 中被挂载到store上，命名为 sysTEM
 * **/

import axios from "../utils/axios"; // 自己写的工具函数，封装了请求数据的通用接口
import { Dispatch } from "../store/index";
import servicePath from '../utils/apis/apiUrl'

import {
  Menu,
  Role,
  PowerTree,
  SysState,
  Res,
} from "./index.type";

const defaultState: SysState = {
  menus: [], // 所有的菜单信息（用于菜单管理，无视权限）
  roles: [], // 所有的角色信息（用于Model赋予项，无视权限）
  powerTreeData: [], // 分配权限treeTable组件所需原始数据
};

export const system = {
  state: defaultState,
  reducers: {
    // 保存所有菜单数据
    reducerSetMenus(state: SysState, payload: Menu[]): SysState {
      return { ...state, menus: payload };
    },
    // 保存所有角色数据
    reducerSetRoles(state: SysState, payload: Role[]): SysState {
      return { ...state, roles: payload };
    },

    // 保存所有权限数据
    reducerSetAllPowers(state: SysState, payload: PowerTree[]): SysState {
      return { ...state, powerTreeData: payload };
    },
  },

  effects: (dispatch: Dispatch) => ({
    /**
     * 获取所有菜单
     * **/
    async getMenus(): Promise<Res> {
      const res: Res | any = await axios.get(servicePath.getMenus);
      dispatch.system.reducerSetMenus(res.data);
      return res;
    },
    /** 获取所有角色 **/
    async getAllRoles(): Promise<Res> {
      const res: Res | any = await axios.post(servicePath.getAllRoles, { filters: {}, page: { size: 9999, current: 1 } });
      dispatch.system.reducerSetRoles(res.data);
      return res
    },
  }),
};
