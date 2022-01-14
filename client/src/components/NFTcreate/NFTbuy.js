
import React, { useEffect, useState } from 'react'
import axios from 'axios';
// import { Facoad } from 'react-icons/fa'
import {Card,Button} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';




function NFTbuy ({nftlist}) {

   
    const navigate = useNavigate();
    const [buyer,setBuyer] = useState('');
    

   function BuyNFT(tokenId){
    axios.post('http://localhost:5000/contract/buyNFT',{tokenId:tokenId,buyer:"test1@test1"})
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
                <Card style={{ width: '18rem', margin:"1%", cursor:"pointer"}}>
                <Card.Img variant="top" src={el.imgUri} style={{height:'220px'}} />
                <Card.Body>
                  <Card.Title>Content : {el.contentTitle}</Card.Title>
                  <Card.Title>Name : {el.nftName}</Card.Title>
                  <Card.Title>Name : {el.nftName}</Card.Title>
                  <Card.Text>
                    desription : {el.description}
                  </Card.Text>
                  <Card.Title>Price : {el.price}</Card.Title>
                  <Button variant="warning" style={{fontWeight:"bold"}}  onClick={()=>{BuyNFT(el.tokenId)}}>판매중</Button>
                </Card.Body>
              </Card>
               )
             })
             
           }
    </>
  )

  
}

export default NFTbuy