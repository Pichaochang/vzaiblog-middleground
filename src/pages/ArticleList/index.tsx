import React, { useState, useEffect } from 'react'
// import '../static/css/ArticleList.css'
import { useNavigate } from "react-router-dom";
import { Modal, Table, Tag, message, Button } from 'antd'
import servicePath from '@/utils/apis/apiUrl'
import axios from '@/utils/axios'
const { Column } = Table
const { confirm } = Modal
interface records {
  id: string,
  typeName?: string
}
function ArticleList(props:any) {
  const navigate = useNavigate();
  const [list, setList] = useState([])
  //得到文章列表

  const getList = () => {
    axios.get(servicePath.getArticleList).then((res:any) => {
      setList(res.list)
    })
  }
  //删除文章的方法
  const delArticle = (id:string) => {
    confirm({
      title: '确定要删除这篇博客文章吗?',
      content: '如果你点击OK按钮，文章将会永远被删除，无法恢复。',
      onOk() {
        axios(servicePath.delArticle + id).then(
          (res) => {
            message.success('文章删除成功')
            getList()
          }
        )
      },
      onCancel() {
        message.success('没有任何改变')
      },
    })
  }
  //修改文章
  const updateArticle = (id:string) => {
    navigate('/admin/article/' + id, { state: {title: '修改文章'} })

  }
  useEffect(() => {
    getList()
  }, [])
  return (
    <div>
      <Table dataSource={list} rowKey={(row:records)=>row.id }>
        <Column title="标题" dataIndex="title" key="title" ellipsis={true} />
        <Column
          title="介绍"
          dataIndex="introduce"
          key="introduce"
          ellipsis={true}
        />
        <Column title="发布时间" dataIndex="addTimeFormat" key="addTimeFormat" />
        <Column
          title="标签"
          dataIndex="typeName" key="typeName"
          render={(text, record:records) => <Tag color="blue">{record.typeName}</Tag>}
        ></Column>
        <Column
          title="操作"
          dataIndex="id" key="id"
          render={(text, record:records) => {
            return (
              <div>
                <Button type="link" onClick={() => { updateArticle(record.id) }}>编辑</Button>
                <Button type="link"  onClick={() => { delArticle(record.id) }}>删除</Button>
              </div>
            )
          }}
        ></Column>
      </Table>
      ,
    </div>
  )
}

export default ArticleList
