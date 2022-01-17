import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from './components/LandingPgae/LandingPage';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import UploadPage from './components/UploadPage/UploadPage';
import Bar from './components/NavBar/Bar';
import VideoDetailPage from './components/VideoDetailPage/VideoDetailPage';
import Auth from './hoc/auth';
import SearchNft from './components/Search/SearchNft';
import CreateNFT from './components/NFTcreate/CreateNFT';
import NftList from './components/NFTcreate/NftList';
import MyPage from './components/MyPage/MyPage';
import ExchangePage from './components/ExchangePage/ExchangePage';
import SearchContent from "./components/Search/SearchContent";
import DeveloperPage from "./components/DeveloperPage/DeveloperPage";
import CounterPage from "./components/VideoDetailPage/CounterPage/CounterPage";
import SearchFail from "./components/Search/SearchFail";


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

  return (
    <BrowserRouter>
      <div className="App">
        <Bar isLogin={isLogin} />
        {/*
        A <Switch> looks through all its children <Route>
        elements and renders the first one whose path
        matches the current URL. Use a <Switch> any time
        you have multiple routes, but you want only one
        of them to render at a time
      */}
	  	
        <Routes>
          <Route exact path="/" element={Auth(LandingPage, null)} />
          <Route exact path="/login" element={Auth(LoginPage, false)} />
          <Route exact path="/register" element={Auth(RegisterPage, false)} />
          <Route exact path="/video/upload" element={Auth(UploadPage, true)} />
          <Route exact path="/video/:videoId" element={Auth(VideoDetailPage, null)} />
          <Route exact path="/nft/create" element={Auth(CreateNFT, true, true)} />
          <Route exact path="/Developer" element={Auth(DeveloperPage, true, true)} />
          <Route exact path="/nft/list" element={Auth(NftList, null)} />
          <Route exact path="/user/mypage" element={Auth(MyPage, true)} />
          <Route exact path="/exchange" element={Auth(ExchangePage, true)} />
          <Route exact path='/SearchNft' element={Auth(SearchNft, null)} />
          <Route exact path='/SearchFail' element={Auth(SearchFail, null)} />
	    	  <Route exact path='/SearchContent' element={Auth(SearchContent, null)} />
          <Route exact path="/video/:videoId/counterpage" element={Auth(CounterPage, true)} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
// true, true => 관리자 페이지
//  null    =>  아무나 출입이 가능한 페이지
//     true    =>  로그인한 유저만 출입이 가능한 페이지
//     false   =>  로그인한 유저는 출입 불가능한 페이지
 
				


// app.use(cors());


export default App;
