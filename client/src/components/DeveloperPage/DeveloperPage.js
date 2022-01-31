import React, { useState } from 'react';
import '../../App.css';
import Layout, { Content } from 'antd/lib/layout/layout';
import TokenMinting from './TokenMinting';
import Batting from '../batting/Batting';
import Auth from "./Auth"
import NftMinting from '../NFTcreate/CreateNFT'
import SideMainBar from './DevComponent/SideMainBar';

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
			
			<Layout style={{paddingTop: "70px"}}>
			<Layout width={300} className='ant-layout-has-sider' >
			<SideMainBar width={300} getNum={setNum}></SideMainBar>
				<div style={{width:"100%"}}>{obj[number]}</div>
			</Layout>
		</Layout>
		</div>
		
	);
}

export default DeveloperPage;
