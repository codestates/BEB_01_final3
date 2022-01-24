import React, { useEffect, useState } from 'react';
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
	const [totalWT, setTotalWT] = useState(0);
	const [serverWTAmount, setServerWTAmount] = useState(0);
	const [totalNWT, setTotalNWT] = useState(0);
	const [serverNWTAmount, setServerNWTAmount] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [number, setNumber] = useState(0);

	useEffect(() => {
		async function getTokens() {
			try {
				const res = await axios.get('/api/contract/totalTokens');
				const tokens = await res.data;
				setTotalWT(tokens.data.totalWT);
				setTotalNWT(tokens.data.totalNWT);
				setServerWTAmount(tokens.data.serverWT);
				setServerNWTAmount(tokens.data.serverNWT);
			} catch (err) {
				console.log(err);
			}
		}
		getTokens();
	}, []);

	const onSubmitWT = async (e) => {
		// console.log('WT token');
		setIsLoading(true);
		await axios
			.get('/api/contract/token/faucetWT')
			.then((res) => {
				// console.log(res);
				setIsLoading(false);
				alert('WT 추가 발급 완료');
				window.location.reload();
			})
			.catch((err) => {
				setIsLoading(false);
				alert('WT 추가 발급 오류');
				// console.log(err);
			});
	};

	const onSubmitNWT = async (e) => {
		// console.log('NWT token');
		setIsLoading(true);
		await axios
			.get('/api/contract/token/faucetNWT')
			.then((res) => {
				setIsLoading(false);
				alert('NWT 추가 발급 완료');
				window.location.reload();
			})
			.catch((err) => {
				setIsLoading(false);
				alert('NWT 추가 발급 오류');
			});
	};

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
