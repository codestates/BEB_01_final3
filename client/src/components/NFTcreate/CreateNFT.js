/* eslint-disable */

import React, { useState } from 'react'
import { Typography, Button, Form, message } from 'antd';
import Icon from '@ant-design/icons/lib/components/Icon';
import Dropzone from 'react-dropzone';
import { PlusOutlined } from '@ant-design/icons/lib/icons';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { create } from 'ipfs-http-client';
import background from '../img/wtimg.png';
import Spinner from '../spinner/spinner';
import styled from "styled-components";
import {Card, Placeholder} from 'react-bootstrap'


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
                navigate('/user/myPage');
            }else if(res.data.failed === false){
                setLoading(false)   
                alert(res.data.reason)
            }   
          })
      }
      //loading === true ?   <Spinner></Spinner>
    
    const FirstDiv = styled.div`
      max-width: 100%;
      min-height: 50rem;
      background:#780206;
      background:-webkit-linear-gradient(to bottom, #114357,#F29492);
      background:linear-gradient(to left, #780206,#061161);
      display: flex;
      justify-content: center;
      align-items: center;
    `;
    const SeDiv = styled.div`
     width: 90%;
     height: 40rem;
     display: flex;
      justify-content: space-evenly;
      align-items: center;
  `;
    const Div = styled.div`
    width: 90%;
    height: 35rem;
    border: 1px solid #eee;
    border-radius: 5%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
   
 `;
    const ImgDiv = styled.div`
     width: 90%;
     height: 35rem;
     background: url(https://ipfs.io/ipfs/QmXH3pqhUy2U82oN1XMeP4oqtqvh8Vt44opaDnLrye3mgd) no-repeat center;
     background-size: 50% 15rem;
     border: 1px solid #eee;
     outline: none;
     cursor: pointer;
     border-radius: 5%;
      
    
     &:hover {
        background-color: gray;
        box-shadow: 1px 4px 0 rgb(0,0,0,0.5);
        opacity: 50%;
     }
  `;
    const Lable = styled.label`
    display:block;
    width: 100%;
    cursor: pointer;
    `
    const ImgInput = styled.input`
     visibility: hidden;
    `;
    const Input = styled.input`
     width: 60%;
     background-color: transparent;
     border: none;
     color: white;
     font-size: 1.5rem;
   
   `;

    const Img = styled.img`
     width: 70%;
     height: 70%;
     border: 1px dashed #eee;
     border-radius: 5%;
     margin-bottom: 4%;
   `;
   
    
    return (

        
        <>
            <FirstDiv>
        
                <SeDiv>
                     {/* 이미지 미리보기 chagne 부분 */}
                    {imgSrc === '' ?
                        <Lable>
                        <ImgDiv>
                                <ImgInput type="file" onChange={onHandleChange} />
                               
                        </ImgDiv>
                        </Lable> :
                        <Lable>
                        <Div>
                                <Img src={imgSrc} onClick={() => {setImgSrc('')}} />
                                <Input type="text" placeholder="HERE! You Write NFT NAME" />
                        </Div>
                        </Lable>
                    }
                    <Lable>
                        <Div>
                        <Input type="text" placeholder="What is the Title??"  />
                        </Div>
                        </Lable>
                </SeDiv>
    

          </FirstDiv>
            </>
       
         
        
        
        
    )
}


export default CreateNFT

