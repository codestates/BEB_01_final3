import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Col, Row, Modal, Button, Container, Card } from "react-bootstrap";
import styled from "styled-components";
import { ShakeOutlined , RiseOutlined, AlignLeftOutlined, ContainerOutlined} from '@ant-design/icons';

const ImgDiv = styled.div`
  max-width: 100%;
  min-height: 40rem;
  background: #fffffe;
  display: flex;
  justify-content: baseline;
  align-items: center;
  margin: 10px;
  border: 2px solid #e2dede;
  border-radius: 1em;
`;

const TitleDiv = styled.div`
  max-width: 100%;
  min-height: 3rem;
  background: #fffffe;
  display: flex;
  justify-content: baseline;
  align-items: center;
  font-size: 1cm;
  font-weight: bolder;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
  margin-left: 50px;
`;

const SubTitleDiv = styled.div`
  max-width: 100%;
  min-height: 3rem;
  background: #fffffe;
  display: flex;
  justify-content: baseline;
  align-items: center;
  font-size: large;
  font-weight: bolder;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
  margin-left: 20px;
`;

const ContentDiv = styled.div`
  max-width: 100%;
  min-height: 3rem;
  background: #fffffe;
  display: flex;
  justify-content: baseline;
  align-items: center;
  font-size: 2ex;
  font-weight: bolder;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
  margin-left: 50px;
`;

const TopBoxDiv = styled.div`
  max-width: 100%;
  min-height: 3rem;
  display: flex;
  border: 2px solid #e2dede;
  border-bottom: none;
  border-top-left-radius: 1em;
  border-top-right-radius: 1em;
`;
const MiddleTitleDiv = styled.div`
  max-width: 100%;
  min-height: 4rem;
  display: flex;
  border: 2px solid #e2dede;
  border-bottom: none;
`;
const MiddleBoxDiv = styled.div`
  max-width: 100%;
  min-height: 4rem;
  display: flex;
  border: 2px solid #e2dede;
  border-top: none;
  border-bottom: none;
`;

const MiddleRightBoxDiv = styled.div`
  max-width: 100%;
  min-height: 4rem;
  display: flex;
  border: 2px solid #e2dede;
  border-top: none;
  justify-content: right;
  align-items: center;
`;

const BottomBoxDiv = styled.div`
  max-width: 100%;
  min-height: 17rem;
  display: flex;
  border: 2px solid #e2dede;
  border-top: none;
  border-bottom-left-radius: 1em;
  border-bottom-right-radius: 1em;
`;

function DetailAuction(props) {
  console.log(props.nftdata);

  const navigate = useNavigate();
  const [userbids, setuserbids] = useState("");

  const onUserBids = (e) => {
    setuserbids(e.currentTarget.value);
  };

  const onSubmit = (e) => {
    e.preventDefault(); //새로고침방지
    const variables = {
      bids: userbids,
      tokenId: props.nftdata.tokenId,
    };
    console.log(variables);
    axios.post("/api/contract/bid", variables).then((res) => {
      if (res.data.failed === false) {
        alert(
          "입찰에 실패하였습니다. 확인해주세요!, reason :" + res.data.reason
        );
      } else if (res.data.success) {
        alert("입찰이 완료되었습니다.");
        navigate("/nft/auctionlist");
      }
    });
  };

  const onClick = (e) => {
    e.preventDefault();
    const variables = {
      tokenId: props.nftdata.tokenId,
    };
    console.log(props.nftdata.tokenId);
    axios.post("/api/contract/withdraw", variables).then((res) => {
      if (res.data.faild === false) {
        alert(
          "입찰 취소가 실패했습니다. 확인해주세요!, reason :" + res.data.reason
        );
      } else if (res.data.success) {
        alert("입찰 취소가 성공하였습니다. 입찰금을 돌려받으셨습니다.");
        navigate("/nft/auctionlist");
      }
    });
  };

  const EndAuction = (e) => {
    e.preventDefault();
    const variables = {
      tokenId: props.nftdata.tokenId,
    };
    console.log(props.nftdata.tokenId);
    axios.post("/api/contract/endauction", variables).then((res) => {
      if (res.data.faild === false) {
        alert(
          "입찰 종료가 실패하였습니다 확인해주세요!, reason :" + res.data.reason
        );
      } else if (res.data.success) {
        alert("입찰 종료가 성공적으로 진행되었습니다.");
        navigate("/nft/auctionlist");
      }
    });
  };
  return (
    <Modal {...props} size="xl" aria-labelledby="contained-modal-title-vcenter">
      <Modal.Body className="show-grid">
        <Container>
          <Row>
            <Col xs={12} md={8}>
              <ImgDiv>
                <Card.Img
                  variant="top"
                  src={props.nftdata.imgUri}
                  style={{ height: "100%", width: "100%" }}
                />
              </ImgDiv>
            </Col>
            <Col xs={6} md={4}>
              <TitleDiv>{props.nftdata.contentTitle}</TitleDiv>

              <TopBoxDiv>
                <SubTitleDiv><AlignLeftOutlined style={{marginRight: '6px'}}/>Desctiption</SubTitleDiv>
              </TopBoxDiv>

              <MiddleBoxDiv>
                <ContentDiv>{props.nftdata.description}</ContentDiv>
              </MiddleBoxDiv>

              <MiddleTitleDiv>
                <SubTitleDiv><RiseOutlined style={{margin: '6px'}}/>Top Bid</SubTitleDiv>
              </MiddleTitleDiv>
              <MiddleBoxDiv>
                <TitleDiv>{props.nftdata.price} NWT</TitleDiv>
              </MiddleBoxDiv>

              <MiddleRightBoxDiv>
                <input
                  onChange={onUserBids}
                  style={{
                    width: "150px",
                    height: "2rem",
                    borderTop: "none",
                    borderLeft: "none",
                    borderRight: "none",
                    marginRight: '10px',
                  }}
                  value={userbids}
                  placeholder="                                                       NWT"
                ></input>

                <Button
                  variant="warning"
                  style={{ fontWeight: "bold", marginRight: '10px'}}
                  value={props.nftdata.tokenId}
                  onClick={onSubmit}
                >
                  <ShakeOutlined style={{marginRight: '10px'}}/>
                    Bid
                </Button>
              </MiddleRightBoxDiv>

              <MiddleBoxDiv>
                <SubTitleDiv><ContainerOutlined style={{margin: '6px'}}/>Offer</SubTitleDiv>
              </MiddleBoxDiv>
              <BottomBoxDiv>
                <ContentDiv> 구현 예정</ContentDiv>
              </BottomBoxDiv>
            </Col>
          </Row>

          <Row>
            <Col xs={20} md={4}>
              <Button onClick={onClick}>Bid Cancle</Button>
            </Col>

            <Col xs={20} md={4}>
              <Button>Transaction</Button>
            </Col>
            <Col xs={20} md={4}>
            <Button variant="danger" onClick={EndAuction}>
                입찰 종료
            </Button>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.show}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
export default DetailAuction;
