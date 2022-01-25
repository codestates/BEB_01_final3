
import React, { useEffect, useState } from 'react'
import axios from 'axios';
// import { Facoad } from 'react-icons/fa'
import {Card,Button} from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom';
import {HeartOutlined, HeartFilled} from '@ant-design/icons'; 
import LikeDisLike from './LikeDisLike';
import Form from 'antd/lib/form/Form';



function NFTauction({ nftlist }) {
  
    const navigate = useNavigate();
    const [buyer,setBuyer] = useState('');
    const [check, setCheck] = useState(false);
    const [sell, setSell] = useState(false);
    const [userbids, setuserbids] = useState("");
    const [tokenId, settokenId] = useState("");
    const nftId = useParams().nftId;
    console.log(nftlist);

    const onClick = () => {
      console.log('좋아요?');
      check ? setCheck(false) : setCheck(true);
    }
    
    const onUserBids = (e) => {
        setuserbids(e.currentTarget.value)
    }
    const onTokenId = (e) => {
        settokenId(e.currentTarget.value)
    }

//    function Bid(tokenId) {
//        axios.post('/api/contract/bid', {tokenId:tokenId})
//        .then((res) => {
//         if(res.data.failed === false){
//           alert('구매가 되지 않았습니다. 확인해주세요!!!, reason :'+res.data.reason)
//         }else if(res.data.success){
//           alert('구매가 완료되었습니다. 구매자의 mypage로 이동하겠습니다.')
//           navigate('/user/myPage')
//         }
//      });
//    }

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
                    Price : {el.price}
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
                 
                  <div style={{width:"55%"}}></div>
                  <LikeDisLike userId={localStorage.getItem('userId')} nftId={ el._id } />
                </Card.Body>
                  
                
              </Card>
            
               )
             })
             
           }
    </>
  )

  
}

export default NFTauction