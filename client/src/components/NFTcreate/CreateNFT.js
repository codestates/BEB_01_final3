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
import Swal from "sweetalert2";

// syled-Component 
const FirstDiv = styled.div`
max-width: 100%;
min-height: 50rem;
background:#eee;
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
outline: none;
cursor: pointer;
border-radius: 5%;
box-shadow: 4px 12px 30px 6px rgb(0 0 0 / 9%);
transition: all 0.2s ease-in-out;
&:hover {

  box-shadow: 4px 12px 20px 6px rgb(0 0 0 / 18%);
  transform: translateY(5px);

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
width: 70%;
background-color: transparent;
border: 1px dashed gray;
color: white;
font-size: 1.5rem;
border-radius: 5%;
margin-bottom: 4%;
`;

const Img = styled.img`
width: 70%;
height: 70%;
border: 1px dashed #eee;
border-radius: 5%;
margin-bottom: 4%;

`;
const TextArea = styled.textarea`
width: 70%;
height: 50%;
border: 1px dashed gray;
background-color: transparent;
font-size: 1.5rem;
border-radius: 5%;
color: white;
outline-style: none;
`;

// syled-Component 

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
        console.log(contentTitle);
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
       
    
        if (contentTitle === '' || nftDescription === '' || nftName === '' || files === '') {
            Swal.fire({
                icon: 'error',
                title: 'check your blank' ,  
                // showCancelButton: true, // cancel버튼 보이기. 기본은 원래 없음
                // confirmButtonColor: '#3085d6', // confrim 버튼 색깔 지정
                // cancelButtonColor: '#d33', // cancel 버튼 색깔 지정
                // confirmButtonText: '승인', // confirm 버튼 텍스트 지정
                // cancelButtonText: '취소', // cancel 버튼 텍스트 지정
                // reverseButtons: true, // 버튼 순서 거꾸로
              }).then(res => {
                return;
              })
        } 
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
                
                Swal.fire({
                  icon: 'error',
                  title: res.data.reason ,  
                  // showCancelButton: true, // cancel버튼 보이기. 기본은 원래 없음
                  // confirmButtonColor: '#3085d6', // confrim 버튼 색깔 지정
                  // cancelButtonColor: '#d33', // cancel 버튼 색깔 지정
                  // confirmButtonText: '승인', // confirm 버튼 텍스트 지정
                  // cancelButtonText: '취소', // cancel 버튼 텍스트 지정
                  // reverseButtons: true, // 버튼 순서 거꾸로
                }).then(res => {
                  setLoading(false)   
                  return;
                })
            }   
          })
       }
      
    
   
    
    return (

        
        <>
           
            <FirstDiv>
            {loading === true ? <Spinner /> : 
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
                                <Img src={imgSrc} onClick={() => {setImgSrc(''), setFiles('')}} />
                                <Input type="text" placeholder="HERE! You Write NFT NAME" onChange={(e)=>{setNftName(e.target.value)}} />
                        </Div>
                        </Lable>
                    }
                    <Lable>
                        <Div>
                            <Input type="text" placeholder="What is the CONTENT TITLE??" onChange={(e)=>{ setContentTitle(e.target.value)}} />
                                <TextArea placeholder="whatever you want Description!!" onChange={(e) => { setNftDescription(e.target.value) }} />
                                <Button variant="warning" onClick={onSubmit} style={{ fontSize:'1.3rem', margin:"3%", borderRadius: '5%', width:'7rem',height:'3rem',backgroundColor:'transparent'}}>
                        Submit
                    </Button>
                        </Div>
                    </Lable>                    
                </SeDiv>
      
                }
                   

                </FirstDiv>
          
            </>
       
         
        
        
        
    )
}


export default CreateNFT

