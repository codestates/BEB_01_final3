
import React, { useEffect, useState } from 'react'
import axios from 'axios';
// import { Facoad } from 'react-icons/fa'
import {Card,Button} from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom';
import {HeartOutlined, HeartFilled} from '@ant-design/icons'; 
import LikeDisLike from './LikeDisLike';




function NFTbuy ({nftlist}) {

   
    const navigate = useNavigate();
    const [buyer,setBuyer] = useState('');

    const [check, setCheck] = useState(false);

    const nftId = useParams().nftId;
    console.log(nftId);

    const onClick = () => {
      console.log('좋아요?');
      check ? setCheck(false) : setCheck(true);
    }
    

   function BuyNFT(tokenId){
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
               return(
                <Card style={{ width: '19rem', margin:"1.5%", cursor:"pointer"}} bg='black' text='white'>
                <Card.Img variant="top" src={el.imgUri} style={{height:'100%', width:'100%', }} />
                <Card.Body style={{marginBottom: '0px', borderBottom: '1px solid #DCDCDC'}}>
                  <Card.Title style={{textAlign:'left', marginTop: '3%', marginLeft:'-5%'}}>Content : {el.contentTitle}</Card.Title>
                  <Card.Title style={{textAlign:'left', marginTop: '5%', marginLeft:'-5%'}}>Name : {el.nftName}</Card.Title>
                  <Card.Title style={{textAlign:'left', marginTop: '5%', marginLeft:'-5%'}}>Price : {el.price}</Card.Title>
                </Card.Body>
                <Card.Body style={{marginBottom: '0px', borderBottom: '1px solid #DCDCDC'}}>
                  <Card.Text style={{textAlign:'left', marginLeft:'-5%', fontSize:'20px'}}>
                    desription : {el.description}
                  </Card.Text>
                </Card.Body>
                <Card.Body>
                  <Button variant="warning" style={{fontWeight:"bold"}}  onClick={()=>{BuyNFT(el.tokenId)}} >판매중</Button>
                  <LikeDisLike userId={localStorage.getItem('userId')} nftId={ el._id }/>
                </Card.Body>
                  
                
              </Card>
              
               )
             })
             
           }
    </>
  )

  
}

export default NFTbuy