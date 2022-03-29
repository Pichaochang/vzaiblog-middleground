import React, { useState, useEffect } from 'react'
import { Modal, Table, Tag, message, Button, Form, Input } from 'antd'
import servicePath from '@/utils/apis/apiUrl'
import axios from '@/utils/axios'
const { Column } = Table
const { confirm } = Modal
interface records {
  id: string,
  typeName?: string,
  color: string
}
function ArticleList(props:any) {
  const [list, setList] = useState([])
  const [visible, setVisible] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [form] = Form.useForm();
  const [singleRecord , setSingleRecord] = useState({ id: ''})
  const formTailLayout = {
    wrapperCol: { span: 8, offset: 4 },
  };
  //得到文章列表

  const getList = () => {
    axios(servicePath.getTypeInfo).then((res:any) => {
      setList(res.data)
    })
  }
  //删除文章的方法
  const delArticleType = (id:string) => {
    confirm({
      title: '确定要删除这篇博客文章吗?',
      content: '如果你点击OK按钮，文章将会永远被删除，无法恢复。',
      onOk() {
        axios(servicePath.delArticleType + id).then(
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
  const handleOk = () => {
    form.validateFields().then((values) => {
      if(isEdit) {
        values.id = singleRecord.id
        axios.post(servicePath.updateArticleType, values).then(
          (res) => {
            getList()
            setVisible(false)
            setIsEdit(false)
          }
        )
      } else {
        axios.post(servicePath.addArticleType, values).then(
          (res) => {
            getList()
            setVisible(false)
            setIsEdit(false)
          }
        )
      }
    });
  }
  const handleCancel = () => {
    form.resetFields();
    setVisible(false)
    setIsEdit(false)
  }
  //修改文章
  const updateArticleType = (record:any) => {
    setVisible(true)
    setIsEdit(true)
    form.setFieldsValue({ ...record })
    setSingleRecord(record)

  }
  const showModal = () => {
    setVisible(true)
  }
  useEffect(() => {
    getList()
  }, [])
  return (
    <div>
      <Button onClick={() => { showModal() }}>新增</Button>
      <Table dataSource={list} rowKey="id">
        <Column title="标签" render={(text, record:records) => <Tag color={record.color || 'blue'}>{record.typeName}</Tag>}></Column>
        <Column title="排序" dataIndex="orderNum"/>
        {/* <Column title="图标" dataIndex="icon"></Column> */}
        <Column title="颜色" dataIndex="color"></Column>
        <Column
          title="操作"
          render={(text, record:records) => {
            return (
              <div>
                <Button type="link" onClick={() => { updateArticleType(record) }}>编辑</Button>
                <Button type="link"  onClick={() => { delArticleType(record.id) }}>删除</Button>
              </div>
            )
          }}
        ></Column>
      </Table>
      <Modal
        title={`${isEdit ? '编辑':'新增'}文章类型`}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          {...formTailLayout}
          labelAlign='left'
          name="basic"
          form={form}
          initialValues={{ color: '#1890ff' }}
        >
          <Form.Item
            label="标签"
            name="typeName"
            labelAlign='left'
            rules={[{ required: true, message: '请输入标签' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="排序"
            name="orderNum"
          >
            <Input />
          </Form.Item>
          {/* <Form.Item
            label="图标"
            name="icon"
          ><Input /></Form.Item> */}
          <Form.Item
            label="颜色"
            name="color"
          ><Input /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ArticleList
