
  
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
	const [name, setName] = useState("");
	// const [num, setNum] = useState(0);

	useEffect(() => {
		axios.get("/api/bat")
			.then(res => {
				//데이터 가공을 해주어야합니다. 같은 content끼리묵어야 합니다.
				//일단 몇개의 데이터가 있는지 확인해 봅시다.
			
				if (res.data.success) {
					const contentsName = res.data.contentsName;
					setContentsName(contentsName);
					console.log(res.data);
				}
			})
	},[])

	const Contents = styled.div`
	width: 70vw;
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
	
	function Name(num){
	    
		setName("active");
		const com = document.querySelector('.active' + num);	
		
		if (com.style.display === 'none') {
			com.style.display = 'block';
		} else {
			com.style.display = 'none';
		}
		;
	}
	

	
	return (
		
		
		<Layout style={{display:'flex',justifyContent:'center',alignItems:'center', backgroundColor:"gray"}}>
		
			<Contents>
		
				{contentsName.map((el) => {
				
						return (
							<>
								<Content onClick={() => { Name(el.contentNum) }}>
								<Card bg='black' text='danger'>
                               <Card.Body>
                              <Card.Title>
                               Content : {el.contentName}
                               </Card.Title>
                              <span>
							<Button variant="black" style={{border:"1px dashed gray"}}>Game Close</Button>
                              </span> 
                            </Card.Body>
									</Card>
										<div className={name + el.contentNum} style={{display:'none'} } >
										<BattingList id={el.contentsName} contentName={el.contentName} check={isCheck}></BattingList>
									</div>
							</Content>
								
						</>
						
						)
					})}
			</Contents>
		</Layout>	
		
	);
}

export default Batting;