import { UserInfo } from "@/models/index.type";
export interface Element {
  webkitRequestFullscreen?: () => void;
  webkitExitFullscreen?: () => void;
  mozRequestFullScreen?: () => void;
  mozCancelFullScreen?: () => void;
  msRequestFullscreen?: () => void;
  msExitFullscreen?: () => void;
}
export interface Props {
  collapsed: boolean; // 菜单的状态
  userinfo: UserInfo; // 用户信息
  onToggle: () => void; // 菜单收起与展开状态切换
  onLogout: () => void; // 退出登录
}