// ==================
// 第三方库
// ==================
import { lazy, Suspense, useEffect,  } from "react";
import { RouteObject, useRoutes, useLocation, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { message } from "antd";
import { Dispatch } from "@/store";

// 组件
// ==================
import Login from '../pages/Login'
import Index from '../pages/Index'
import UserLayout from '../layouts/UserLayout'
import ArticleHeaderList from '../pages/ArticleHeaderList'
import ArticleList from '../pages/ArticleList'
import ArticleTypeList from '../pages/ArticleTypeList'
import LinkFriend from '../pages/LinkFriend'
import Article from '../pages/Article'
import MenuAdmin from '../pages/System/MenuAdmin'
import PowerAdmin from '../pages/System/PowerAdmin'
import RoleAdmin from '../pages/System/RoleAdmin' 
import UserAdmin from '../pages/System/UserAdmin'
const NotFound = lazy(() => import('../pages/ErrorPages/404'))

// 全局提示只显示2秒
message.config({
  duration: 2,
});

function RouterCom(props: any): JSX.Element {
  const dispatch = useDispatch<Dispatch>();

  useEffect(() => {
    const userTemp = localStorage.getItem("userInfo");
    /**
     * sessionStorage中有user信息，但store中没有
     * 说明刷新了页面，需要重新同步user数据到store
     * **/
    if (userTemp) {
      dispatch.userInfo.setUserInfo(JSON.parse(userTemp));
    }
  }, [dispatch.userInfo]);
  function RequireAuth({ children }: { children: JSX.Element }) {
    let auth = localStorage.getItem("userInfo");;
    let location = useLocation();
    if (!auth) {
      // Redirect them to the /login page, but save the current location they were
      // trying to go to when they were redirected. This allows us to send them
      // along to that page after they login, which is a nicer user experience
      // than dropping them off on the home page.
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    const userInfo = JSON.parse(auth)
    // if (!userInfo.menus.includes()){
    //   return <Navigate to="/404" state={{ from: location }} replace />;
    // }
    return children;
  }
  let routes: RouteObject[] = [
    // RequireAuth UserLayout
    {
      path: "/",
      element: (
        <RequireAuth>
           <UserLayout />
        </RequireAuth>
      ),
      children: [
        { index: true, element: <Index /> },
        {
          path: "/admin/articleHeaderList",
          element: <ArticleHeaderList />,
        },
        {
          path: "/admin/articleList",
          element: <ArticleList />,
        },
        {
          path: "/admin/articleTypeList",
          element: <ArticleTypeList />,
        },
        {
          path: "/admin/linkFriend",
          element: <LinkFriend />,
        },
        {
          path: "/admin/article/:id",
          element: <Article />,
        },
        {
          path: "system/menuAdmin",
          element: <MenuAdmin/>
        },
        {
          path: "system/powerAdmin",
          element: <PowerAdmin/>
        },
        {
          path: "system/roleAdmin",
          element: <RoleAdmin/>
        },
        {
          path: "system/userAdmin",
          element: <UserAdmin/>
        },
        { path: "*", element: <Suspense fallback={null}><NotFound /></Suspense> }
      ],
    },
    {
      path: "/login",
      element: <Login/>
    },
  ]
  let element:any = useRoutes(routes)
  return (
    <>
      {element}
    </>
  )

}
export default RouterCom