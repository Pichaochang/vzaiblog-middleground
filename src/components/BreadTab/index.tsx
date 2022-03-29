/** 通用Tab切换导航 **/
import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import "./index.sass";

const { TabPane } = Tabs;

export default function BreadCom(props: any): JSX.Element {
  
  const navigate = useNavigate()
  const location:any = useLocation()
  /** 根据当前location动态生成对应的面包屑 **/
  const [tabs, setTabs] = useState([
    {
      title: '首页',
      key: '/',
      url: '/',
      closable: false
    }
  ] as any[]);

  useEffect(() => {
    console.log(' props.menus',  props.menus)
    const pathNow = props.menus.find(
      (item:any) => item.url === location.pathname
    );

    if (pathNow && !tabs.find((item:any) => item.url === pathNow.url)) {
      setTabs((tabs:any[]) => {
        return [...tabs, pathNow];
      });
    }
    if (!pathNow) {
      const isTrue = tabs.find((item:any) => item.url === location.pathname)
      if (!isTrue) {
        setTabs((tabs:any[]) => {
          return [...tabs, {
            title: (location.state && location.state.title) || '404',
            url: location.pathname,
          }];
        });
      }
    }
  }, [location, location.pathname, location.state, props.menus, tabs]);

  function onTabChange(key: string): void {
    navigate(key);
    
  }

  function onEdit(targetKey: any, action: string) {
    if (action === "remove") {
      const removeIndex = tabs.findIndex((item) => item.url === targetKey);
      const resTabs = [...tabs];
      resTabs.splice(removeIndex, 1);

      const lastIndex = removeIndex - 1;

      // 如果全部关闭了，就跳转到主页
      if (!resTabs.length) {
        navigate("/");
      } else if (targetKey === location.pathname) {
        // 如果关闭的是当前页，就跳转到前一页，如果已经是第1页了，就跳转到新数组到第0项
        if (lastIndex >= 0) {
          navigate(resTabs[lastIndex].url);
        } else {
          navigate(resTabs[0].url);
        }
      }
      setTabs(resTabs);
    }
  }

  return (
    <div>
      <Tabs
        className="bread-tabs-com"
        onChange={onTabChange}
         onEdit={onEdit}
        activeKey={location.pathname}
        type="editable-card"
        hideAdd
        key="1"
      >
        {tabs.map((item:any) => {
        return <TabPane tab={item.title} key={item.url} closable={item.closable} ></TabPane>;
        })}
      </Tabs>
    </div>
  );
}
