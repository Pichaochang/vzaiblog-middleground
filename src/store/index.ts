/** 全局唯一数据中心 **/
/** 参考官网examples https://github.com/rematch/rematch/tree/main/examples **/


import { init, Models, RematchDispatch, RematchRootState } from "@rematch/core";

import { system } from "@/models/system";
import { userInfo } from "@/models/userInfo";

export interface RootModel extends Models<RootModel> {
  system: typeof system;
  userInfo: typeof userInfo;
}

const rootModel: RootModel = { system, userInfo };
const store = init({
  models: rootModel,
});

export type Store = typeof store;
export type Dispatch = RematchDispatch<RootModel>;
export type RootState = RematchRootState<RootModel>;

export default store;
