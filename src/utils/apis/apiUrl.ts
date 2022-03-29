import { sysConfig } from "../../config/config"
let servicePath = {
  checkLogin: sysConfig.baseUrl + '/admin/checkLogin',  //  检查用户名密码是否正确
  getTypeInfo: sysConfig.baseUrl + '/admin/getTypeInfo',  //  获得文章类别信息
  addArticle: sysConfig.baseUrl + '/admin/addArticle',  //  添加文章
  updateArticle: sysConfig.baseUrl + '/admin/updateArticle',  //  修改文章第api地址
  getArticleList: sysConfig.baseUrl + '/admin/getArticleList',  //  修改文章第api地址
  delArticle: sysConfig.baseUrl + '/admin/delArticle/',  //  删除文章
  getArticleById: sysConfig.baseUrl + '/admin/getArticleById/',  //  根据ID获得文章详情
  getArticleTypeList: sysConfig.baseUrl + '/admin/getArticleTypeList',
  addArticleType: sysConfig.baseUrl + '/admin/addArticleType', // 新增文章类型
  delArticleType: sysConfig.baseUrl + '/admin/delArticleType/',  //  删除文章类型
  updateArticleType: sysConfig.baseUrl + '/admin/updateArticleType',  //  修改文章类型
  
  getHeaderInfo: sysConfig.baseUrl + '/admin/getHeaderInfo',  //  获得文章类别信息
  addHeaderType: sysConfig.baseUrl + '/admin/addHeaderType', // 新增头部类型
  delHeaderType: sysConfig.baseUrl + '/admin/delHeaderType/',  //  删除头部类型
  updateHeaderType: sysConfig.baseUrl + '/admin/updateHeaderType',  //  修改头部类型

  getFriendLink: sysConfig.baseUrl + '/admin/getFriendLink',  //  获得文章类别信息
  addFriendLink: sysConfig.baseUrl + '/admin/addFriendLink', // 新增头部类型
  delFriendLink: sysConfig.baseUrl + '/admin/delFriendLink/',  //  删除头部类型
  updateFriendLink: sysConfig.baseUrl + '/admin/updateFriendLink',  //  修改头部类型
  uploadModeIsStream: sysConfig.baseUrl + '/admin/uploadModeIsStream',  //  修改头部类型
  uploadModeIsFile: sysConfig.baseUrl + '/admin/uploadModeIsFile',  //  

  
  getMenus: sysConfig.baseUrl + '/system/getMenus',  //  查询头部
  getMenuById: sysConfig.baseUrl + '/system/getMenuById',  //  查询头部
  addMenu: sysConfig.baseUrl + '/system/addMenu',  //  查询头部
  updateMenu: sysConfig.baseUrl + '/system/updateMenu',  //  查询头部
  deleteMenu: sysConfig.baseUrl + '/system/deleteMenu',  //  查询头部


  getAllRoles: sysConfig.baseUrl + '/system/getAllRoles',  //  查询头部
  addRole: sysConfig.baseUrl + '/system/addRole',  //  查询头部
  updateRole: sysConfig.baseUrl + '/system/updateRole',  //  查询头部
  deleteRole: sysConfig.baseUrl + '/system/deleteRole',  //  查询头部

  getAllMenusAndPowers: sysConfig.baseUrl + '/system/getAllMenusAndPowers',  //  查询头部
  getPowerByMenuId: sysConfig.baseUrl + '/system/getPowerByMenuId',
  addPower: sysConfig.baseUrl + '/system/addPower',  //  查询头部
  updatePower: sysConfig.baseUrl + '/system/updatePower',  //  查询头部
  deletePower: sysConfig.baseUrl + '/system/deletePower',  //  查询头部
  setPowersByRoleId: sysConfig.baseUrl + '/system/setPowersByRoleId',

  getAllUsers: sysConfig.baseUrl + '/system/getAllUsers',  //  查询头部
  setUserRoles: sysConfig.baseUrl + '/system/setUserRoles',  //  查询头部
  addUser: sysConfig.baseUrl + '/system/addUser',  //  查询头部
  updateUser: sysConfig.baseUrl + '/system/updateUser',  //  查询头部
  deleteUser: sysConfig.baseUrl + '/system/deleteUser',  //  查询头部


}
export default servicePath;