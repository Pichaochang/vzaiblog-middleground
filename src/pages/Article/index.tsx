import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import { marked } from 'marked'
import servicePath from '@/utils/apis/apiUrl'
import axios from '@/utils/axios'
import tools from '@/utils/tools'
import './index.sass'
import { Row, Col, Input, Select, Button, message, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select
const { TextArea } = Input
interface articleData {
  id: string | number,
  type_id: string,
  title: string,
  article_content: string,
  introduce: string,
  addTime: string | number,
}
interface records {
  id: string,
  typeName?: string,
  addressName: string,
  color: string
}
function AddArticle(props:any) {
  let type = 'production'
  if (window.location.hostname !== 'www.vzai.top') {
    type = 'develop'
  }
  const navigate = useNavigate();
  const queryParams = useParams()
  const [articleId, setArticleId] = useState('') // 文章的ID，如果是0说明是新增加，如果不是0，说明是修改
  const [articleTitle, setArticleTitle] = useState('') //文章标题
  const [articleContent, setArticleContent] = useState('') //markdown的编辑内容
  const [markdownContent, setMarkdownContent] = useState('预览内容') //html内容
  const [introducemd, setIntroducemd] = useState() //简介的markdown内容
  const [introducehtml, setIntroducehtml] = useState('等待编辑') //简介的html内容
  const [showDate, setShowDate] = useState('') //发布日期
  const [updateDate, setUpdateDate] = useState() //修改日志的日期
  const [typeInfo, setTypeInfo] = useState([]) // 文章类别信息
  const [selectedType, setSelectType] = useState('') //选择的文章类别
  const [addressSrc, setAddressSrc] = useState('') //选择的文章类别
  const uploadprops = {
    name: 'file',
    action: servicePath.uploadModeIsFile,
    data: { type },
    showUploadList: false,
    // headers: {
    //   authorization: 'authorization-text',
    // },
    onChange(info:any) {
      if (info.file.status === 'done') {
        setAddressSrc(info.file.response.data.address)
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    pedantic: false,
    sanitize: false,
    // tables: true,
    breaks: false,
    smartLists: true,
    smartypants: false,
  })

  const changeContent = (e:any) => {
    setArticleContent(e.target.value)
    let html = marked(e.target.value)
    setMarkdownContent(html)
  }

  const changeIntroduce = (e:any) => {
    setIntroducemd(e.target.value)
    let html = marked(e.target.value)
    setIntroducehtml(html)
  }
  //从中台得到文章类别信息
  const getTypeInfo = () => {
    axios.get(servicePath.getTypeInfo).then((res) => {
      if (res.data == '没有登录') {
        localStorage.removeItem('openId')
        navigate('/')
      } else {
        setTypeInfo(res.data)
      }
    })
  }
  const selectTypeHandler = (value:any) => {
    setSelectType(value)
  }
  //保存文章的方法
  const saveArticle = () => {
    // markedContent()  //先进行转换

    if (!selectedType) {
      message.error('必须选择文章类别')
      return false
    } else if (!articleTitle) {
      message.error('文章名称不能为空')
      return false
    } else if (!articleContent) {
      message.error('文章内容不能为空')
      return false
    } else if (!introducemd) {
      message.error('简介不能为空')
      return false
    }
    
    let dataProps:articleData = {
      id: '',
      type_id: '',
      title: '',
      article_content: '',
      introduce: '',
      addTime: ''
    } //传递到接口的参数
    dataProps.type_id = selectedType
    dataProps.title = articleTitle
    dataProps.article_content = articleContent
    dataProps.introduce = introducemd
    // let datetext = showDate.replace('-', '/') //把字符串转换成时间戳
    dataProps.addTime = new Date(showDate).getTime()
    // dataProps.addTimeFormat = showDate

    if (articleId === '') {
      // dataProps.view_count = Math.ceil(Math.random() * 100) + 1000
      axios.post(servicePath.addArticle, dataProps).then((res:any) => {
        setArticleId(res.data.insertId)
        if (res.code === 200) {
          message.success('文章保存成功')
        } else {
          message.error('文章保存失败')
        }
      })
    } else {
      dataProps.id = articleId
      axios.post(servicePath.updateArticle, dataProps).then((res:any) => {
        if (res.code === 200) {
          message.success('文章保存成功')
        } else {
          message.error('保存失败')
        }
      })
    }
  }
  const getArticleById = (id:string) => {
    axios(servicePath.getArticleById + id).then((res) => {
      //let articleInfo= res.data[0]
      setArticleTitle(res.data[0].title)
      setArticleContent(res.data[0].article_content)
      let html = marked(res.data[0].article_content)
      setMarkdownContent(html)
      setIntroducemd(res.data[0].introduce)
      let tmpInt = marked(res.data[0].introduce)
      setIntroducehtml(tmpInt)
      setShowDate(res.data[0].addTime)
      setSelectType(res.data[0].type_id)
    })
  }
  useEffect(() => {
    getTypeInfo()
    //获得文章ID
    let tmpId:string | undefined | number = queryParams.id
    if (tmpId && tmpId !== 'add') {
      setArticleId(tmpId)
      getArticleById(tmpId)
    }
  }, [])
  let dom = (<div >
    {addressSrc}
    <Button onClick={(e) => { window.open(addressSrc) }} type='primary'>打开</Button>
    <Button onClick={(e) => { tools.copyText(addressSrc) }}>复制</Button>
  </div>)
  return (
    <div>
      <Row gutter={5}>
        <Col span={18}>
          <Row gutter={10}>
            <Col span={16}>
              <Input
                value={articleTitle}
                placeholder="博客标题"
                onChange={(e) => {
                  setArticleTitle(e.target.value)
                }}
                size="large"
              />
            </Col>
            <Col span={8}>
              <Select
                value={selectedType}
                size="large"
                style={{ width: '100%' }}
                onChange={selectTypeHandler}
              >
                {typeInfo.map((item:records, index) => {
                  return (
                    <Option key={item.id} value={item.id}>
                      {item.typeName}
                    </Option>
                  )
                })}
              </Select>
            </Col>
          </Row>
          <br />
          <Row gutter={10}>
            <Col span={12}>
              <TextArea
                value={articleContent}
                className="markdown-content"
                rows={35}
                onChange={changeContent}
                onPressEnter={changeContent}
                placeholder="文章内容"
              />
            </Col>
            <Col span={12}>
              <div
                className="show-html"
                dangerouslySetInnerHTML={{ __html: markdownContent }}
              ></div>
            </Col>
          </Row>
        </Col>

        <Col span={6}>
          <Row gutter={10}>
            <Col span={24}>
              {/* <Button size="large">暂存文章</Button>&nbsp;  */}
              <Button type="primary" size="large" onClick={saveArticle}>
                发布文章
              </Button>
            </Col>

            {/* <Col span={24}>
              <div className="date-select">
                <DatePicker
                  format={dateFormat}
                  onChange={(date, dateString) => setShowDate(dateString)}
                  showTime
                  placeholder="发布日期"
                  size="large"
                  value={showDate?moment(new Date(showDate), dateFormat): undefined}
                />
              </div>
            </Col> */}

            <Col span={24}>
              <TextArea
                rows={4}
                value={introducemd}
                onChange={changeIntroduce}
                onPressEnter={changeIntroduce}
                placeholder="文章简介"
              />
              <div
                className="introduce-html"
                dangerouslySetInnerHTML={{
                  __html: '文章简介：' + introducehtml,
                }}
              ></div>
              <Upload {...uploadprops}>
                <Button icon={<UploadOutlined />}>上传文件</Button>
              </Upload>
              {addressSrc ? dom : ''}
            </Col>


          </Row>
        </Col>
      </Row>
    </div>
  )
}
export default AddArticle
