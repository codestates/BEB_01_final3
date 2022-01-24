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


function BattingList({contentName, check, getCheck}) {


	const [list, setList] = useState([]);


	useEffect(() => {
	
		axios.post("/api/bat/contentList", {contentName})
			.then(res => {
				//데이터 가공을 해주어야합니다. 같은 content끼리묵어야 합니다.
				//일단 몇개의 데이터가 있는지 확인해 봅시다.
			
				if (res.data.success) {
					setList(res.data.info);
				}
			})
	},[])

	const Contents = styled.div`
	/* display: ${check === true ? 'flex' : 'none'}; */
	display: flex;
	flex-direction: column;
	flex-wrap : wrap
	width:100%;
	height: 20vh;
	justify-content: center;
	background-color : white;
	color : black;
	`;
	const Content = styled.div`
	 width:100%;
	`;
	const List = styled.div`
	width:100%;
	display: ${props => props.color || 'none'};
	flex-direction: column;
	justify-content: center;
	background-color : pink;
	margin : 1%;
	`;
	console.log({contentName},{check});

	const onClick = (e) => {
		
		getCheck(false);
	}
	console.log(list);

	const result = []

	

console.log(result);

	return (
		
		
			<div>	
			{check === true ? 
				list.map((el) => {
					return (
						<>
							<Contents>
								<Card.Title style={{textAlign:'center', marginTop: '3%', marginLeft:'-3%',}}>
									{[el.contentsName] + el.subTitle + 'Ep.' + el.serial}
								</Card.Title>
								<Card.Title style={{textAlign:'center', marginTop: '3%', marginLeft:'-3%'}}>
									{"contentNum : " + [el.contentsNum]}
								</Card.Title>
					
								{/* <Content> */}
								<span><Button onClick={()=>onClick()}>Close</Button></span>
								{/* <span><Button></Button></span> */}
							{/* </Content> */}
							</Contents>
							</>
					)
				})
				: <div></div>
			} 
			
		     
			</div>	
		
	);
}

export default BattingList;
