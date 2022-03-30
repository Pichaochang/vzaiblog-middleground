/** 左侧导航 **/


// ==================
// 第三方库
// ==================
import { useState, useEffect, useCallback, useMemo } from "react";
import { useMount } from "react-use";
import { Layout, Menu as MenuAntd } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { cloneDeep } from "lodash";

// ==================
// 自定义的东西
// ==================
import "./index.sass";

// ==================
// 类型声明
// ==================
import { Menu } from "@/models/index.type";

const { Sider } = Layout;
const { SubMenu, Item } = MenuAntd;

// interface Props {
//   data: Menu[]; // 所有的菜单数据
//   collapsed: boolean; // 菜单咱开还是收起
//   history: History;
//   location: Location;
// }

// ==================
// 本组件
// ==================
export default function MenuCom(props: any): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation()
  const [data, setData] = useState<Menu[]>([]); // 所有的菜单数据（未分层级）
  const [chosedKey, setChosedKey] = useState<string[]>([]); // 当前选中
  const [openKeys, setOpenKeys] = useState<string[]>([]); // 当前需要被展开的项
  // 生命周期 - 首次加载组件时触发
  useMount(async() => {
    // const res: any = await axios.get(servicePath.getMenus);
    setData(props.data);
    console.log('props.data', props.data)
    // setMenusTitleHash(props.menusTitleHash)
  });
  // 当页面路由跳转时，即location发生改变，则更新选中项
  useEffect(() => {
    const paths = location.pathname.split("/").filter((item:any) => !!item);
    setChosedKey([location.pathname]);
    setOpenKeys(paths.map((item:any) => `/${item}`));
  }, [location]);
  useEffect(() => {
    setData(props.data);
  }, [props.data]);
  // ==================
  // 私有方法
  // ==================
  // 菜单被选择
  const onSelect = (e:any) => {
    const title:any = props.menusTitleHash && props.menusTitleHash[e.key]
    navigate(e.key, { state: { title } });
  }

  // 工具 - 递归将扁平数据转换为层级数据
  const dataToJson = useCallback((one, data): Menu[] => {
    let kids;
    if (!one) {
      // 第1次递归
      kids = data.filter((item: Menu) => !item.parent);
    } else {
      kids = data.filter((item: Menu) => item.parent === one.id);
    }
    kids.forEach((item: Menu) => (item.children = dataToJson(item, data)));
    return kids.length ? kids : null;
  }, []);

  // 构建树结构
  const makeTreeDom = useCallback((data: Menu[]): JSX.Element[] => {
    return data.map((item: Menu) => {
      if (item.children) {
        return (
          <SubMenu
            key={item.url}
            title={
              !item.parent && item.icon ? (
                <span>
                  {/* <Icon type={item.icon} /> */}
                  <span>{item.title}</span>
                </span>
              ) : (
                item.title
              )
            }
          >
            {makeTreeDom(item.children)}
          </SubMenu>
        );
      } else {
        return (
          <Item key={item.url}>
            {/* {!item.parent && item.icon ? <Icon type={item.icon} /> : null} */}
            <span>{item.title}</span>
          </Item>
        );
      }
    });
  }, []);

  // ==================
  // 计算属性 memo
  // ==================

  /** 处理原始数据，将原始数据处理为层级关系 **/
  const treeDom: JSX.Element[] = useMemo(() => {
    const d: Menu[] = cloneDeep(data);
    // 按照sort排序
    d.sort((a, b) => {
      return a.sorts - b.sorts;
    });
    const sourceData: any = dataToJson(null, d) || [];
    const treeDom = makeTreeDom(sourceData);
    return treeDom;
  }, [data, dataToJson, makeTreeDom]);

  return (
    <Sider
      width={256}
      className="sider"
      trigger={null}
      collapsible
      collapsed={props.collapsed}
    >
      <div className={props.collapsed ? "menuLogo hide" : "menuLogo"}>
        <Link to="/">
          {/* <img src={ImgLogo} /> */}
          <div>React-Admin</div>
        </Link>
      </div>
      <MenuAntd
        theme="dark"
        mode="inline"
        selectedKeys={chosedKey}
        {...(props.collapsed ? {} : { openKeys })}
        onOpenChange={(keys: string[]) => setOpenKeys(keys)}
        onSelect={onSelect}
      >
        {treeDom}
      </MenuAntd>
    </Sider>
  );
}
