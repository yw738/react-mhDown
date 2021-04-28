import React, {
  Component,
  useState,
  useEffect,
  useImperativeHandle,
} from "react";
import {
  PageHeader,
  List,
  Button,
  Space,
  Row,
  Col,
  Checkbox,
  BackTop,
  Tooltip,
  Statistic,
  message,
  Drawer,
  Image,
  Spin,
} from "antd";
import "./index.css";
import {
  listApi,
  downLoadAWorlApi,
  detailApi,
  downLoadAllApi,
} from "./../../api/api.js";
import { DownloadOutlined } from "@ant-design/icons";

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
// 弹框
const DrawerCom = ({ childRef, aDown }) => {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("详情");
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

class DataListCom extends Component {
  state = {
    title: "Title",
    data: [],
    count: 0,
    checkedArr: [],
    loading: false,
    allDownLoading: false,
  };
  childRef = React.createRef();

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
    // console.log(`checked = ${e.target.checked}`);
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
    // console.log(`checked = ${e.target.checked}`);
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
    }).then(() => {
      message.success("已开始下载！！！");
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
      });
    });
  };
  detail = (item) => {
    this.childRef.current.getValue(item);
  };
  openDetail = () => {};
  render() {
    let { checkedArr, allDownLoading } = this.state;
    return (
      <div>
        <PageHeader
          className="site-page-header"
          onBack={() => this.props?.history?.goBack()}
          title={this.state.title}
        />
        <DrawerCom aDown={this.aDown} childRef={this.childRef} />
        <BackTop>
          <div style={style}>UP</div>
        </BackTop>
        <div className="affixClass">
          <Checkbox onChange={this.onAllChange}>全选</Checkbox>
          <Statistic value={checkedArr.length} prefix={"已选中"} />
          {/* <Tooltip placement="bottom" title={"批量下载"}> */}
          <Button
            type="primary"
            onClick={this.allDown}
            icon={<DownloadOutlined />}
            loading={allDownLoading}
          >
            批量下载
          </Button>
          {/* </Tooltip> */}
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
                      />
                    </Col>

                    <Col className="gutter-row" span={10}>
                      <List.Item.Meta title={item.title} />
                    </Col>
                    <Col className="gutter-row" span={10}>
                      <Space className="flexEnd">
                        <Button onClick={() => this.detail(item)}>查看</Button>
                        <Button
                          onClick={() => this.aDown(item)}
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
