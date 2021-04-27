import React, { Component, useState, useEffect } from "react";
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
class DataListCom extends Component {
  state = {
    title: "Title",
    data: [],
    count: 0,
    checkedArr: [],
  };
  componentDidMount() {
    let { id, title } = this.props.match.params;
    this.setState({
      title: title,
    });
    listApi(id).then((res) => {
      const { count, data } = res.data || {
        count: 0,
        data: [],
      };
      this.setState({
        data: data,
        count: count,
      });
    });
  }
  onChange = (e, item,i) => {
    // console.log(`checked = ${e.target.checked}`);
    let { checkedArr,data } = this.state;
    let index = checkedArr.findIndex((v) => v.id === item.chapterId);
    let arr = JSON.parse(JSON.stringify(checkedArr));
    // this.state.data
    
    console.log(data[i]);
    /**
     * 选中状态的回显没搞
    */
    if (index >= 0) {
      //删除
      arr.splice(index, 1);
    } else {
      //新增
      arr.push({
        id: item.chapterId,
        title: item.title,
      });
    }
    this.setState({
      checkedArr: arr,
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
      message.success("已开始下载！！！");
    });
  };
  /**
   * 批量下载
   */
  allDown = () => {
    let { title, checkedArr } = this.state;

    return
    downLoadAllApi({
      title: title,
      arr: checkedArr,
    }).then((res) => {
      message.success("已开始批量下载！！！");
      
      this.setState({
        data:this.state.data.map(v=>{
          return {
            ...v,
            checked:false
          }
        })
      })
    });
  };
  detail = () => {};
  render() {
    let { checkedArr } = this.state;
    return (
      <div>
        <PageHeader
          className="site-page-header"
          onBack={() => this.props?.history?.goBack()}
          title={this.state.title}
        />
        <BackTop>
          <div style={style}>UP</div>
        </BackTop>
        <div className="affixClass">
          <Statistic value={checkedArr.length} prefix={"已选中"} suffix="话" />
          <Tooltip placement="bottom" title={"多选下载"}>
            <Button
              type="primary"
              onClick={this.allDown}
              icon={<DownloadOutlined />}
            >
              Download
            </Button>
          </Tooltip>
        </div>
        <div className="padding24">
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
            renderItem={(item,index) => (
              <List.Item>
                {/* description="Ant Design, a design language for background applications, is refined by Ant UED Team" */}
                <Row gutter={16} justify="space-around" align="middle">
                  <Col className="gutter-row" span={2}>
                  {/*  */}
                    <Checkbox onChange={(e) => this.onChange(e, item,index)} indeterminate={false} checked={item.checked} />
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
        </div>
      </div>
    );
  }
}

export default DataListCom;
