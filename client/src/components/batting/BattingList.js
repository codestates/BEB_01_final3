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
	flex-direction: row;
	flex-wrap : wrap
	width:100%;
	height: 100%;
	justify-content: center;
	background-color : darkgray;
	`;
	const Content = styled.div`
	 width:100%;
	`;
	
	
	return (
		
		
			<>	
			 <Contents>
			{list.map((el) => {
				return (
					<>
					
						<Card bg='white' text='black' style={{margin:'1%'}}>
                               <Card.Body>
                              <Card.Title>
                               Title : {[el.contentsName] + el.subTitle + 'Ep.' + el.serial}
									</Card.Title>
									<Card.Title>
                               contentNum : {el.contentsNum}
                               </Card.Title>
                               <span>
							   <Button variant="black" style={{border:"1px dashed gray", color:'red	'}}>Game Close</Button>
							   </span>
                            </Card.Body>
						</Card>
						</>
				)
			})}
		     </Contents>
			</>	
		
	);
}

export default BattingList;