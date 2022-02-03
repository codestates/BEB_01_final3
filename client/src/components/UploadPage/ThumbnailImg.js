import React, { useState } from 'react';
import Icon from '@ant-design/icons/lib/components/Icon';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import { PlusOutlined } from '@ant-design/icons/lib/icons';
import styled from 'styled-components';
import { Row, Col } from 'react-bootstrap';

const ImgDiv = styled.div`
	width: 103%;
	height: 15rem;
	background: no-repeat center;
	background-size: 50% 20rem;
	outline: none;
	cursor: pointer;
	border: 1px solid #7de7a6;
	border-radius: 5%;
	box-shadow: 4px 12px 30px 6px rgb(0 0 0 / 9%);
	transition: all 0.2s ease-in-out;
	&:hover {
		box-shadow: 4px 12px 20px 6px rgb(0 0 0 / 18%);
		transform: translateY(5px);
	}
`;
const ImgDiv2 = styled.div`
	width: 410px;
	height: 15rem;
	background: no-repeat center;
	background-size: 50% 20rem;
	outline: none;
	cursor: pointer;
	border: 1px solid #7de7a6;
	border-radius: 5%;
	box-shadow: 4px 12px 30px 6px rgb(0 0 0 / 9%);
	transition: all 0.2s ease-in-out;
	margin-left: 20px;
	&:hover {
		box-shadow: 4px 12px 20px 6px rgb(0 0 0 / 18%);
		transform: translateY(5px);
	}
`;

function ThumbnailImg(props) {
	const [Images, setImages] = useState([]);

	const dropHandler = (files) => {
		let formData = new FormData();
		const config = {
			header: { 'content-type': 'multipart/fomr-data' },
		};
		formData.append('file', files[0]);

		axios
			.post(
				'http://localhost:5000/api/video/thumbnailImage',
				formData,
				config
			)
			.then((response) => {
				// console.log(response.data.filePath);
				if (response.data.success) {
					setImages([response.data.filePath]);
					props.refreshFunction([response.data.filePath]);
				} else {
					alert('파일을 저장하는데 실패했습니다.');
				}
			})
			.catch((err) => {
				console.log(err);
				alert('파일을 저장하는데 오류가 있습니다.');
			});
	};

	const deleteHandler = (image) => {
		const currentIndex = Images.indexOf(image);
		let newImages = [...Images];
		newImages.splice(currentIndex, 1);
		setImages(newImages);
		props.refreshFunction(newImages);
	};

	return (
		<Row style={{ marginLeft: '70px' }}>
			<br />
			<br />
			<Col xs={5}>
				<ImgDiv>
					<Dropzone onDrop={dropHandler}>
						{({ getRootProps, getInputProps }) => (
							<div
								style={{
									width: 410,
									height: 240,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
								}}
								{...getRootProps()}>
								<input {...getInputProps()} />
								<Icon
									type='plus'
									style={{ fontSize: '3rem' }}
								/>
								<PlusOutlined style={{ fontSize: '5rem' }} />
							</div>
						)}
					</Dropzone>
				</ImgDiv>
				<br />
				<label>* 썸네일 이미지를 따로 설정시 </label> <br />
				<label> 파일을 업로드 해주세요</label>
			</Col>
			<Col xs={5} style={{ marginRight: '40px' }}>
				<ImgDiv2>
					<div
						style={{
							display: 'flex',
							width: '410px',
							height: '240px',
							overflowX: 'scroll',
						}}>
						{Images.map((image, index) => (
							<div
								onClick={() => deleteHandler(image)}
								key={index}>
								<img
									style={{
										minWidth: '300px',
										width: '300px',
										height: '240px',
									}}
									src={`http://localhost:5000/${image}`}
								/>
							</div>
						))}
					</div>
				</ImgDiv2>
			</Col>
			{/* </div> */}
		</Row>
	);
}

export default ThumbnailImg;
