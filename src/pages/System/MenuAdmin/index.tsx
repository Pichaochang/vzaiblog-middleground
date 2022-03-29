/** 菜单管理页 **/

// ==================
// 第三方库
// ==================
import React, { useState, useCallback, useMemo } from "react";
import { useSetState, useMount } from "react-use";
import { useSelector, useDispatch } from "react-redux";
import servicePath from '@/utils/apis/apiUrl'
import axios from '@/utils/axios'
import {
  Tree,
  Button,
  Table,
  Tooltip,
  Popconfirm,
  Modal,
  Form,
  Select,
  Input,
  InputNumber,
  message,
  Divider,
} from "antd";
import {
  EyeOutlined,
  ToolOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  RedoOutlined
} from "@ant-design/icons";
import { cloneDeep } from "lodash";

// ==================
// 组件
// ==================
import { IconsData } from "@/utils/iconJson";
import Icon from "@/components/Icon";

// ==================
// 类型声明
// ==================
import {
  TableRecordData,
  Menu,
  ModalType,
  operateType,
  MenuParam,
} from "./index.type";
import { RootState, Dispatch } from "@/store/index";

// ==================
// CSS
// ==================
import "./index.sass";
import Item from "antd/lib/list/Item";
import { TreeNode } from "antd/lib/tree-select";

const { Option } = Select;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 19 },
  },
};

