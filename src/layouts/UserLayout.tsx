/** 基础页面结构 - 有头部，有底部，有侧边导航 **/

// ==================
// 所需的第三方库
// ==================
import React, { useState, useCallback, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useMount } from "react-use";
import { useDispatch } from "react-redux";
import { Layout } from "antd";
import { useNavigate } from "react-router-dom";
import BreadTab from '../components/BreadTab'
import MenuCom from '../components/Menu'
import HeaderCom from '../components/Header'
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import servicePath from '@/utils/apis/apiUrl'
import axios from '@/utils/axios'
import './index.sass'
import { UserInfo } from "@/models/index.type";
import { Dispatch } from "@/store";

const { Content } = Layout;
// ==================
// 本组件
// ==================
export default function AppContainer(): JSX.Element {
  const userInfo:UserInfo = useSelector((state: RootState) => state.userInfo.userinfo);
  const navigate = useNavigate()
  const [data, setData] = useState([]);
  const [menusData, setMenusData] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [menusTitleHash, setMenusTitleHash] = useState({});
  
  const getMeuns = async() => {
    const hashObj: any = {}
    const menus = userInfo.menus || []
    console.log(typeof userInfo)
    console.log(userInfo.menus)

    
    menus.forEach((item: string) => {
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
  interface resobj {
    data: []
  }
  interface resobj1 {
    url: string,
    title?: string,
  }
  interface test {
    [key: string]: string | undefined
  }
  useMount(async() => {
    const res: resobj = await axios.get(servicePath.getMenus);
    setData(res.data)
    console.log('res', res)
    const MenusTitleHash:test = {}
    res.data && res.data.forEach((item:resobj1)=> {
      
      if (!MenusTitleHash[item.url]) {
        MenusTitleHash[item.url] = item.title
      }
    })
    setMenusTitleHash(MenusTitleHash)

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
        userinfo={userInfo}
        data={menusData}
        menusTitleHash={menusTitleHash}
        collapsed={collapsed}
      />
      <Layout>
        <HeaderCom
          userinfo={userInfo}
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
          onLogout={onLogout}
        />
        <BreadTab
          menus={menusData}
        />
        <Content className="content-container">
          <Outlet />
        </Content>
      </Layout>

    </Layout>
  );
}
