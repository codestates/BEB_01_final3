import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
// import './index.css';
import { Layout, Menu, Button, Text,  } from "antd";
import { Dropdown, DropdownButton } from 'react-bootstrap';

import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  BankOutlined,
  LaptopOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Sider, Content } = Layout;

function Sidebar({getNum}) {

  const { SubMenu } = Menu;


  const onClick = (e) => {
    if(e === "0") getNum(0);
    else if(e === "1") getNum(1);
    else if(e === "2") getNum(2);
    else if(e === "3") getNum(3);
    else if(e === "4") getNum(4);

  }

  return (
        <Sider width={300} className="site-layout-background" style={{position: "fixed", transform: "none", height: "100%"}}>
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            style={{ height: "100%", borderRight: 0 }}
          >
            <SubMenu key="sub1" icon={<LaptopOutlined />} title="Develop Menu">
              <Menu.Item key="1">
                <Link to="/" className="nav-text">HOME</Link>
              </Menu.Item>
              <Menu.Item key="2">
                <a onClick={()=>{onClick("0")}}>
                토큰 발행
                </a>
              </Menu.Item>
              <Menu.Item key="3">
                <a onClick={()=>{onClick("1")}}>
                  NFT 민팅
                </a>
                </Menu.Item>
              <Menu.Item key="4">
                <a onClick={()=>{onClick("2")}}>
                  Battinig
                </a>
                </Menu.Item>
              <Menu.Item key="5">
                <a onClick={()=>{onClick("3")}}>
                  관리자 권한 부여
                </a>
              </Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
      
    // <Sider >
    //   <div className="logo" />

    //   <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
    //   <Menu.Item key="1" icon={<UserOutlined />}>
    //       <a href="/">
    //         Home
    //       </a>
    //     </Menu.Item>
    //     <Menu.Item key="2" icon={<UserOutlined />}>
    //     <a onClick={()=>{onClick("0")}}>
    //         토큰 발행
    //       </a>
    //     </Menu.Item>
    //     <Menu.Item key="3" icon={<UserOutlined />}>
    //     <a onClick={()=>{onClick("1")}}>
    //         NFT 민팅
    //       </a>
    //     </Menu.Item>
    //     <Menu.Item key="4" icon={<UserOutlined />}>
    //       <a onClick={()=>{onClick("2")}}>
    //         Battinig
    //       </a>
    //     </Menu.Item>
    //     <Menu.Item key="5" icon={<UploadOutlined />}>
    //       <a onClick={()=>{onClick("3")}}>
    //         관리자권한부여
    //       </a>
    //     </Menu.Item>
    //   </Menu>
    // </Sider>
  );
}

export default Sidebar;