// ==================
// 本组件
// ==================
function MenuAdminContainer(props: any) {
  // const p = useSelector((state: RootState) => state.system.powersCode);
  const p = [
    "user:add",
    "user:update",
    "user:query",
    "user:delete", "user:role",
    "role:add", "role:up", "role:query", "role:power", "role:del",
    "power:add",
    "power:up",
    "power:query",
    "power:del",
    "menu:add",
    "menu:up",
    "menu:query",
    "menu:del",
  ]
  const dispatch = useDispatch<Dispatch>();

  const [form] = Form.useForm();

  const [data, setData] = useState<Menu[]>([]); // 所有的菜单数据（未分层级）
  const [loading, setLoading] = useState<boolean>(false); // 数据是否正在加载中

  // 模态框相关参数控制
  const [modal, setModal] = useSetState<ModalType>({
    operateType: "add",
    nowData: null,
    modalShow: false,
    modalLoading: false,
  });

  const [treeSelect, setTreeSelect] = useState<{ title?: string; id?: number }>(
    {}
  );

  // 生命周期 - 首次加载组件时触发
  useMount(() => {
    getData();
  });

  // 获取本页面所需数据
  const getData = async () => {
    if (!p.includes("menu:query")) {
      return;
    }
    setLoading(true);
    const res: any = await dispatch.system.getMenus();
    setData(res.data);
    setLoading(false);
  };

  /** 工具 - 递归将扁平数据转换为层级数据 **/
  const dataToJson = useCallback((one, data) => {
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

  /** 点击树目录时触发 **/
  const onTreeSelect = useCallback((keys, e) => {
    let treeSelect = {};
    if (e.selected) {
      // 选中
      treeSelect = { title: e.node.title, id: e.node.id };
    }
    setTreeSelect(treeSelect);
  }, []);

  /** 工具 - 根据parentID返回parentName **/
  const getNameByParentId = (id: number | null) => {
    const p = data.find((item) => item.id === id);
    return p ? p.title : undefined;
  };

  /** 新增&修改 模态框出现 **/
  const onModalShow = async (data: TableRecordData | null, type: operateType) => {
    await setModal({
      modalShow: true,
      nowData: data,
      operateType: type,
    });

    if (type === "add") {
      form.resetFields();
      if (treeSelect.id) {
        form.setFieldsValue({formParent: treeSelect.id})
      }
    } else {
      if (data) {
        form.setFieldsValue({
          formConditions: data.conditions,
          formDesc: data.desc,
          formIcon: data.icon,
          formSorts: data.sorts,
          formTitle: data.title,
          formUrl: data.url,
          formParent: data.parent
        });
      }
    }
  };

  /** 新增&修改 模态框关闭 **/
  const onClose = () => {
    setModal({
      modalShow: false,
    });
  };

  /** 新增&修改 提交 **/
  const onOk = async () => {
    if (modal.operateType === "see") {
      onClose();
      return;
    }
    const values = await form.validateFields();

    const params: MenuParam = {
      title: values.formTitle,
      url: values.formUrl,
      icon: values.formIcon,
      parent: values.formParent || null,
      sorts: values.formSorts,
      desc: values.formDesc,
      conditions: values.formConditions,
    };
    setModal({
      modalLoading: true,
    });
    if (modal.operateType === "add") {
      await axios.post(servicePath.addMenu, params)
      message.success("添加成功");

    } else {
      params.id = modal?.nowData?.id;
      await axios.post(servicePath.updateMenu, params)
      message.success("修改成功");
    }
    setModal({
      modalLoading: false,
    });
    setTimeout(() => {
      onClose();
      getData();
    }, 0);

  };

  /** 删除一条数据 **/
  const onDel = async (record: TableRecordData) => {
    await axios.post(`${servicePath.deleteMenu}`, {id :record.id})
    getData();
    message.success("删除成功");
  };

  // ==================
  // 属性 和 memo
  // ==================

  /** 处理原始数据，将原始数据处理为层级关系 **/
  const sourceData = useMemo(() => {
    const d: Menu[] = cloneDeep(data);
    d.forEach((item: any & { key: string }) => {
      item.key = String(item.id);
    });
    // 按照sort排序
    d.sort((a, b) => {
      return a.sorts - b.sorts;
    });
    return dataToJson(null, d) || [];
  }, [data, dataToJson]);

  /** 构建表格字段 **/
  const tableColumns = [
    {
      title: "序号",
      dataIndex: "serial",
      key: "serial",
    },
    {
      title: "图标",
      dataIndex: "icon",
      key: "icon",
      render: (v: string | null) => {
        return v ? <Icon type={v} /> : "";
      },
    },
    {
      title: "菜单名称",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "路径",
      dataIndex: "url",
      key: "url",
      render: (v: string | null) => {
        return v ? `/${v.replace(/^\//, "")}` : "";
      },
    },
    {
      title: "描述",
      dataIndex: "desc",
      key: "desc",
    },
    {
      title: "父级",
      dataIndex: "parent",
      key: "parent",
      render: (v: number | null) => getNameByParentId(v),
    },
    {
      title: "状态",
      dataIndex: "conditions",
      key: "conditions",
      render: (v: string) =>
        v === "1" ? (
          <span style={{ color: "green" }}>启用</span>
        ) : (
          <span style={{ color: "red" }}>禁用</span>
        ),
    },
    {
      title: "操作",
      key: "control",
      width: 120,
      render: (v: number, record: TableRecordData) => {
        const controls = [];

        p.includes("menu:query") &&
          controls.push(
            <span
              key="0"
              className="control-btn green"
              onClick={() => onModalShow(record, "see")}
            >
              <Tooltip placement="top" title="查看">
                <EyeOutlined />
              </Tooltip>
            </span>
          );
        p.includes("menu:up") &&
          controls.push(
            <span
              key="1"
              className="control-btn blue"
              onClick={() => onModalShow(record, "up")}
            >
              <Tooltip placement="top" title="修改">
                <ToolOutlined />
              </Tooltip>
            </span>
          );
        p.includes("menu:del") &&
          controls.push(
            <Popconfirm
              key="2"
              title="确定删除吗?"
              okText="确定"
              cancelText="取消"
              onConfirm={() => onDel(record)}
            >
              <span className="control-btn red">
                <Tooltip placement="top" title="删除">
                  <DeleteOutlined />
                </Tooltip>
              </span>
            </Popconfirm>
          );
        const result: JSX.Element[] = [];
        controls.forEach((item, index) => {
          if (index) {
            result.push(<Divider key={`line${index}`} type="vertical" />);
          }
          result.push(item);
        });
        return result;
      },
    },
  ];

  /** 构建表格数据 **/
  const tableData: any = useMemo(() => {
    return data
      .filter((item: Menu) => item.parent === (treeSelect.id || null))
      .map((item, index) => {
        return {
          key: index,
          id: item.id,
          icon: item.icon,
          parent: item.parent,
          title: item.title,
          url: item.url,
          desc: item.desc,
          sorts: item.sorts,
          conditions: item.conditions,
          serial: index + 1,
        };
      });
  }, [data, treeSelect.id]);

  return (
    <div className="page-menu-admin">
      <div className="l">
        <div className="title">
          目录结构
          <Button onClick={() => { getData() }} type="link">  <RedoOutlined /></Button>
        </div>
        <div>
          <Tree
            defaultExpandedKeys={["0"]}
            onSelect={onTreeSelect}
            selectedKeys={[String(treeSelect.id)]}
            treeData={[{ id: null, title: '根节点(一级节点)',}, ...sourceData]}
          ></Tree>
        </div>
      </div>
      <div className="r">
        <div className="searchBox">
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={() => onModalShow(null, "add")}
            disabled={!p.includes("menu:add")}
          >
            {`添加${treeSelect.title || "根级"}子菜单`}
          </Button>
        </div>
        <Table
          className="diy-table"
          columns={tableColumns}
          loading={loading}
          dataSource={tableData}
          pagination={{
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条数据`,
          }}
        />
      </div>

      <Modal
        title={`${{ add: "新增", up: "修改", see: "查看" }[modal.operateType]}`}
        visible={modal.modalShow}
        onOk={onOk}
        onCancel={onClose}
        confirmLoading={modal.modalLoading}
      >
        <Form form={form} initialValues={{ formConditions: "1" }}>
          <Form.Item
            label="父菜单"
            name="formParent"
            {...formItemLayout}
          >
            <Select disabled={modal.operateType === "see"}>
              {data.map(item => (
                <Option key={item.id} value={item.id}>{item.title}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="菜单名"
            name="formTitle"
            {...formItemLayout}
            rules={[
              { required: true, whitespace: true, message: "必填" },
              { max: 12, message: "最多输入12位字符" },
            ]}
          >
            <Input
              placeholder="请输入菜单名"
              disabled={modal.operateType === "see"}
            />
          </Form.Item>
          <Form.Item
            label="菜单链接"
            name="formUrl"
            {...formItemLayout}
            rules={[{ required: true, whitespace: true, message: "必填" }]}
          >
            <Input
              placeholder="请输入菜单链接"
              disabled={modal.operateType === "see"}
            />
          </Form.Item>
          <Form.Item label="图标" name="formIcon" {...formItemLayout}>
            <Select
              dropdownClassName="iconSelect"
              disabled={modal.operateType === "see"}
            >
              {IconsData.map((item, index) => {
                return (
                  <Option key={index} value={item}>
                    <Icon type={item} />
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label="描述"
            name="formDesc"
            {...formItemLayout}
            rules={[{ max: 100, message: "最多输入100位字符" }]}
          >
            <TextArea
              rows={4}
              disabled={modal.operateType === "see"}
              autoSize={{ minRows: 2, maxRows: 6 }}
            />
          </Form.Item>
          <Form.Item
            label="排序"
            name="formSorts"
            {...formItemLayout}
            rules={[{ required: true, message: "请输入排序号" }]}
          >
            <InputNumber
              min={0}
              max={99999}
              style={{ width: "100%" }}
              disabled={modal.operateType === "see"}
            />
          </Form.Item>
          <Form.Item
            label="状态"
            name="formConditions"
            {...formItemLayout}
            rules={[{ required: true, message: "请选择状态" }]}
          >
            <Select disabled={modal.operateType === "see"}>
              <Option value={"1"}>
                启用
              </Option>
              <Option value={"0"}>
                禁用
              </Option>
            </Select>
          </Form.Item>
          {modal.operateType === "add" ? (
            <Form.Item label="赋予" {...formItemLayout}>
              <span style={{ color: "green" }}>
                新增菜单后请前往角色管理将菜单授权给相关角色
              </span>
            </Form.Item>
          ) : null}
        </Form>
      </Modal>
    </div>
  );
}

export default MenuAdminContainer;
