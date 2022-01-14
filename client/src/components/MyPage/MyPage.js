import React, { useState,useEffect } from 'react'

import {useSelector,useDispatch} from 'react-redux';
import { loginUser, auth } from  '../../actions/user_action'
import { useNavigate, useParams } from 'react-router-dom';
import {Card,Button} from 'react-bootstrap'

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
    const [isCheck, setIsCheck] = useState(false)
    const user = useSelector(state => state.user)
    
    

    
      

   useEffect(()=>{
   

    async function page (){

        // const email = user.userData.email;
        // console.log(email);
        dispatch(myPageCheck("test@test")) //reducer
        .then(response => {
            console.log(response);
     if(response.payload.nftInfo[0] !== undefined){
    //   console.log(res.data.userInfo[0]);
      setNftInfo(response.payload.nftInfo)
      setPrivKey(response.payload.userInfo.privateKey);
      setPbKey(response.payload.userInfopublicKey);
      setUserInfo(response.payload.userInfo[0]);
      setIsCheck(true) 
     }
      })
           
    }
    page();
   
   },[])



     

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
                <p><input value={userInfo.erc20Token} readOnly style={{border:"none", backgroundColor:"#eee"}}/></p>
            </div>
            <div style={{
                width:'100%',
                height:"50%",
               
            }}>
                <p>보유 스테이블 토큰</p>
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
                 <p>My NFT</p>
             </div>

        
           {
           
           isCheck ? 
             nftInfo.map((el)=>{
               return(
                <Card style={{ width: '20rem',margin:"1%"}}>
                <Card.Img variant="top" src={el.imgUri} style={{height:'220px'}} />
                <Card.Body style={{marginRight:'1%'}}>
                  <Card.Title>Content : {el.contentTitle}</Card.Title>
                  <Card.Title>Name : {el.nftName}</Card.Title>
                  <Card.Text>
                    desription : {el.description}
                  </Card.Text>
                  <Card.Title>Name : {el.nftName}</Card.Title>
                  
                  <Button variant="primary" >buy</Button>
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
