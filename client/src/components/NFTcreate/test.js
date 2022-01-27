import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {Col, Row, Modal, Button, Container, Card } from 'react-bootstrap'
import Form from 'antd/lib/form/Form';

function DetailAuction(props) {

  console.log(props.nftdata)


  const navigate = useNavigate();
  const [userbids, setuserbids] = useState("");
 
  const onUserBids = (e) => {
    setuserbids(e.currentTarget.value)
  }
 
  const onSubmit = (e) => {
    e.preventDefault() //새로고침방지
    const variables = {
        bids: userbids,
        tokenId: props.nftdata.tokenId
    }
    console.log(variables)
    axios.post('/api/contract/bid', variables)
       .then((res) => {
        if(res.data.failed === false){
          alert('입찰에 실패하였습니다. 확인해주세요!, reason :'+res.data.reason)
        }else if(res.data.success){
          alert('입찰이 완료되었습니다.')
          navigate('/nft/auctionlist')
        }
     });
   }

   const onClick = (e) => {
    e.preventDefault()
    const variables = {
      tokenId: props.nftdata.tokenId
      }
    console.log(props.nftdata.tokenId)
    axios.post('/api/contract/withdraw', variables)
      .then((res) => {
        if(res.data.faild === false){
          alert('입찰 취소가 실패했습니다. 확인해주세요!, reason :'+res.data.reason)
        }else if(res.data.success){
          alert('입찰 취소가 성공하였습니다. 입찰금을 돌려받으셨습니다.')
          navigate('/nft/auctionlist')
        }
      })
   }

   const EndAuction = (e) => {
    e.preventDefault()
    const variables = {
      tokenId: props.nftdata.tokenId
      }
      console.log(props.nftdata.tokenId)
      axios.post('/api/contract/endauction', variables)
        .then((res) => {
          if(res.data.faild === false){
            alert('입찰 종료가 실패하였습니다 확인해주세요!, reason :'+res.data.reason)
          }else if(res.data.success){
            alert('입찰 종료가 성공적으로 진행되었습니다.')
            navigate('/nft/auctionlist')
          }
        })
   }
    return (
      <Modal {...props} aria-labelledby="contained-modal-title-vcenter">
        <Modal.Header closeButton onClick={props.show}>
          <Modal.Title id="contained-modal-title-vcenter">
            {props.nftdata.contentTitle}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="show-grid">
          <Container>
            <Row>
              <Col xs={12} md={8}>
              <Card.Img variant="top" src={props.nftdata.imgUri} style={{height:'100%', width:'100%', }} />
              </Col>
              <Col xs={6} md={4}>
              {props.nftdata.description}
              </Col>
            </Row>
  
            <Row>
              <Col xs={6} md={4}>
                <Button onClick={onClick}>
                입찰 취소
                </Button>
              </Col>
              <Col xs={6} md={4}>
                {props.nftdata.price}
              </Col>
              <Col xs={20} md={4}>

                <Form onSubmit={onSubmit}>
                    <input onChange={onUserBids} style={{ width: '100px'}} value={userbids}></input>
                    <div>
                        <Button 
                          variant="warning" 
                          style={{fontWeight:"bold"}}
                          value={props.nftdata.tokenId} 
                          onClick={onSubmit} >
                              입찰
                        </Button>
                    </div>
                </Form>

              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button   
            variant="danger" 
            onClick={EndAuction}
            >입찰 종료</Button>
          <Button onClick={props.show}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
export default DetailAuction;
