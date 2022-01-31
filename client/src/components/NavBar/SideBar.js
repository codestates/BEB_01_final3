import React from 'react';
import 'antd/dist/antd.css';
import '../../index.css';
import { Layout, Menu } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import styled from "styled-components";
import { Link } from "react-router-dom";


const { SubMenu } = Menu;
const { Sider } = Layout;

function SideBar() {
  return (
    <div>
      <Layout >
      <Sider width={300} className="site-layout-background" style={{ position: "fixed", transform: "none"}} >
          <Menu
            mode="inline"
            // defaultSelectedKeys={["1"]}
            // defaultOpenKeys={["sub1"]}
            style={{ height: "100%", borderRight: 0 , backgroundColor:"white" }}
          >
              <Menu.Item key="1">
                <Link to="/nft/fixedlist" className="nav-text" style={{textDecoration: 'none'}}>NFT LIST(Fixed)</Link>
              </Menu.Item>  
              <Menu.Item key="2">
                <Link to="/nft/auctionlist" className="nav-text" style={{textDecoration: 'none'}}>NFT LIST(Auction)</Link>
              </Menu.Item>
              <Menu.Item key="3">NFT Ranking</Menu.Item>
              <Menu.Item key="4">option4</Menu.Item>
          </Menu>
        </Sider>
      </Layout>
    </div>
  );
}

export default SideBar