
import React, { useEffect, useState } from 'react'
import axios from 'axios';
// import { Facoad } from 'react-icons/fa'
import {Card,Button} from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom';
import {HeartOutlined, HeartFilled} from '@ant-design/icons'; 
import LikeDisLike from './LikeDisLike';
import styled from "styled-components";
import Swal from "sweetalert2";

const Div = styled.div`
width: 25%;
border-radius: 4%;
box-shadow: 4px 12px 30px 6px rgb(0 0 0 / 9%);
transition: all 0.2s ease-in-out;
&:hover {

  box-shadow: 4px 12px 20px 6px rgb(0 0 0 / 18%);
  transform: translateY(5px);

}

`
function NFTbuy({ nftlist }) {
    const navigate = useNavigate();
    const [buyer,setBuyer] = useState('');

    const [check, setCheck] = useState(false);
    const [sell, setSell] = useState(false);

    const nftId = useParams().nftId;
    console.log(nftId);

    const onClick = () => {
      console.log('좋아요?');
      check ? setCheck(false) : setCheck(true);
    }
  function BuyNFT(tokenId) {
     console.log(tokenId);
    axios.post('/api/contract/buyNFT',{tokenId:tokenId})
      .then((res) => {
              
        
           if(res.data.failed === false){
             alert('구매가 되지 않았습니다. 확인해주세요!!!, reason :'+res.data.reason)
           }else if(res.data.success){
             alert('구매가 완료되었습니다. 구매자의 mypage로 이동하겠습니다.')
             navigate('/user/myPage')

           }
          
        });
   }

    
  return (

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
  )

  
}

export default NFTbuy