
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import {Card,Button} from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom';
import {HeartOutlined, HeartFilled} from '@ant-design/icons'; 
import LikeDisLike from './LikeDisLike';
import styled from "styled-components";
import Swal from "sweetalert2";
import Spinner from '../spinner/nftListSpinner';

const Div = styled.div`
    width: 400px;
    border-radius: 4%;
    /* display: flex; */
    box-shadow: 4px 12px 30px 6px rgb(0 0 0 / 9%);
    transition: all 0.2s ease-in-out;
    margin: 1%;
    &:hover {

      box-shadow: 4px 12px 20px 6px rgb(0 0 0 / 18%);
      transform: translateY(5px);

    }
    /* margin-top: -60%; */
    margin-right: 2.5%;
    margin-left: 2.5%;
    `

    const ButtonDiv = styled.div`

    display: flex;
    flex-wrap: wrap;
    /* justify-content: none; */
    margin-top: -20px;
    `
    const TBody = styled.div`
    display: flex;
    /* justify-content: left; */
    text-align: left;
    `

function NFTbuy({ nftlist }) {
    const navigate = useNavigate();
    const [buyer,setBuyer] = useState('');

    const [check, setCheck] = useState(false);
    const [sell, setSell] = useState(false);

    const nftId = useParams().nftId;
    

    const [fixed, setFixed] = useState(false);
    const [auction, setAuction] = useState(false);
    const [modalInfo, setModalInfo] = useState({});
    const [loading, setLoading] = useState(false);
   
    
    const onClick = () => {
      console.log('좋아요?');
      check ? setCheck(false) : setCheck(true);
    }
    function BuyNFT(tokenId) {
       console.log(tokenId);
      setLoading(true)
      axios.post('/api/contract/buyNFT',{tokenId:tokenId})
      .then((res) => {
              
        
           if(res.data.failed === false){
             alert('구매가 되지 않았습니다. 확인해주세요!!!, reason :'+res.data.reason)
             setLoading(false)
           }else if(res.data.success){
             alert('구매가 완료되었습니다. 구매자의 mypage로 이동하겠습니다.')
             navigate('/user/myPage')
             setLoading(false)
           }
          
        });
   }

    
  return (

<>
{loading === true ? <Spinner /> : 
  <>
    {
             nftlist.map((el)=>{
               return (
                <Div>
                 <Card bg='black' text='white' border='white' style={{borderRadius:'4%'}}>
                   <Card.Img variant="top" src={el.imgUri} style={{ width: '25 rem', height:'25rem',borderRadius:'4%' }}/>
                <Card.Body>
                  <Card.Title>
                    Content : {el.contentTitle}
                  </Card.Title>
                  <Card.Title>
                    Name : {el.nftName}
                     </Card.Title>
                  <Card.Title>
                    Price : {el.price}
                  </Card.Title> 
                 
                </Card.Body>
                <Card.Body>
                  <Card.Text>
                    desription : {el.description}
                  </Card.Text>
                </Card.Body>
                   <Card.Body>
                    <div>
                      <Button variant="warning" style={{fontWeight:"bold"}}  onClick={()=>{BuyNFT(el.tokenId)}} >구매하기</Button>
                    </div> 
                  <div style={{width:"55%"}}></div>
                  <LikeDisLike userId={localStorage.getItem('userId')} nftId={ el._id } />
                </Card.Body>
                   </Card>
             
                   </Div>
               )
             })
           }
          </>
          }
      </>
  )

  
}

export default NFTbuy