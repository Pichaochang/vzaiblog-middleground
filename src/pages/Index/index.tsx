/** Login登录页 **/

// ==================
// 所需的各种插件
// ==================
import { useState, useEffect, } from 'react'
import { useNavigate } from "react-router-dom";
import servicePath from '@/utils/apis/apiUrl'
import axios from '@/utils/axios'

// ==================
// 所需的所有组件
// ==================
import { Card, Input, Button, Spin, message } from 'antd'
// ==================
// CSS
// ==================
import css from './login.module.sass'

// ==================
// 类型声明
// ==================

interface loginRes {
  code: number,
  message?: string | any,
  token?: string | any
}
function Index(props:any):JSX.Element {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {}, [])
  const navigate = useNavigate();
  const checkLogin = async() => {

    if (!userName) {
      message.error('用户名不能为空')
      return false
    } else if (!password) {
      message.error('密码不能为空')
      return false
    }
    let dataProps = {
      userName: userName,
      password: password,
    }
    setIsLoading(true)
    const res:loginRes = await axios.post(servicePath.checkLogin, dataProps)
      setIsLoading(false)
      if (res.code === 200) {
        localStorage.setItem('tag_id', res.token)
        return navigate('/admin')
      } else {
        message.error('用户名密码错误')
      }
      setIsLoading(false)
  }

  return (
    <div className={css["page-login"]}>
      <div className={css["canvasBox"]}>
      </div>
      <Spin tip="Loading..." spinning={isLoading}>
        <Card title="干饭前端工程师" bordered={true} headStyle={{ 'textAlign': 'center' }}>
          <Input
            id="userName"
            size="large"
            placeholder="请输入账号"
            onChange={(e) => {
              setUserName(e.target.value)
            }}
          />
          <br />
          <br />
          <Input.Password
            id="password"
            size="large"
            placeholder="请输入密码"
            onChange={(e) => {
              setPassword(e.target.value)
            }}
          />
          <br />
          <br />
          <Button type="primary" size="large" block onClick={checkLogin}>
            登 录
          </Button>
        </Card>
      </Spin>
    </div>
  )
}

export default Index
