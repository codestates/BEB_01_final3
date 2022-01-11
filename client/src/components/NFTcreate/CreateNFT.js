import React, { useState } from 'react'
import { Typography, Button, Form, Input, message } from 'antd';
import Dropzone from 'react-dropzone';
import { PlusOutlined } from '@ant-design/icons/lib/icons';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { create } from 'ipfs-http-client';
import background from './upload.png';

const { TextArea } = Input
const { Title, Text } = Typography

const PrivateOptions = [
    { value: 0, label: 'Private' },
    { value: 1, label: 'Public' },
]

const CategoryOptions = [
    { value: 0, label: 'Film & Animation' },
    { value: 1, label: 'Autos & Vehicles' },
    { value: 2, label: 'Music' },
    { value: 3, label: 'Pets & Animals' },
]
const CreateNFT = (props) => {
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
          console.log(nftName);

          const result = {
             userId : "jun",
             contentTitle : contentTitle,
             nftName : nftName,
             nftDescription : nftDescription,
             imgURI : `https://ipfs.io/ipfs/${imgHash.path}`,
             tokenURI : `https://ipfs.io/ipfs/${tokenURI.path}`,
             price : price
          }

          
          axios.post("http://localhost:5000/contract/",{
              result : result
          })
          .then((res)=>{
              
            if(res.success){
                console.log(res);
                navigate('/nft/list');
            }else{
                alert('무엇인가가 잘못 되었습니다!! 확인해주세요')
            }   
                
            
         
            
          })
    
        
        
        
      }

    return (
        <div style={{
            maxWidth: '100%',
            backgroundColor:'black'
        }}>
        <div
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
                <div style={{width:"100%",height: "400px ",border:"1px dashed"}}> 
                {imgSrc == '' ?
                 <label style={{cursor:"pointer"}}>
                <div style={{
                     width :  "100%",
                     height: "500px",
                     display: 'flex',
                      justifyContent: 'space-between',
                       background : `url(${background}) no-repeat center center`,backgroundSize:"100% auto ",

                     }}>
                     <input type="file" style={{visibility:"hidden"}}  onChange={onHandleChange}></input>
                </div>
                </label> :
                 <>
                 
                 <img src={imgSrc} style={{width:"100%",height:"100%"}}></img>
                 </>
                }
                </div>
                <div style={{
                    marginTop:"8%"
                }}>
                <div style={{backgroundColor:"black"}}>
                <label style={{fontSize:"3rem",fontFamily:"fantasy",color:"red"}}>Content Title </label>
                </div>
                <Input onChange={(e)=>{setContentTitle(e.target.value)}} style={{color:"white",backgroundColor:"black"}} />
                <br />
                <br />
                <div style={{backgroundColor:"black"}}>
                <label style={{fontSize:"3rem",fontFamily:"fantasy",color:"red"}}>NFT NAME </label>
                </div>
                <Input  onChange={(e)=>{setNftName(e.target.value)}} style={{color:"white",backgroundColor:"black"}} />
                <br />
                <br />

                <div style={{backgroundColor:"black"}}>
                <label style={{fontSize:"3rem",fontFamily:"fantasy",color:"red"}}>Content Description </label>
                </div>
                <TextArea  onChange={(e)=>{setNftDescription (e.target.value)}}   style={{color:"white",backgroundColor:"black"}}/>
                
                </div>

                <div style={{backgroundColor:"black"}}>
                <label style={{fontSize:"3rem",fontFamily:"fantasy",color:"red"}}>PRICE</label>
                </div>
                <Input  onChange={(e)=>{setPrice(e.target.value)}} style={{color:"white",backgroundColor:"black"}} />
                <br />
                <br />
                
               
                <Button type="primary" size="large" onClick={onSubmit}>
                    Submit
                </Button>
            </Form>
           
        </div>
        </div>
    )
}


export default CreateNFT
