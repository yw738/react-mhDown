import React, {
  Component,
  useState,
  useImperativeHandle,
  useEffect,
} from "react";
import { useHistory } from "react-router-dom";

import {
  PageHeader,
  List,
  Button,
  Space,
  Row,
  Col,
  Checkbox,
  BackTop,
  Statistic,
  message,
  Drawer,
  Image,
  Spin,
  Popconfirm,
  Progress,
  Typography,
  Modal,
  Card,
} from "antd";
import "./index.css";
import {
  listApi,
  downLoadAWorlApi,
  detailApi,
  downLoadAllApi,
} from "./../../api/api.js";
import { DownloadOutlined } from "@ant-design/icons";

function throttle(fn, delay = 3000) {
  let valid = true;
  return function () {
    if (!valid) {
      //节流
      message.warning("不要点击的太频繁！");
      return false;
    }
    // 工作时间，执行函数并且在间隔期内把状态位设为无效
    valid = false;
    fn(...arguments);
    setTimeout(() => {
      valid = true;
    }, delay);
  };
}
const style = {
  height: 40,
  width: 40,
  lineHeight: "40px",
  borderRadius: 4,
  backgroundColor: "#1088e9",
  color: "#fff",
  textAlign: "center",
  fontSize: 14,
};
// 详情弹框
const DrawerCom = ({ childRef, aDown, isNowDown }) => {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({});

  useImperativeHandle(childRef, () => ({
    getValue: (item) => showDrawer(item),
  }));

  const showDrawer = (item) => {
    let { title, chapterId } = item;
    setVisible(true);
    setTitle(title);
    setList([]);
    setLoading(true);
    setParams(item);
    detailApi(chapterId).then((res) => {
      setList(res.data.data.content);
      setLoading(false);
    });
  };
  const onClose = () => {
    setVisible(false);
  };
  return (
    <>
      <Drawer
        title={title}
        placement="right"
        width={(window.innerWidth / 4) * 3}
        closable={false}
        onClose={onClose}
        visible={visible}
        footer={
          <div
            style={{
              textAlign: "left",
            }}
          >
            <Button
              onClick={() => aDown(params)}
              disabled={isNowDown}
              type="primary"
              icon={<DownloadOutlined />}
            >
              Download
            </Button>
          </div>
        }
      >
        <Spin spinning={loading}>
          {list.map((item, index) => (
            <Image
              key={index}
              preview={false}
              width={(window.innerWidth / 4) * 3 - 70}
              src={item}
            />
          ))}
        </Spin>
      </Drawer>
    </>
  );
};

/**
 * 下载进度弹框
 */
const DrawerProgress = ({ childRef, setDownStatus }) => {
  const [visible, setVisible] = useState(false);
  const [listData, setList] = useState({});
  const [progressNum, setProgressNum] = useState(0);
  const history = useHistory();
  //打开弹框的方法
  useImperativeHandle(childRef, () => ({
    getValue: (item) => showDrawer(item),
  }));
  useEffect(() => {
    //  // 打开一个 web socket  这里端口号和上面监听的需一致
    var ws = new WebSocket("ws://localhost:8888/");
    ws.onopen = function () {
      // Web Socket 已连接上，使用 send() 方法发送数据
      console.log("已连接...");
    };
    ws.onmessage = function (evt) {
      let { data } = evt;
      let item = JSON.parse(data);
      if (item.message) {
        message.success(item.message);
        setDownStatus();
        setList({});
        // setProgressNum(0);
      } else {
        setProgressNum(Number(item.progress));
        setDownStatus(true);
        setList({
          allPage: item.allPage,
          downPage: item.downPage,
          progress: item.progress
        });
        // console.log(
        //   `当前下载进度：${item.progress}%, 总页数：${item.allPage} , 已下载：${item.downPage} `
        // );
      }
    };

    ws.onclose = function () {
      // 关闭 websocket
      console.log("连接已关闭...");
      // message.error("连接已关闭...");
      Modal.error({
        title: "连接已关闭",
        content: `服务过载，崩掉了。请重启服务！！`,
      });
      history.push({
        pathname: `/error`,
      });
    };
  }, []);
  const showDrawer = (item) => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };
  return (
    <>
      <Drawer
        title="下载进度"
        placement="right"
        width={(window.innerWidth / 4) * 3}
        closable={false}
        onClose={onClose}
        visible={visible}
      >
        <div className="progressBox">
          <Progress type="circle" percent={progressNum} />
        </div>

        <Row gutter={16}>
          <Col span={8}>
            <Card title="总页数" >
              {listData.allPage||0}
            </Card>
          </Col>
          <Col span={8}>
            <Card title="已下载" >
              {listData.downPage||0}
            </Card>
          </Col>
          <Col span={8}>
            <Card title="下载进度" >
              {listData.progress||0}%
            </Card>
          </Col>
        </Row>

        <div className="tipsBox">
          tips：一次只能下载一个任务，请耐心等待下载完成！
        </div>
      </Drawer>
    </>
  );
};
class DataListCom extends Component {
  state = {
    title: "Title",
    data: [],
    count: 0,
    checkedArr: [],
    loading: false,
    allDownLoading: false,
    aDownThrottle: null,
    isAllChecked: false,
    /**
     * 一次只能有一个下载任务（一个线程）否则，系统会崩
     */
    isNowDown: false, //现在是否有下载任务
  };
  childRef = React.createRef();
  childProgressRef = React.createRef();

