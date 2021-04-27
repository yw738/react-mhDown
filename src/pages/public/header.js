import React from "react";
import { Menu } from "antd";
import {
  MailOutlined,
  AppstoreOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
/**
 * header 公共部分
 */
const meunList = [
  {
    label: "首页",
    link: "/",
    icon: <MailOutlined />,
  },
  {
    label: "列表",
    link: "/list",
    icon: <AppstoreOutlined />,
  },
  {
    label: "详情",
    link: "/detail",
    icon: <SettingOutlined />,
  },
];
class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: meunList[0]?.link || "/",
    };
  }
  handleClick = (e) => {
    let { key } = e;
    this.setState({ current: key });
  };

  render() {
    const { current } = this.state;
    return (
      <Menu
        onClick={this.handleClick}
        selectedKeys={[current]}
        mode="horizontal"
      >
        {/* <Menu.Item key="/" icon={<MailOutlined />}>
          <Link to="/">首页</Link>
        </Menu.Item>
        <Menu.Item key="/list" icon={<AppstoreOutlined />}>
          <Link to="/list">列表</Link>
        </Menu.Item>
        <Menu.Item key="/detail" icon={<SettingOutlined />}>
          <Link to="/detail">详情</Link>
        </Menu.Item> */}
        {meunList.map((item) => {
          return (
            <Menu.Item key={item.link} icon={item.icon}>
              <Link to={item.link}>{item.label}</Link>
            </Menu.Item>
          );
        })}
      </Menu>
    );
  }
}

export default Header;
