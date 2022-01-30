import React, { useState } from 'react'
import Icon from '@ant-design/icons/lib/components/Icon';
import Dropzone from 'react-dropzone'
import axios from 'axios';
import { PlusOutlined } from '@ant-design/icons/lib/icons';
import styled from "styled-components";

const ImgDiv = styled.div`
width: 43%;
height: 15rem;
background:  no-repeat center;
background-size: 50% 20rem;
outline: none;
cursor: pointer;
border: 1px solid #7DE7A6;
border-radius: 5%;
box-shadow: 4px 12px 30px 6px rgb(0 0 0 / 9%);
transition: all 0.2s ease-in-out;
&:hover {

  box-shadow: 4px 12px 20px 6px rgb(0 0 0 / 18%);
  transform: translateY(5px);

}
`;
const ImgDiv2 = styled.div`
width: 50%;
height: 15rem;
background:  no-repeat center;
background-size: 50% 20rem;
outline: none;
cursor: pointer;
border: 1px solid #7DE7A6;
border-radius: 5%;
box-shadow: 4px 12px 30px 6px rgb(0 0 0 / 9%);
transition: all 0.2s ease-in-out;
&:hover {

  box-shadow: 4px 12px 20px 6px rgb(0 0 0 / 18%);
  transform: translateY(5px);

}
`;

function UserImg(props) {

    const [Images, setImages] = useState([])

    const dropHandler = (files) => {

        let formData = new FormData();
        const config = {
            header: { 'content-type': 'multipart/fomr-data' }
        }
        formData.append("file", files[0])


        axios.post('http://localhost:5000/api/video/image', formData, config)
            .then(response => {
                if (response.data.success) {
                    setImages([...Images, response.data.filePath])
                    props.refreshFunction([...Images, response.data.filePath])
                } else {
                    alert('파일을 저장하는데 실패했습니다.')
                }
            })
    }

    const deleteHandler = (image) => {
        const currentIndex = Images.indexOf(image);
        let newImages = [...Images]
        newImages.splice(currentIndex, 1)
        setImages(newImages)
        props.refreshFunction(newImages)
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <ImgDiv>
            <Dropzone onDrop={dropHandler}>
                {({ getRootProps, getInputProps }) => (
                    <div
                        style={{
                            width: 300, height: 240, 
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                        {...getRootProps()}>
                        <input {...getInputProps()} />
                        <Icon type="plus" style={{ fontSize: '3rem' }} />
                        <PlusOutlined style={{ fontSize: '5rem' }} />
                    </div>
                )}
            </Dropzone>
            </ImgDiv>
            <ImgDiv2>
            <div style={{ display: 'flex', width: '350px', height: '240px', overflowX: 'scroll' }}>

                {Images.map((image, index) => (
                    <div onClick={() => deleteHandler(image)} key={index}>
                        <img style={{ minWidth: '300px', width: '300px', height: '240px' }}
                            src={`http://localhost:5000/${image}`}
                        />
                    </div>
                ))}
            </div>
            </ImgDiv2>
        </div>
    )
}

export default UserImg
