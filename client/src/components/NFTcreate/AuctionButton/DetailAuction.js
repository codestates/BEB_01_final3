import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Col, Row, Modal, Button, Container, Card } from "react-bootstrap";
import styled from "styled-components";
import Swal from "sweetalert2";
import { ShakeOutlined , RiseOutlined, AlignLeftOutlined, ContainerOutlined, RedditSquareFilled} from '@ant-design/icons';
const ContainerDiv = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
`
const BasicDiv = styled.div`
display: flex;
flex-wrap: wrap;
justify-content: center;
 
`;
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
  border-bottom: 2px solid #e2dede; 
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
  flex-wrap: wrap;
  flex-direction: column;
  border-top: none;
  border-bottom-left-radius: 1em;
  border-bottom-right-radius: 1em;
`;
const BidFirst = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px dashed black;
`
const BidSecond = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
`
const BidsDiv = styled.div`
  width: 30%;
  display: flex;
  background-color:#eee;
  align-items: center;
`;
const BidIcon = styled.p`
   text-align: center;
   width: 100%;
   background-color: white;
   color: black;
   margin: 0;
`


function DetailAuction(props) {
  
  

  const navigate = useNavigate();
  const [userbids, setuserbids] = useState("");
  const [topPrice, setTopPrice] = useState('');

 
  

  useEffect(() => {
   
    const beforeData = props.nftdata.bids;
    if (beforeData[0] !== undefined) {
      setTopPrice(beforeData[beforeData.length - 1].bid);
    } else {
      setTopPrice(props.nftdata.price);
    }
  
    
  },[])

  const onUserBids = (e) => {
    setuserbids(e.currentTarget.value);
  };


  const onSubmit = (e) => {
    e.preventDefault(); //새로고침방지
   

    const beforeData = props.nftdata.bids;
    let beforeBuyer;
    let beforePrice = props.nftdata.price;
    if (beforeData[0] !== undefined) {
      beforeBuyer = beforeData[beforeData.length - 1].bidAddress;
      beforePrice = beforeData[beforeData.length - 1].bid
    }

    setTopPrice(beforePrice);
    
    const variables = {
      bids: userbids,
      tokenId: props.nftdata.tokenId,
      beforeBuyer,
      beforePrice
    };
   
    axios.post("/api/contract/bid", variables).then((res) => {
  
      if (res.data.success === false) {
        Swal.fire({
          icon: 'error',
          title: res.data.detail,
        }).then(res => {
          return
        })
      } else if (res.data.success) {
        Swal.fire({
          icon: 'success',
          title: '입찰에 성공했습니다.',
        }).then(res => {
          navigate("/nft/auctionlist");
          return
        })
    
      }
    });
  };

  const onClick = (e) => {
    e.preventDefault();
    const variables = {
      tokenId: props.nftdata.tokenId,
    };
   
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
  
    axios.post("/api/contract/endauction", variables).then((res) => {
      if (res.data.faild === false) {
        alert(
          "입찰 종료가 실패하였습니다 확인해주세요!, reason :" + res.data.reason
        );
      } else if (res.data.success) {
        alert("입찰 종료가 성공적으로 진행되었습니다");
        navigate("/nft/auctionlist");
      }
    });
  };
  return (
    <Modal {...props} size="xl" aria-labelledby="contained-modal-title-vcenter">
      <Modal.Body className="show-grid">
        <ContainerDiv>
        <TitleDiv>{props.nftdata.contentTitle}</TitleDiv>
          <BasicDiv>
              <ImgDiv>
                <Card.Img
                  variant="top"
                  src={props.nftdata.imgUri}
                  style={{ height: "100%", width: "100%" }}
                />
              </ImgDiv>
            
              </BasicDiv>
            

            

              <MiddleBoxDiv>
                <ContentDiv>{props.nftdata.description}</ContentDiv>
              </MiddleBoxDiv>

              <MiddleTitleDiv>
                <SubTitleDiv><RiseOutlined style={{margin: '6px'}}/>Top Bid</SubTitleDiv>
              </MiddleTitleDiv>
              <MiddleBoxDiv>
                <TitleDiv>{topPrice} NWT</TitleDiv>
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
                <SubTitleDiv>
                  <ContainerOutlined style={{ margin: '6px' }} />Offer
                </SubTitleDiv>
              </MiddleBoxDiv>
              <BottomBoxDiv>
                <BidFirst>
                <BidsDiv>
                  <BidIcon>사람</BidIcon>
                  </BidsDiv>               
                <BidsDiv>
                  <BidIcon>주소</BidIcon>
                  </BidsDiv>
                <BidsDiv>
                  <BidIcon>금액</BidIcon>
                  </BidsDiv>
                </BidFirst>
                <BidSecond>
                  {props.nftdata.bids.map(el => {
                    return (
                      <>
                         <BidsDiv>
                          <BidIcon>{el.bidAddress}</BidIcon>
                        </BidsDiv>
                        <BidsDiv>
                      <BidIcon>el.bidAddress</BidIcon>
                        </BidsDiv>
                        <BidsDiv>
                          <BidIcon>{el.bid}</BidIcon>
                  </BidsDiv>
                        </>
                    )
                  })}
                </BidSecond>
              </BottomBoxDiv>
       

         
              <Button onClick={onClick}>Bid Cancle</Button>
            

          
              <Button>Transaction</Button>
           
           
            <Button variant="danger" onClick={EndAuction}>
                입찰 종료
            </Button>
         
        </ContainerDiv>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.show}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
export default DetailAuction;
