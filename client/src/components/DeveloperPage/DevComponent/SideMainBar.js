import React, {useEffect, useRef, useState } from "react";
import { useAsync } from "react-async"
// import styles from "./sidebar.module.css";
import styled from "styled-components";
import { Layout, Menu } from 'antd';
import image from "../../img/투명로고.png"
import { Link } from "react-router-dom";

const Container = styled.div`
    background-color: #7DE7A6;
`
const Sidebar = styled.div` 
background-color: white;
/* border-right: 1px solid #202020; */
position: fixed;
top: 0;
bottom: 0;
left: 0;
transition: 0.4s ease;
color: #7DE7A6;
/* height: 100%; */
z-index: 400;
height: 100%;
&:hover{
    box-shadow: rgba(0,0,0,0.5) 0 0 0 9999px;

}
`   
const { Sider } = Layout;

const Button = styled.button`
position: relative;
  left: 160px; 
  top: 100px;
  width: 40px;
  height: 100px;
  z-index: 199;
  transition: 0.8s ease;
  border: 2px solid #7DE7A6;
  border-radius: 10px;
  overflow: hidden;
  color: black;
  background: #7DE7A6;
  font-size: 30px;
` 
    
  
const OpenBtn = styled.button`
width: 100%;
    height: 100%;
`
    

const Content = styled.div `
     padding: 50px 40px 0 0px;
    position: relative;
    width: 100%;
`
   

const Icon = styled.image `
    margin: 0;
    color: #202020;
`
    



const SideMainBar = ({getNum}, { width=300 }) => {
  const [isOpen, setOpen] = useState(false);
  const [xPosition, setX] = useState(width);
  const side = useRef();
  
  // button 클릭 시 토글
  const toggleMenu = () => {
    if (xPosition > 0) {
      setX(0);
      setOpen(true);
      
    } else {
      setX(width);
      setOpen(false);
    }
  };
  
  // 사이드바 외부 클릭시 닫히는 함수
   const handleClose = async e => {
    let sideArea = side.current;
    let sideCildren = side.current.contains(e.target);
    if (isOpen && (!sideArea || !sideCildren)) {
      await setX(width); 
      await setOpen(false);
    }
  }

  useEffect(()=> {
    window.addEventListener('click', handleClose);
    return () => {
      window.removeEventListener('click', handleClose);
    };
  })

  const onClick = (e) => {
    if(e === "0") getNum(0);
    else if(e === "1") getNum(1);
    else if(e === "2") getNum(2);
    else if(e === "3") getNum(3);
    else if(e === "4") getNum(4);

  }


  return (
    <Container>
      <Sidebar ref={side} style={{ width: `${width}px`, transform: `translatex(${-xPosition}px)`}}>
          <Button onClick={() => toggleMenu()}>
            {isOpen ? 
            <span>{'<'}</span> : <span>{'>'}</span>
            }
          </Button>
          <a href="/"><img src={image} width="100%" style={{marginTop: "-30%"}}></img></a>
        <Content>
         <Sider width={300} className="site-layout-background" style={{position: "fixed", transform: "none", height: "100%", marginTop: "-70px"}}>
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            style={{ height: "100%", borderRight: 0 }}
          >
            
              <Menu.Item key="1">
                <Link to="/" className="nav-text">HOME</Link>
              </Menu.Item>
              <Menu.Item key="2">
                <a onClick={()=>{onClick("0")}}>
                토큰 발행
                </a>
              </Menu.Item>
              <Menu.Item key="3">
                <a onClick={()=>{onClick("1")}}>
                  NFT 민팅
                </a>
                </Menu.Item>
              <Menu.Item key="4">
                <a onClick={()=>{onClick("2")}}>
                  Battinig
                </a>
                </Menu.Item>
              <Menu.Item key="5">
                <a onClick={()=>{onClick("3")}}>
                  관리자 권한 부여
                </a>
              </Menu.Item>
           
          </Menu>
          </Sider>
        </Content>
        
      </Sidebar>
    </Container>
  );
};


export default SideMainBar;