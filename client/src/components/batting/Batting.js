
  
import React, { useEffect, useState } from 'react';
import '../../App.css';
import Sidebar from '../DeveloperPage/DevComponent/Sidebar';
import Layout, { Content } from 'antd/lib/layout/layout';
import { Button, Card, ToggleButton } from 'react-bootstrap';
import Avatar from 'antd/lib/avatar/avatar';
import wtImg from '../img/wtimg.png';
import axios from 'axios';
import styled from "styled-components";
import BattingList from './BattingList';
import BetDetail from './BatDetail';
// import { default as Spinner } from './Spinner';
import { Form, Col, Row } from 'antd';
import Spinner from '../spinner/nftListSpinner'


function Batting() {

	const [modalShow, setModalShow] = useState(false);
	const [betInfo, setBetInfo] = useState();
	const [contentNum, setContentNum] = useState();
	const [contentsName, setContentsName] = useState([]);
	const [isCheck, setIsCheck] = useState(false);
	const [name, setName] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	// const [num, setNum] = useState(0);

	useEffect(() => {
		axios.get("/api/bat")
			.then(res => {
				//데이터 가공을 해주어야합니다. 같은 content끼리묵어야 합니다.
				//일단 몇개의 데이터가 있는지 확인해 봅시다.
				if (res.data.success) {
					let contentName = res.data.contentsName;
					setContentsName(contentName);
					console.log(res.data);
				}
			})
	},[])

	const Contents = styled.div`
	width: 100%;
	height : 100%;
	display: flex;
	flex-wrap : wrap;
	justify-content: center;
	background-color: transparent;
	`;

	const Content = styled.div`
	width:30%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	background-color: transparent;
	border-radius: 4%;
	margin : 1%;
	border: 1px solid rgb(125,231,166);
	&:hover {

box-shadow: 4px 12px 20px 6px rgb(0 0 0 / 18%);
transform: translateY(5px);

}
	`;
	
	const List13 = styled.div`
	width:100%;
	display: ${props => props.color || 'none'};
	flex-direction: column;
	justify-content: center;
	background-color : pink;
	margin : 1%;
	`;
	
	function Name(num){
		console.log(num);
	    
		setName("active");
		const com = document.querySelector('.active' + num);	
		
		if (com.style.display === 'none') {
			com.style.display = 'block';
		} else {
			com.style.display = 'none';
		}
		;
	}
	

	const closeContent = (info) => {
		setIsLoading(true);

		axios.post("/api/bat/closeContent", { contentNum: info.contentNum })
			.then(res => {
				console.log(res);
				setIsLoading(false);
			})
			

	}
	const payOut = (info) => {
		setIsLoading(true);

		axios.post("/api/bat/payOut", { contentNum: info.contentNum,answer:'ㅁㄹㅇ'})
			.then(res => {
				console.log(1);
				console.log(res);
				setIsLoading(false);
			})
					

	}
	function Auction(contentName,contentNum) {
       console.log(1,contentName,contentNum);
		if (modalShow) {
		  setModalShow(false);
		} else {
		  setModalShow(true);
		}
		setBetInfo(contentName);
		setContentNum(contentNum)
		}
   

	
	return (
		
		<>
			<Contents>
		{isLoading === true ? <Spinner /> :
					<>
				{modalShow === true ? <BetDetail show={Auction} betData={betInfo} contentNum={contentNum}/> : null}
				{contentsName.map((el) => {
				
						return (
							<>
								
								<Content>
									<Card style={{borderRadius:"4%"} }>
									<Card.Img variant="top" src="https://ipfs.io/ipfs/QmRdcvE8DUmDoDFHhz6qVw5VWwoknW5eksqGcEcMSYK4Gc" style={{ width: '25 rem', height:'15rem',border:"1px solid #7DE7A6", borderTopLeftRadius:"4%",borderTopRightRadius:"4%"}}/>
                               <Card.Body>
								<Card.Title>
								<a onClick={() => { Name(el.contentNum) }} style={{color:"#7DE7A6"}}>Content : {el.contentName}</a>
                               </Card.Title>
                              <span>
							<Button variant="black" style={{border:"1px solid #7DE7A6",fontWeight:"bold",fontSize:"1.5rem",color:"#7DE7A6"}} onClick={() => {Auction(el.contentName,el.contentNum)}} >Detail</Button>
                              </span> 
                            </Card.Body>
									</Card>
								
										
									
							</Content>
								
						</>
						
						)
					})}
		</>
	
				}
				</Contents>
		</>
	);
}

export default Batting;