  UNSAFE_componentWillMount() {
    // 节流防抖设置
    // 为了使throttle形成闭包，只调用一次throttle，之后由其引用throttleFn来调用
    this.setState({
      aDownThrottle: throttle(this.aDown),
    });
  }

  componentDidMount() {
    let { id, title } = this.props.match.params;
    this.setState({
      title: title,
      loading: true,
    });
    listApi(id).then((res) => {
      const { count, data } = res.data || {
        count: 0,
        data: [],
      };
      this.setState({
        data: data.map((v) => ({ ...v, checked: false })),
        count: count,
        loading: false,
      });
    });
  }
  /**
   * 多选框，勾选
   */
  onChange = (e, item, i) => {
    let { data } = this.state;
    data[i].checked = e.target.checked;
    this.setState({
      data: data,
      checkedArr: data
        .filter((v) => v.checked)
        .map((item) => ({
          id: item.chapterId,
          title: item.title,
        })),
    });
  };
  /**
   * 全选、全不选
   */
  onAllChange = (e) => {
    let checked = e.target.checked;
    let { data } = this.state;
    data = data.map((item) => ({
      ...item,
      checked: checked,
    }));
    this.setState({
      data: data,
      checkedArr: data
        .filter((v) => v.checked)
        .map((item) => ({
          id: item.chapterId,
          title: item.title,
        })),
      isAllChecked: checked,
    });
  };
  /**
   * 单个下载
   */
  aDown = (item) => {
    downLoadAWorlApi({
      id: item.chapterId,
      title: this.state.title,
      zj_tit: item.title,
    }).then((res) => {
      if (res.code === 200) {
        message.success("已开始下载！！！");
        this.setState({
          isNowDown: true,
        });
      } else {
        message.error(res.massage);
      }
    });
  };
  /**
   * 批量下载
   */
  allDown = () => {
    let { title, data, checkedArr } = this.state;
    if (!checkedArr.length) {
      message.error("请选择要下载的漫画！");
      return;
    }
    this.setState({
      allDownLoading: true,
    });
    downLoadAllApi({
      title: title,
      arr: checkedArr,
    }).then(() => {
      message.success("已开始批量下载！！！");
      this.setState({
        data: data.map((v) => ({
          ...v,
          checked: false,
        })),
        allDownLoading: false,
        isNowDown: true,
        checkedArr: [],
        isAllChecked: false,
      });
    });
  };
  detail = (item) => {
    this.childRef.current.getValue(item);
  };
  /**
   * 查看进度
   */
  getProgress = () => {
    this.childProgressRef.current.getValue();
  };
  render() {
    let {
      checkedArr,
      allDownLoading,
      aDownThrottle,
      isAllChecked,
      isNowDown,
    } = this.state;
    return (
      <div>
        <PageHeader
          className="site-page-header"
          onBack={() => this.props?.history?.goBack()}
          title={this.state.title}
          extra={[
            <Button
              key={"1"}
              // disabled={!isNowDown}
              onClick={this.getProgress}
              type="primary"
            >
              查看下载进度
            </Button>,
          ]}
        />
        <DrawerCom
          isNowDown={isNowDown}
          aDown={aDownThrottle}
          childRef={this.childRef}
        />
        <DrawerProgress
          setDownStatus={(boolean = false) => {
            this.setState({
              isNowDown: boolean,
            });
          }}
          childRef={this.childProgressRef}
        />
        <BackTop>
          <div style={style}>UP</div>
        </BackTop>
        <div className="affixClass">
          <Checkbox
            checked={isAllChecked}
            disabled={isNowDown}
            onChange={this.onAllChange}
          >
            全选
          </Checkbox>
          <Statistic value={checkedArr.length} prefix={"已选中"} />
          <Popconfirm
            title="确定批量下载吗?"
            onConfirm={this.allDown}
            disabled={isNowDown}
            onCancel={() => {}}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              disabled={isNowDown}
              loading={allDownLoading}
            >
              批量下载
            </Button>
          </Popconfirm>
        </div>
        <div className="padding24">
          <Spin spinning={this.state.loading}>
            <List
              className="demo-loadmore-list"
              itemLayout="horizontal"
              dataSource={this.state.data}
              grid={{
                gutter: 16,
                xs: 1,
                sm: 2,
                md: 2,
                lg: 3,
                xl: 3,
                xxl: 3,
              }}
              renderItem={(item, index) => (
                <List.Item>
                  {/* description="Ant Design, a design language for background applications, is refined by Ant UED Team" */}
                  <Row gutter={16} justify="space-around" align="middle">
                    <Col className="gutter-row" span={2}>
                      {/*  */}
                      <Checkbox
                        onChange={(e) => this.onChange(e, item, index)}
                        indeterminate={false}
                        checked={item.checked}
                        disabled={isNowDown}
                      />
                    </Col>

                    <Col className="gutter-row" span={10}>
                      <List.Item.Meta title={item.title} />
                    </Col>
                    <Col className="gutter-row" span={10}>
                      <Space className="flexEnd">
                        <Button onClick={() => this.detail(item)}>查看</Button>
                        <Button
                          onClick={() => aDownThrottle(item)}
                          disabled={isNowDown}
                          type="primary"
                          icon={<DownloadOutlined />}
                        />
                      </Space>
                    </Col>
                  </Row>
                </List.Item>
              )}
            />
          </Spin>
        </div>
      </div>
    );
  }
}

export default DataListCom;
