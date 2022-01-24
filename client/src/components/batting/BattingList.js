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


function BattingList({contentName,check}) {


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
	display: flex;
	flex-direction: column;
	flex-wrap : wrap
	width:100%;
	height: 20vh;
	justify-content: center;
	background-color : green;
	`;
	const Content = styled.div`
	 width:100%;
	`;
	
	
	return (
		
		
			<>	
			 
			{list.map((el) => {
				return (
					<>
						<Contents  className={el.contentName}>
						<Content>
								{[el.contentsName] + el.subTitle + 'Ep.' + el.serial}
								</Content>
								<Content>
								{"contentNum :" + [el.contentsNum]}
								</Content>
				
						<Content>
								<span><Button>Close</Button></span>
						<span><Button></Button></span>
						</Content>
							</Contents>
						</>
				)
			})}
		     
			</>	
		
	);
}

export default BattingList;
