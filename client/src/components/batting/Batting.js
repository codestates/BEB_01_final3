import React, { useEffect, useState } from 'react';
import '../../App.css';
import Sidebar from '../DeveloperPage/DevComponent/Sidebar';
import Layout, { Content } from 'antd/lib/layout/layout';
import { Button, Card } from 'react-bootstrap';
import Avatar from 'antd/lib/avatar/avatar';
import wtImg from '../img/wtimg.png';
import axios from 'axios';
import styled from "styled-components";
// import { default as Spinner } from './Spinner';
import { Form, Col, Row } from 'antd';


function Batting() {


	const [contentsName, setContentsName] = useState([]);

	useEffect(() => {
		axios.get("/api/bat")
			.then(res => {
				//데이터 가공을 해주어야합니다. 같은 content끼리묵어야 합니다.
				//일단 몇개의 데이터가 있는지 확인해 봅시다.
				console.log(1);
				if (res.data.success) {
					const contentsName = res.data.contentsName;
					setContentsName(contentsName);
					console.log(res.data.content);
				}
			})
	},[])

	const Contents = styled.div`
	display: flex;
	flex-direction: column;
	flex-wrap : wrap
	justify-content: center;
	`;
	const Content = styled.div`
	display: flex;
	justify-content: center;
	background-color : pink;
	height : 30vh;
	width :  30vw;
	margin : 1%;
	`;
	const Button = styled.button`
	 margin : 1%;
	`;

	
	return (
		
		
			<>	
				
		<Contents>
		
					{contentsName.map((el) => {
						return (
							<Content>
								<div>{el.contentName}</div>
								<div>
									<Button>폐쇄하기</Button>
									<Button>폐쇄하기</Button>
									<Button>폐쇄하기</Button>
								</div>
							</Content>
						
						)
					})}
				</Contents>
			</>	
		
	);
}

export default Batting;
