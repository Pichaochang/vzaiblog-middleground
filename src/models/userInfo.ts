/**
 * 基础model
 * 在src/store/index.js 中被挂载到store上，命名为 app
 * **/

 import axios from "@/utils/axios"; // 自己写的工具函数，封装了请求数据的通用接口
 import { message } from "antd";
 import { Dispatch, RootState } from "@/store";
 import {
   Menu,
   Role,
   Power,
   MenuAndPower,
   UserInfo,
   AppState,
   Res,
 } from "./index.type";
 
 const defaultState: any = {
   userinfo: {
     roles: [], // 当前用户拥有的角色
     menus: [], // 当前用户拥有的已授权的菜单
     powers: [], // 当前用户拥有的权限数据
     
   }, // 当前用户基本信息
   powersCode: [], // 当前用户拥有的权限code列表(仅保留了code)，页面中的按钮的权限控制将根据此数据源判断
 };
 export const userInfo = {
   state: defaultState,
   reducers: {
     reducerUserInfo(state: AppState, payload: UserInfo) {
       return {
         ...state,
         userinfo: payload,
        //  powersCode: payload.powers.map((item) => item.code),
       };
     },
     reducerLogout(state: AppState) {
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
     async setUserInfo(params: UserInfo) {
       dispatch.userInfo.reducerUserInfo(params);
       return "success";
     },
   }),
 };
 