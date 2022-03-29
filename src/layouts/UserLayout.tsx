/** 基础页面结构 - 有头部，有底部，有侧边导航 **/

// ==================
// 所需的第三方库
// ==================
import React, { useState, useCallback, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useMount } from "react-use";
import { Layout } from "antd";
import { useNavigate } from "react-router-dom";
import BreadTab from '../components/BreadTab'
import MenuCom from '../components/Menu'
import HeaderCom from '../components/Header'
import { useSelector, useDispatch } from "react-redux";
import { RootState, Dispatch } from "@/store";
import servicePath from '@/utils/apis/apiUrl'
import axios from '@/utils/axios'
import './index.sass'

const { Content } = Layout;

// ==================
// 本组件
// ==================
export default function AppContainer(): JSX.Element {
  const userInfo = useSelector((state: RootState) => state.userInfo.userinfo);
  const navigate = useNavigate()
  // menusData
  const [data, setData] = useState([]); // 菜单栏是否收起
  const [menusData, setMenusData] = useState([]); // 菜单栏是否收起
  const [collapsed, setCollapsed] = useState(false); // 菜单栏是否收起
  // 退出登录
  // 生命周期 - 首次加载组件时触发
  
  const getMeuns = async() => {
    
    const hashObj: any = {}
    userInfo.menus.forEach((item: any) => {
      hashObj[item] = true
    })
    const tempArr: any = []
    if (data && data.length) {
      data.forEach((item: any) => {
        const { id } = item
        if (hashObj[id]) {
          tempArr.push(item)
        }
      })
    }
    setMenusData(tempArr)
  }
  useMount(async() => {
    const res: any = await axios.get(servicePath.getMenus);
    setData(res.data)
  })
  useEffect(() => {
    getMeuns()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])
  const onLogout = useCallback(() => {
    navigate('/login')
    localStorage.clear()
  }, [navigate]);
  return (
    <Layout className="layout-container" hasSider>
      <MenuCom
        data={menusData}
        collapsed={collapsed}
      />
      <Layout>
        <HeaderCom
          data={menusData}
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
          onLogout={onLogout}
        />
        <BreadTab
          menus={menusData}
        // history={props.history}
        />
        <Content className="content-container">
          <Outlet />
        </Content>
      </Layout>

    </Layout>
  );
}
