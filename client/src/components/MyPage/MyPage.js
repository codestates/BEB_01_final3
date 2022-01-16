import React, { useState,useEffect } from 'react'

import {useSelector,useDispatch} from 'react-redux';
import { loginUser, auth } from  '../../actions/user_action'
import { useNavigate, useParams } from 'react-router-dom';
import {Card,Button} from 'react-bootstrap'
import wtImg from '../img/wtimg.png'

import { myPageCheck} from '../../actions/user_action'
import axios from 'axios';

function MyPage() {
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")
    const [pbKey,setPbKey] = useState('');
    const [privKey, setPrivKey] = useState('');
    const [nftInfo, setNftInfo] = useState([]);
    const [userInfo, setUserInfo] = useState('');
    const [wtToken, setWtToken] = useState('');
    const [nwtToken, setNwtToken] = useState('');
    const [isCheck, setIsCheck] = useState(false)
    const [sellPrice, setSellPrice] = useState('');

    
    

     

    
      

   useEffect(()=>{
        axios.get('/api/contract/myPage')
        .then(res => {
        const nftInfo = res.data.nftInfo
        const userInfo = res.data.userInfo
       if(nftInfo !== undefined){
        
        setNftInfo(nftInfo)
        setIsCheck(true) 
        }
    
      setPrivKey(userInfo.privateKey);
      setPbKey(userInfo.publicKey);
      setUserInfo(userInfo);
      setWtToken(userInfo.wtToken)
      setNwtToken(userInfo.nwtToken)
    
     
      })
   },[])



   
  function sellNFT(tokenId){
      

    console.log(tokenId);
    console.log(sellPrice);

    axios.post('http://localhost:5000/api/contract/nft/sell',{tokenId,sellPrice})
    .then(res=>{
        if(res.data.success){
            window.location.reload()
        }
    })
      
  }
  function cancel(tokenId){
      

    console.log(tokenId);

    axios.post('http://localhost:5000/contract/nft/cancel',{tokenId})
    .then(res=>{
        if(res.data.success){
            window.location.reload()
        }
    })
      
  }

  console.log(pbKey);
    return (
        <div style={{
            margin:'2% auto',
            width : '90%',
            display : 'flex',
            flexDirection : "row",
            justifyContent : 'space-between',
            flexWrap:'wrap',
           
            
        }}>
         <div style={{
             width:'50%',
             height:'18rem',
             backgroundColor :'red',
             display:'flex',
             flexDirection : "column",
             backgroundColor :'#eee' 
         }}>
            <div style={{
                width:'100%',
                height:"50%",
                
            }}>
                <p>보유 유동성 토큰</p>
                <p><input value={wtToken} readOnly style={{border:"none", backgroundColor:"#eee"}}/></p>
            </div>
            <div style={{
                width:'100%',
                height:"50%",
               
            }}>
               <p>스테이블 토큰</p>
                <p><input value={nwtToken} readOnly style={{border:"none", backgroundColor:"#eee"}}/></p>
                
            </div>
         </div>
         <div style={{
             width:'50%',
             height:'18rem',
             backgroundColor :'#eee' 
         }}>
          <div style={{
                width:'100%',
                height:"50%"
            }}>
                <p>내 주소</p>
                <p>{pbKey}</p>
            </div>
            <div style={{
                width:'100%',
                height:"50%"
            }}>
                <p>비공개키</p>
                <p>{privKey}</p>
            </div>
         </div>
         <div style={{
             width:'100%',
             height:'100%',
             display :'flex',
             flexWrap:'wrap',
             backgroundColor:'gray',
            
         }}>
             <div style={{
                 width:'100%'
             }}>
                 <div style={{padding:"1%", borderBottom:"1px dashed"}}>
                    <span><img src={wtImg}></img></span> 
                    <p style={{fontWeight:"bold",fontSize:"10rem"}}>MY NFT</p>
                 </div>
             </div>
           

        
           {
           
           isCheck ? 
             nftInfo.map((el)=>{
               return(
                <Card style={{ width: '20rem',margin:"1%" ,cursor:"pointer"}} >
                <Card.Img variant="top" src={el.imgUri} style={{height:'220px'}} />
                <Card.Body style={{marginRight:'1%'}}>
                  <Card.Title>Content : {el.contentTitle}</Card.Title>
                  <Card.Title>Name : {el.nftName}</Card.Title>
                  <Card.Text>
                    desription : {el.description}
                  </Card.Text>
                  <Card.Title>Name : {el.nftName}</Card.Title>
                  {el.sale ? 
                   <>
                  <Button variant="primary" style={{marginRight:"2%"}}>판매중</Button> 
                  <Button variant="danger" onClick={()=>{cancel(el.tokenId)}}>판매취소</Button> 
                 </>
                  :  <>
                  <Button variant="primary" style={{marginRight:"2%"}} onClick={()=>{sellNFT(el.tokenId)}}>판매</Button>
                  <input type="text" size="10" style={{border:"none",borderBottom:"1px solid"}} 
                  onChange={(e)=>{setSellPrice(e.target.value)}}></input><span><img src={wtImg} style={{height:'3vh',width:'1.5vw'}}></img></span> 
                   </>}
              
                 
                </Card.Body>
              </Card>
               )        
             })
             :<div style={{height:'300px'}}> NFT를 소유하고 있지않습니다.</div>
           }
         
          
         </div>
         
         
            
        
        </div>
    )
}

export default MyPage
