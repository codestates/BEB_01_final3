import React, { useEffect, useState } from 'react';
import '../../App.css';
import Sidebar from '../DeveloperPage/DevComponent/Sidebar';
import Layout, { Content } from 'antd/lib/layout/layout';
import { Button, Card } from 'react-bootstrap';
import Avatar from 'antd/lib/avatar/avatar';
import wtImg from '../img/wtimg.png';
import axios from 'axios';
import styled from "styled-components";
import BattingList from './BattingList';
// import { default as Spinner } from './Spinner';
import { Form, Col, Row } from 'antd';


function Batting() {


	const [contentsName, setContentsName] = useState([]);
	const [isCheck, setIsCheck] = useState(false);
	const [checkName, setCheckName] = useState();
	const [state, setState] = useState(0);

	useEffect(() => {
		axios.get("/api/bat")
			.then(res => {
				//데이터 가공을 해주어야합니다. 같은 content끼리묵어야 합니다.
				//일단 몇개의 데이터가 있는지 확인해 봅시다.
			
				if (res.data.success) {
					const contentsName = res.data.contentsName;
					setContentsName(contentsName);
					// console.log(res.data);
				}
			})
	},[])

	const [list, setList] = useState([]);


	useEffect(() => {
	
		axios.post("/api/bat/contentList", {checkName})
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
	justify-content: center;
	`;
	const Content = styled.div`
	width:100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	background-color : pink;
	margin : 1%;
	`;
	const List13 = styled.div`
	width:100%;
	display: ${props => props.color || 'none'};
	flex-direction: column;
	justify-content: center;
	background-color : pink;
	margin : 1%;
	`;
	const Button = styled.button`
	 margin : 1%;
	`;
	const getCheck = (e) => {
		// console.log(e);
		setIsCheck(e);
	}

	const setCheck = (e, l, k) => {
		setIsCheck(e);
		setCheckName(l);
		setState(k)
	}

	console.log(checkName);
	return (
		
		<div
			style={{display: "flex", width:'100vw', height: '60vh',}}
		>
			{ isCheck === false ? 
			contentsName.map((el) => {
				return (
					<div style={{margin: "2%", }}>
					<Content>
					<Button variant="dark" onClick={() => {setCheck(true, el.contentName)} } >{el.contentName}</Button>
					<Card style={{ width: '19rem', margin:"1.5%", cursor:"pointer", height: "90%"}} bg='white' text='white' border='white'>
						<Card.Body style={{marginBottom: '0px', borderBottom: '1px solid #DCDCDC'}}>
						
							
							<BattingList contentName={checkName} check={isCheck} getCheck={getCheck} />
						
							<Button onClick={() => getCheck(false)}>뀨</Button> 
						</Card.Body>
					</Card>

							{/* <Button >나타내기</Button> */}
							{/* <Button onClick={() => {setIsCheck(false)} }>닫기</Button> */}
							{/* <Button>폐쇄하기</Button> */}
							{/* {isCheck === true && el.contentName === checkName ? 
							<span><BattingList contentName={checkName} check={isCheck} getCheck={getCheck} />
							<Button onClick={() => getCheck(false)}>뀨</Button></span>
							
								: <Button onClick={() => getCheck(false)}>뀨</Button>
							} */}

						
					</Content>
						
				</div>
				
				)
			})

			:

			
			contentsName.map((el) => {
				return (
					<div style={{margin: "2%", }}>
					<Content>
					<Button variant="dark" onClick={() => {setCheck(true, el.contentName)} } >{el.contentName}</Button>
					<Card style={{ width: '19rem', margin:"1.5%", cursor:"pointer", height: "90%"}} bg='white' text='white' border='white'>
						<Card.Body style={{marginBottom: '0px', borderBottom: '1px solid #DCDCDC'}}>
						
						
							{/* <BattingList contentName={checkName} check={isCheck} getCheck={getCheck} /> */}
							
							<Button onClick={() => getCheck(false)}>뀨</Button>
						</Card.Body>
					</Card>

							{/* <Button >나타내기</Button> */}
							{/* <Button onClick={() => {setIsCheck(false)} }>닫기</Button> */}
							{/* <Button>폐쇄하기</Button> */}
							{/* {isCheck === true && el.contentName === checkName ? 
							<span><BattingList contentName={checkName} check={isCheck} getCheck={getCheck} />
							<Button onClick={() => getCheck(false)}>뀨</Button></span>
							
								: <Button onClick={() => getCheck(false)}>뀨</Button>
							} */}

						
					</Content>
						
				</div>
				
				)
			})
			
		}
			






			{/* <Layout> */}
		
			{/* <Contents> */}
	
				{/* {contentsName.map((el) => { */}
					{/* return ( */}
						{/* <div style={{margin: "2%", }}> */}
						{/* <Content> */}
						{/* <Button variant="dark" onClick={() => {setCheck(true, el.contentName)} } >{el.contentName}</Button> */}
						{/* <Card style={{ width: '19rem', margin:"1.5%", cursor:"pointer", height: "90%"}} bg='white' text='white' border='white'> */}
							{/* <Card.Body style={{marginBottom: '0px', borderBottom: '1px solid #DCDCDC'}}> */}
							
								{/* { isCheck === true ? */}
								{/* <BattingList contentName={checkName} check={isCheck} getCheck={getCheck} /> */}
								{/* : */}
								{/* <Button onClick={() => getCheck(false)}>뀨</Button> } */}
							{/* </Card.Body> */}
						{/* </Card> */}

								{/* <Button >나타내기</Button> */}
								{/* <Button onClick={() => {setIsCheck(false)} }>닫기</Button> */}
								{/* <Button>폐쇄하기</Button> */}
								{/* {isCheck === true && el.contentName === checkName ? 
								<span><BattingList contentName={checkName} check={isCheck} getCheck={getCheck} />
								<Button onClick={() => getCheck(false)}>뀨</Button></span>
								
									: <Button onClick={() => getCheck(false)}>뀨</Button>
								} */}

							
						{/* </Content> */}
							
					{/* </div> */}
					
					{/* ) */}
				{/* })} */}

							
			{/* </Contents> */}
			{/* </Layout> */}
		</div>
			
		
	);
}

export default Batting;
