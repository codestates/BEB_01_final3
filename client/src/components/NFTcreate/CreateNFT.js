/* eslint-disable */

import React, { useState } from 'react'
import { Typography, Button, Form, Input, message } from 'antd';
import Dropzone from 'react-dropzone';
import { PlusOutlined } from '@ant-design/icons/lib/icons';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { create } from 'ipfs-http-client';
import background from '../img/wtimg.png';
import Spinner from '../spinner/spinner';



const CreateNFT = (props) => {
    
const { TextArea } = Input
const { Title, Text } = Typography


    const ipfs = create({
        host: 'ipfs.infura.io',
        port: 5001,
        protocol: 'https',
      });

    const navigate = useNavigate();
    const user = useSelector((state) => state.user)
  //크롬 redux스토어 도구를 보면 user라는 state가 있다.
  //해당 state의 모든 json 데이터 들이 user라는 변수에 담긴다.
     const [files, setFiles] = useState('');
    const [imgSrc, setImgSrc] = useState('');
    const [Description, setDescription] = useState('')
    const [contentTitle, setContentTitle] = useState('')
    const [nftName, setNftName] = useState('')
    const [nftDescription, setNftDescription] = useState('')
    const [price, setPrice] = useState('')
    const [loading, setLoading] = useState(false)
    
    const onHandleChange = (event) => {
        event.preventDefault();
        setFiles(event.target.files[0]);
        let fileReader = new FileReader();
        let file = event.target.files[0];
        fileReader.readAsDataURL(file);
        // fileReader.readAsText(e.target.files[0], 'UTF');
        fileReader.onload = (e) => {
          setImgSrc(e.target.result);
        };
      };    
      const onClickXButton = () => {
        setImgSrc('');
      };
    const onSubmit = async (e) => {
        e.preventDefault() //새로고침방지
        setLoading(true)
        //ipfs로 imgURI를 먼저 얻는다. 
        const imgHash = await ipfs.add(files);
      
        // tokenUri에 들어가는 metadata입니다. 
        const metadata = {
            contentTitle: contentTitle,
            nftName: nftName,
            nftDescription : nftDescription,
            imgURI: `https://ipfs.io/ipfs/${imgHash.path}`,
          };
          const tokenURI = await ipfs.add(JSON.stringify(metadata));
          const result = {
             contentTitle : contentTitle,
             nftName : nftName,
             nftDescription : nftDescription,
             imgURI : `https://ipfs.io/ipfs/${imgHash.path}`,
             tokenURI : `https://ipfs.io/ipfs/${tokenURI.path}`,
             price : price
          }
        
        console.log('------ipfs 종료 / 트랜잭션 시작-------');
          
          axios.post("/api/contract/nft/create",{
              result : result
          })
          .then((res)=>{
              
            if(res.data.success){
                setLoading(false)
                navigate('/nft/list');
            }else if(res.data.failed === false){
                setLoading(false)   
                alert(res.data.reason)
            }   
          })
      }

    return (

        

        
        <div style={{
            maxWidth: '100%',
            minHeight: "50rem",
            backgroundColor:'black'
        }}>
            {
                loading === true ?   <Spinner></Spinner>
                : <div
                style={{
                    maxWidth: '700px',
                    margin: 'auto',
                }}
            >   
                <div
                    style={{
                        textAlign: 'center',
                        marginBottom: '2rem',
                    }}
                >
                    <Title level={1} >
                        <Text style={{fontSize:"3rem",fontFamily:"fantasy",color:"red"}}>NFT MINT</Text>
                    </Title>
                </div>
                 
                <Form onSubmit={onSubmit}>
                    <div style={{width:"100%",height: "500px"}}> 
                    {imgSrc == '' ?
                     <label style={{cursor:"pointer"}}>
                    <div style={{
                         width :  "100%",
                         height: "500px",   
                         background : `url(${background}) no-repeat center center`,backgroundSize:"100% auto ",
                         }}>
                         <input type="file" style={{visibility:"hidden"}}  onChange={onHandleChange}></input>
                    </div>
                    </label> :
                     <>
                     <button style={{ backgroundColor: 'black', color: "red" }} onClick={() => {setImgSrc('')} }>X</button>
                     <img src={imgSrc} style={{width:"100%",height:"100%"}}></img>
                     </>
                    }
                    </div>
                    <div style={{
                        marginTop:"5%"
                    }}>
                    <div style={{backgroundColor:"black", marginTop:"3%"}}>
                    <label style={{fontSize:"3rem",fontFamily:"fantasy",color:"red"}}>Content Title </label>
                    </div>
                    <Input onChange={(e)=>{setContentTitle(e.target.value)}} style={{color:"white",backgroundColor:"black"}} />
                    <div style={{backgroundColor:"black", marginTop:"3%"}}>
                    <label style={{fontSize:"3rem",fontFamily:"fantasy",color:"red"}}>NFT NAME </label>
                    </div>
                    <Input  onChange={(e)=>{setNftName(e.target.value)}} style={{color:"white",backgroundColor:"black"}} />
                    <div style={{backgroundColor:"black",  marginTop:"3%" }}>
                    <label style={{fontSize:"3rem",fontFamily:"fantasy",color:"red"}}>Content Description </label>
                    </div>
                    <TextArea  onChange={(e)=>{setNftDescription (e.target.value)}}   style={{color:"white",backgroundColor:"black"}}/>
                    </div>
    
                    {/* <div style={{backgroundColor:"black"}}>
                    <label style={{fontSize:"3rem",fontFamily:"fantasy",color:"red"}}>PRICE (NWT)</label>
                    </div>
                    <Input  onChange={(e)=>{setPrice(e.target.value)}} style={{color:"white",backgroundColor:"black"}} />
                    <br />
                    <br /> */}
                   
                            <Button variant="warning" size="large" onClick={onSubmit} style={{ margin:"3%"}}>
                        Submit
                    </Button>
                </Form>
               
            </div>
            }
          
       
        </div>
        
    )
}


export default CreateNFT
