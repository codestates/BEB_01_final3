import React from "react";
import "../../App.css";
import Sidebar from "./DevComponent/Sidebar";
import Layout, { Content } from "antd/lib/layout/layout";
import { Button, Card } from "react-bootstrap";
import Avatar from "antd/lib/avatar/avatar";
import wtImg from "../img/wtimg.png";

function DeveloperPage() {
  return (
    <Layout>
      <Layout width={300} className="ant-layout-has-sider">
        <Sidebar />
        <Layout>
          <Content>
            <form
              style={{
                display: "flex",
                // justifyContent: "center",
                // marginLeft: "0"
              }}
            >
              <Card
                style={{ width: "22rem", margin: "80px", marginTop: "40px" }}
              >
                <Card.Body>
                  <Card.Title>현재 개시된 Survival Contents 수</Card.Title>
                  <Card.Text>개</Card.Text>
                  <hr />
                  <Card.Title>현재 개시된 Contents 수</Card.Title>
                  <Card.Text>개</Card.Text>
                  <hr />
                  <Card.Title>현재 이용자 수</Card.Title>
                  <Card.Text>명</Card.Text>
                </Card.Body>
              </Card>

              <Card
                style={{ width: "18rem", margin: "80px", marginTop: "40px" }}
              >
                <div>
                  <Avatar
                    size={150}
                    src={wtImg}
                    alt
                    style={{ margin: "10px" }}
                  />
                </div>
                <Card.Body>
                  <Card.Title>WT</Card.Title>
                  <hr />
                  <Card.Text>WT 총 발행량</Card.Text>

                  <Card.Text>개</Card.Text>
                  <hr />
                  <Card.Text>WT 서버 보유량</Card.Text>
                  <Card.Text>개</Card.Text>
                  <hr />
                  <Button variant="danger" size="md" className="me-1">
                    WT 추가 발행
                  </Button>
                </Card.Body>
              </Card>

              <Card
                style={{ width: "18rem", margin: "80px", marginTop: "40px" }}
              >
                <div>
                  <Avatar size={150} src={""} alt style={{ margin: "10px" }} />
                </div>
                <Card.Body>
                  <Card.Title>NWT</Card.Title>
                  <hr />
                  <Card.Text>NWT 총 발행량</Card.Text>
                  <Card.Text>개</Card.Text>
                  <hr />
                  <Card.Text>NWT 서버 보유량</Card.Text>
                  <Card.Text>개</Card.Text>
                  <hr />
                  <Button variant="danger" size="md" className="me-1">
                    NWT 추가 발행
                  </Button>
                </Card.Body>
              </Card>
            </form>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default DeveloperPage;
