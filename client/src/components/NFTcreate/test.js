//auction list component => NFTauction component 리스트 데이터 넘김
//NFTauction component에서 리스트 맵핑 나열
//맵핑에서 모달창 사용 => 해당nft data 넘김
//NFTmodal component => 이미지 출력, 이름, 상세설명, 최고가, 경매남은시간, 입찰, 입찰 취소, 입찰 종료

import React, { useEffect, useState } from 'react'
import axios from 'axios';
import {Card,Button} from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom';
import {HeartOutlined, HeartFilled} from '@ant-design/icons'; 
import LikeDisLike from './LikeDisLike';
import Form from 'antd/lib/form/Form';


function NFTauction({ nftlist }) {
  
    const navigate = useNavigate();
    const [check, setCheck] = useState(false);
    const [userbids, setuserbids] = useState("");
    const [auction, setAuction] = useState(false);
    const [modalInfo, setModalInfo] = useState({});


    const onClick = () => {
      console.log('좋아요?');
      check ? setCheck(false) : setCheck(true);
    }
    
    const onUserBids = (e) => {
        setuserbids(e.currentTarget.value)
    }
 

   const onSubmit = (e) => {
    e.preventDefault() //새로고침방지
    const variables = {
        bids: userbids,
        tokenId: e.target.value
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

   function Auction(info) {
   
    if (auction) {
      setAuction(false);
    } else {
      setAuction(true);
    }
    setModalInfo(info);
    }
    

  return (
    <div>
    <div style={{
        fontSize: "50px",
        color: "white",
        background:'black',
        // marginBottom:"2%"
    }}>
      
    </div>

    <div style={{
    width:'100vw', 
    height:'100%',
     display:'flex',
    flexWrap:'wrap',
    justifyContent: 'center',
     alignContent: 'center',
    backgroundColor:'black'
      }}>
        {/* 판매부분 fixed / Acution 모달창  */}
       
        {auction === true ? <AuctionModal check={Auction} modalInfo={modalInfo} userInfo={userInfo} /> : null}
    {

    
    
             nftlist.map((el)=>{
               return(
                <Card style={{ width: '19rem', margin:"1.5%", cursor:"pointer"}} bg='black' text='white' border='white'>
                <Card.Img variant="top" src={el.imgUri} style={{height:'100%', width:'100%', }} />
                <Card.Body style={{marginBottom: '0px', borderBottom: '1px solid #DCDCDC'}}>
                  <Card.Title style={{textAlign:'left', marginTop: '3%', marginLeft:'-3%'}}>
                    Content : {el.contentTitle}
                  </Card.Title>
                  <Card.Title style={{textAlign:'left', marginTop: '5%', marginLeft:'-3%'}}>
                    Name : {el.nftName}
                     </Card.Title>
                  <Card.Title style={{textAlign:'left', marginTop: '5%', marginLeft:'-3%'}}>
                    최고가 : {el.price}
                  </Card.Title> 
                 
                </Card.Body>
                <Card.Body style={{marginBottom: '0px', borderBottom: '1px solid #DCDCDC'}}>
                  <Card.Text style={{textAlign:'left', marginLeft:'-3%', fontSize:'20px'}}>
                    desription : {el.description}
                  </Card.Text>
                </Card.Body>
                   <Card.Body style={{ display: "flex", marginLeft: '-3%', marginRight: '-9%' }}>

                       <Form onSubmit={onSubmit}>

                           <input onChange={onUserBids} style={{ width: '200px'}}
                           value={userbids}
                           >

                           </input>
                    <div>
                      <Button 
                      variant="warning" 
                      style={{fontWeight:"bold"}}
                      value={el.tokenId} 
                      onClick={onSubmit} >
                      {/* onClick={()=>{Bid(el.tokenId)}} > */}
                          입찰
                    </Button>
                    </div> 
                    </Form>

                    <span>
                        <Button 
                        ariant="warning" 
                        style={{ fontWeight: "bold" }}  
                        onClick={() => { Auction({tokenId:el.tokenId,imgUri:el.imgUri}) }} 
                        >
                            경매 상세
                        </Button>
                    </span>

                  <div style={{width:"55%"}}></div>
                  <LikeDisLike userId={localStorage.getItem('userId')} nftId={ el._id } />
                </Card.Body>
                  
                
              </Card>
            
               )
             })
             

             }
          
          </div>
          </div>
            )}

export default NFTauction