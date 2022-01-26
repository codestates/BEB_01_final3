import React, { useState } from 'react';
import '../../App.css';
import Sidebar from './DevComponent/Sidebar';
import Layout, { Content } from 'antd/lib/layout/layout';
import { Button, Card } from 'react-bootstrap';
import Avatar from 'antd/lib/avatar/avatar';
import wtImg from '../img/wtimg.png';
import axios from 'axios';
import { default as Spinner } from './Spinner';
import { Form, Col, Row } from 'antd';
import TokenMinting from './TokenMinting';
import Batting from '../batting/Batting';
import Auth from "./Auth"
import NftMinting from '../NFTcreate/CreateNFT'

function DeveloperPage() {
	
	const [number, setNumber] = useState(0);



	const obj = {
		0: <TokenMinting />,
		1: <NftMinting />,
		2: <Batting />,
		3: <Auth />
	}

	const setNum = (number) => {
		console.log(number);
		setNumber(number)
	}
	
	return (
		<div>
			<Layout>
			<Layout width={300} className='ant-layout-has-sider'>
				<Sidebar  getNum={setNum} />
				<div style={{width:"100%"}}>{obj[number]}</div>
			</Layout>
		</Layout>
		</div>
		
	);
}

export default DeveloperPage;
