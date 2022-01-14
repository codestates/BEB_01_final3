import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import LandingPage from './components/LandingPgae/LandingPage';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import UploadPage from './components/UploadPage/UploadPage';
import Bar from './components/NavBar/Bar';
import VideoDetailPage from './components/VideoDetailPage/VideoDetailPage';
import Auth from './hoc/auth';
import Search from './components/Search/Search';
import CreateNFT from './components/NFTcreate/CreateNFT';
import NftList from './components/NFTcreate/NftList';
import MyPage from './components/MyPage/MyPage';
import ExchangePage from './components/ExchangePage/ExchangePage';

// const express = require("express");
// const app = express();
// const cors = require("cors");

function App(props) {
	const [isLogin, setIsLogin] = useState(false);
	const [userInfo, setUserInfo] = useState(null);


	const isAuthenticated = () => {
		if (userInfo) {
			console.log('have userInfo');
			setIsLogin(true);
		}
	};

	const handleLogin = (req) => {
		const addr = req.address;
		console.log(addr);
		setUserInfo(addr);
		isAuthenticated();
	};

	useEffect(() => {
		isAuthenticated();
	}, []);

  useEffect(() => {
    isAuthenticated();
  }, []);
  return (
    <BrowserRouter>
      	<div className = "App">
		<Bar isLogin={isLogin} />

	  	<Routes>
					<Route exact path='/' element={<LandingPage />} />
					<Route exact path='/login' element={<LoginPage />} />
					<Route exact path='/register' element={<RegisterPage />} />
					<Route exact path='/Search' element={<Search />} />
					<Route
						exact
						path='/video/upload'
						element={<UploadPage />}
					/>
					<Route
						exact
						path='/video/:videoId'
						element={<VideoDetailPage />}
					/>
					<Route exact path='/nft/create' element={<CreateNFT />} />
					<Route exact path='/nft/list' element={<NftList />} />
					<Route exact path='/user/mypage' element={<MyPage />} />
					<Route exact path='/exchange' element={<ExchangePage />} />
				</Routes>
			</div>
		</BrowserRouter>
	);
				
}

// app.use(cors());


export default App;
