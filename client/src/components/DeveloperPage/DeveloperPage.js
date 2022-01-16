import React from "react";
import "../../App.css";
import Sidebar from "./DevComponent/Sidebar";
import Layout, { Content } from "antd/lib/layout/layout";
import { Button } from "react-bootstrap";

function DeveloperPage() {
  return (
    <Layout>
      <Layout width={300} className="ant-layout-has-sider">
        <Sidebar />
        <Layout>
          <Content>
            <Button variant="danger" size="md" className="me-1">
              WT 추가 발행
            </Button>
            <Button variant="danger" size="md" className="me-1">
              NWT 추가 발행
            </Button>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default DeveloperPage;
