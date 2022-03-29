/** 当前页面所需所有类型声明 **/

import { Role, UserBasicInfoParam } from "@/models/index.type";

export type { UserBasicInfoParam, Res } from "@/models/index.type";

// 列表table的数据类型
export type TableRecordData = {
  key?: number;
  id: number;
  serial: number; // 序号
  userName: string; // 用户名
  password: string; // 密码
  phone: string | number; // 手机
  email: string; // 邮箱
  desc: string; // 描述
  conditions: string; // 是否启用 1启用 0禁用
  control?: string; // 控制，传入的ID
  roles?: string[]; // 拥有的所有权限ID
};

export type Page = {
  current: number;
  size: number;
  total: number;
};

export type operateType = "add" | "see" | "up";

export type ModalType = {
  operateType: operateType;
  nowData: UserBasicInfoParam | null;
  modalShow: boolean;
  modalLoading: boolean;
};

export type SearchInfo = {
  userName: string | undefined; // 用户名
  conditions: string; // 状态
};

export type RoleTreeInfo = {
  roleData: Role[]; // 所有的角色数据
  roleTreeLoading: boolean; // 控制树的loading状态，因为要先加载当前role的菜单，才能显示树
  roleTreeShow: boolean; // 角色树是否显示
  roleTreeDefault: string[]; // 用于角色树，默认需要选中的项
};

