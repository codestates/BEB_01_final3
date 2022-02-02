import React from 'react';
import 'antd/dist/antd.css';
import '../../index.css';
import { Layout, Menu } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import styled from "styled-components";
import { Link } from "react-router-dom";

const Menudiv = styled.div`
margin: 30px 0px 20px 0px;
text-align: center;
font-size: 23px;
`

const { SubMenu } = Menu;
const { Sider } = Layout;

function SideBar() {
  return (
    <div>
      <Layout >
      <Sider width={300} className="site-layout-background" style={{ position: "fixed", transform: "none"}} >
          <Menu
            mode="inline"
            style={{ height: "100%", borderRight: 0 , backgroundColor:"white" }}
          >
            <hr />
            <Menudiv>M A R K E T</Menudiv>
              <Menu.Item key="1">
                <Link to="/nft/fixedlist" className="nav-text" style={{textDecoration: 'none'}}>Fixed MARKET</Link>
              </Menu.Item>  
              <Menu.Item key="2">
                <Link to="/nft/auctionlist" className="nav-text" style={{textDecoration: 'none'}}>Auction MARKET</Link>
              </Menu.Item>
              <hr />
              <div style={{marginLeft: "8%", marginTop: "10%"}}>NFT Ranking</div>
          </Menu>
        </Sider>
      </Layout>
    </div>
  );
}

export default SideBar