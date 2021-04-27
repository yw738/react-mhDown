import React, { Component, useState, useEffect } from "react";
import { Space, Input, Pagination, Row, Col, Card } from "antd";
import "./index.css";
import { useHistory } from "react-router-dom";

import { searchApi } from "./../../api/api.js";

const { Search } = Input;

const { Meta } = Card;
/**
 * 检索框
 */
//查询的回调函数
interface searchProps {
  changeList: Function;
}
// children: any;
const SearchCom: React.FC<searchProps> = (props) => {
  const [searchKey, setKey] = useState<String>("");
  const [total, setTotal] = useState<number>(0);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize] = useState<number>(12);
  const { changeList } = props;
  useEffect(() => {
    searchApi({
      key: searchKey,
      from: pageIndex,
      size: pageSize,
    }).then((res: any) => {
      const { count, data } = res.data || {
        count: 0,
        data: [],
      };
      setTotal(count);
      changeList(data);
    });
  }, [pageIndex, searchKey]);
  return (
    <>
      <Search
        placeholder="input search text"
        allowClear
        style={{ width: 300 }}
        enterButton="Search"
        onSearch={(val: String) => {
          console.log(val);
          setKey(val);
        }}
      />
      <div className="content">{props.children}</div>
      <Pagination
        className="textAlignR"
        total={total}
        showTotal={(total) => `总共 ${total} 本`}
        defaultPageSize={pageSize}
        defaultCurrent={pageIndex}
        onChange={(page) => {
          setPageIndex(page);
        }}
      />
    </>
  );
};

interface contentProps {
  dataList: Array<any>;
}
const ContentBox: React.FC<contentProps> = (props) => {
  const { dataList } = props;
  // console.log(dataList);
  let listProp = {
    xs: 12,
    sm: 8,
    md: 6,
    lg: 6,
    xl: 4,
  };
  return (
    <Space>
      <Row gutter={[20, 20]}>
        {dataList.map((v, index) => (
          <Col {...listProp} key={index}>
            <List {...v} />
          </Col>
        ))}
      </Row>
    </Space>
  );
};

interface listProps {
  author: String;
  cartoonId: String;
  cartoonType: String;
  cartoonVariableId: Number;
  cover: String;
  creationTime: String;
  descs: String;
  id: Number;
  title: String;
  updateTime: String;
  history: Object;
}
const List: React.FC<listProps> = (props) => {
  const history = useHistory();
  function handleClick() {
    history.push({
      pathname: `/list/${props.cartoonId}/${props.title}`,
    });
  }
  return (
    <Card
      hoverable
      style={{ width: "100%" }}
      onClick={handleClick}
      cover={
        <img
          alt="example"
          src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
        />
      }
    >
      {/* <Meta title="Europe Street beat" description="www.instagram.com" /> */}
      <Meta title={props.title} description={props.descs} />
    </Card>
  );

  // return (
  //   <Card
  //     hoverable
  //     style={{ width: "100%" }}
  //     cover={<img alt="example" src={props.cover as string} />}
  //   >
  //     <Meta title={props.title} description={props.descs} />
  //   </Card>
  // );
};
//类型推断
/* <类型>值
// 或者
值 as 类型 */

type SecurityLayoutState = {
  pageIndex: Number;
  dataList: Array<any>;
  count: Number;
  pageSize: Number;
};

class HomePage extends Component {
  state: SecurityLayoutState = {
    dataList: [],
    pageIndex: 1,
    count: 0,
    pageSize: 10,
  };
  changeList = (list: Array<any>) => {
    this.setState({
      dataList: list,
    });
  };
  render(): React.ReactNode {
    return (
      <div className="padding20">
        <SearchCom changeList={this.changeList}>
          <ContentBox dataList={this.state.dataList} />
        </SearchCom>
      </div>
    );
  }
}

export default HomePage;
