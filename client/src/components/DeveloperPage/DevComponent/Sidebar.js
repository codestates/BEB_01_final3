import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
// import './index.css';
import { Layout, Menu, Button, Text } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Sider, Content } = Layout;

function Sidebar({getNum}) {
  const onClick = (e) => {
    if(e === "0") getNum(0);
    else if(e === "1") getNum(1);
    else if(e === "2") getNum(2);
    else if(e === "3") getNum(3);

  }

  return (
    <Sider >
      <div className="logo" />

      <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
      <Menu.Item key="1" icon={<UserOutlined />}>
          <a href="/">
            Home
          </a>
        </Menu.Item>
        <Menu.Item key="2" icon={<UserOutlined />}>
        <a onClick={()=>{onClick("0")}}>
            NFT 민팅
          </a>
        </Menu.Item>
        <Menu.Item key="3" icon={<UserOutlined />}>
          <a onClick={()=>{onClick("1")}}>
            Battinig
          </a>
        </Menu.Item>
        <Menu.Item key="4" icon={<UploadOutlined />}>
          <a onClick={()=>{onClick("2")}}>
            관리자권한부여
          </a>
        </Menu.Item>
      </Menu>
    </Sider>
  );
}

export default Sidebar;
