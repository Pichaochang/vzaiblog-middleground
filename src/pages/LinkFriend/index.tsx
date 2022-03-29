import React, { useState, useEffect } from 'react'
import { Modal, Table, Tag, message, Button, Form, Input } from 'antd'
import servicePath from '@/utils/apis/apiUrl'
import axios from '@/utils/axios'
const { Column } = Table
interface records {
  id: string,
  typeName?: string,
  addressName: string,
  color: string
}
const { confirm } = Modal
function ArticleHeaderList(props:any) {
  const [list, setList] = useState([])
  const [visible, setVisible] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [form] = Form.useForm();
  const [singleRecord, setSingleRecord] = useState({id: ''})
  const formTailLayout = {
    wrapperCol: { span: 8, offset: 4 },
  };
  //得到文章列表

  const getList = () => {
   axios.get(servicePath.getFriendLink).then((res) => {
      setList(res.data)
    })
  }
  //删除文章的方法
  const delHeaderType = (id:string) => {
    confirm({
      title: '确定要删除地址吗?',
      content: '如果你点击OK按钮，地址将会永远被删除，无法恢复。',
      onOk() {
       axios(servicePath.delFriendLink + id).then(
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
      if (isEdit) {
        values.id = singleRecord.id
       axios.post(servicePath.updateFriendLink, values).then(
          (res) => {
            getList()
            setVisible(false)
            setIsEdit(false)
          }
        )
      } else {
       axios.post(servicePath.addFriendLink, values).then(
          (res) => {
            getList()
            setVisible(false)
            setIsEdit(false)
          }
        )
      }
    })      
  }
  const handleCancel = () => {
    form.resetFields();
    setVisible(false)
    setIsEdit(false)
  }
  //修改文章
  const updateHeaderType = (record:records) => {
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
        <Column title="名字" render={(text, record:records) => <Tag color={record.color || 'blue'}>{record.addressName}</Tag>}></Column>
        <Column title="地址" dataIndex="address" />
        <Column title="排序" dataIndex="orderNum" />
        <Column
          title="操作"
          render={(text, record:records) => {
            return (
              <div>
                <Button type="link" onClick={() => { updateHeaderType(record) }}>编辑</Button>
                <Button type="link"  onClick={() => { delHeaderType(record.id) }}>删除</Button>
              </div>
            )
          }}
        ></Column>
      </Table>
      <Modal
        title={`${isEdit ? '编辑' : '新增'}文章类型`}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          {...formTailLayout}
          labelAlign='left'
          name="basic"
          form={form}
          initialValues={{ remember: true }}
        >
          <Form.Item
            label="链接地址"
            name="address"
            labelAlign='left'
            rules={[{ required: true, message: '请输入链接地址' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="链接名字"
            name="addressName"
            rules={[{ required: true, message: '请输入链接名字' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="color"
            name="color"
          ><Input /></Form.Item>
          <Form.Item
            label="排序"
            name="orderNum"
          ><Input /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ArticleHeaderList
