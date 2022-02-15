import React, { useState, useEffect } from 'react';
import {
  Navbar,
  Nav,
  NavDropdown,
  Container,
  Offcanvas,
  Form,
  FormControl,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  auth,
  logoutUser,
  searchNFT,
  searchContent,
  Channel,
} from "../../actions/user_action";
import { BankOutlined } from "@ant-design/icons";
import axios from "axios";
import watto from "../img/투명로고.png";
import DropdownMenu from "react-bootstrap/esm/DropdownMenu";
import styled from "styled-components";

const Button = styled.a`
 border: none;
 border-radius: 7%;
 background-color: white;
 font-size: 22px;
 text-decoration: none;
 color: black;
 margin: 7px;
 
  cursor: pointer;
  &:active{
    /* 커서 올려놓으면 색깔 변경 color: black; */
  }
  &:focus {
    outline: none;
    color: black;
  }
  transition: all 0.2s ease-in-out;
&:hover {
  color: black;
  box-shadow: 4px 12px 20px 6px rgb(0 0 0 / 10%);
  transform: translateY(4px);
}
`;

const SearchButton = styled.button`
border: 1px solid #12FFF7;
border-radius: 7%;
min-width: 100px;
font-size: 20px;
margin-left: 3px;
background: linear-gradient(
  20deg,
  #B3FFAB,
  #12FFF7
);
cursor: pointer;
&:active,
&:focus {
    outline: none;
  }
  transition: all 0.2s ease-in-out;
&:hover {
  box-shadow: 4px 12px 20px 6px rgb(0 0 0 / 20%);
  transform: translateY(4px);
}
`;



function Bar({ isLogin }) {
	const [show, setShow] = useState(false);
	const [isAuth, setIsAuth] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);
	const [searchValue, setSearchValue] = useState(false);
	const [searchOption, setSearchOption] = useState('');

	const navigate = useNavigate();

	const dispatch = useDispatch();

	dispatch(auth()).then((res) => {
		// console.log(res.payload);
		setIsAuth(res.payload.isAuth);
		setIsAdmin(res.payload.isAdmin);
		// console.log("SA", res.payload.isAuth);
		// console.log("SD", res.payload.isAdmin);
  });
  
  console.log(isAuth,isAdmin);

	const onSubmit = (e) => {
		console.log('value', searchValue);
		console.log('option', searchOption);

		e.preventDefault();

		let search = { name: searchValue };

		if (searchOption === 'NFT') {
			console.log('NFT 컨텐츠에 들어왔구나');

			dispatch(searchNFT(search)).then((response) => {
				// setMessage(response.payload.message);
				if (response.payload.success === true) {
					console.log('bar.nft', response);
					navigate('/SearchNft');
				} else if (response.payload.success === false) {
					navigate('/SearchFail');
					alert('실패');
				}
			});
		} else if (searchOption === 'CONTENT') {
			console.log('옵션 컨텐츠에 들어왔구나');
			console.log('c.t', search);

			dispatch(searchContent(search)).then((response) => {
				console.log(response);
				// setMessage(response.payload.message);
				if (response.payload.success === true) {
					console.log('bar.content', response);
					navigate('/SearchContent');
				} else if (response.payload.success === false) {
					navigate('/SearchFail');
					alert('실패');
				}
			});
		} else if (searchOption === 'CHANNEL') {
			console.log('체널임?');

			dispatch(Channel(search)).then((response) => {
				console.log(response);
				// setMessage(response.payload.message);
				if (response.payload.success === true) {
					console.log('bar.content', response);
					navigate('/channel');
				} else if (response.payload.success === false) {
					navigate('/SearchFail');
					alert('실패');
				}
			});
		}

		// navigate('/SearchNft');
		// window.location.replace('/Search');
	};


  const handleLogout = () => {
    console.log("logoout");
    axios
      .get(`/api/users/logout`, { withCredentials: true })
      .then((response) => {
        if (response.data.success) {
          console.log("로그아웃 성공");
          setIsAuth(false);
        } else {
          console.log("로그아웃 실패");
          alert("로그아웃 하는데 실패 했습니다");
        }
      });
      
  };
/////////////////Ripple Button 사용법//////////////////////////////
  // const RippleButton = ({ children, onClick }) => {
  //   const [coords, setCoords] = React.useState({ x: -1, y: -1 });
  //   const [isRippling, setIsRippling] = React.useState(false);
  
  //   React.useEffect(() => {
  //     if (coords.x !== -1 && coords.y !== -1) {
  //       setIsRippling(true);
  //       setTimeout(() => setIsRippling(false), 300);
  //     } else setIsRippling(false);
  //   }, [coords]);
  
  //   React.useEffect(() => {
  //     if (!isRippling) setCoords({ x: -1, y: -1 });
  //   }, [isRippling]);
  
  //   return (
  //     <button
  //       className="ripple-button"
  //       onClick={e => {
  //         const rect = e.target.getBoundingClientRect();
  //         setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  //         onClick && onClick(e);
  //       }}
  //     >
  //       {isRippling ? (
  //         <span
  //           className="ripple"
  //           style={{
  //             left: coords.x,
  //             top: coords.y
  //           }}
  //         />
  //       ) : (
  //         ''
  //       )}
  //       <span className="content">{children}</span>
  //     </button>
  //   );
  // };
/////////////////////////////////////////////////////////////
  return (
    <Navbar bg="white" expand="lg" style={{ width: "100%", height: "70px" , zIndex: 100}}>
      {/* position: "fixed" 해제했슴다 */}
      <Navbar.Brand href="/" al>
        <img src={watto} width="200" style={{marginTop: '10px'}}/>
      </Navbar.Brand>

			<Container fluid>
				<Navbar.Toggle aria-controls='navbarScroll' />
				<Navbar.Collapse id='navbarScroll'>
					<Navbar.Toggle aria-controls='navbarScroll' />

					<Navbar.Collapse
						id='navbarScroll'
						className='d-flex justify-content-center'>
						<Form className='d-flex'>
							<DropdownButton variant='light'>
								<Dropdown.Item
									type='option'
									// value={option}
									onClick={(e) => {
										setSearchOption('NFT');
									}}>
									NFT
								</Dropdown.Item>

                <Dropdown.Item
                  type="option"
                  // value={option}
                  onClick={(e) => {
                    setSearchOption("CONTENT");
                  }}
                >
                  CONTENT
                </Dropdown.Item>
                <Dropdown.Item
                  type="option"
                  // value={option}
                  onClick={(e) => {
                    setSearchOption("CHANNEL");
                  }}
                >
                  CHANNEL
                </Dropdown.Item>
              </DropdownButton>
              <FormControl
                type="search"
                className="me-4"
		          	style={{width: '500px'}}
                // value={searchValue}
                placeholder="search the value or NFT"
                onChange={(e) => {
                  setSearchValue(e.target.value);
                }}
              />
              <SearchButton  method="get" onClick={onSubmit}>
                Search
              </SearchButton>
            </Form>
          </Navbar.Collapse>

          <Nav>
            <div className="">
              {isAdmin ? (
                <Button
                  variant="warning"
                  href="/Developer"
                  size="md"
                  className="me-1"
                >
                  Developer
                </Button>
              ) : (
                ""
              )}
              {isAdmin ? (
                <Button
                  variant="dark"
                  href="/video/upload"
                  size="md"
                  className="me-1"
                >
                  AdUpload
                </Button>
              ) : (
                ""
              )}
              {isAuth ? (
                <Button
                  variant="light"
                  href="/exchange"
                  size="md"
                  className="me-1"
                  icon={<BankOutlined />}
                >
                  Exchange
                </Button>
              ) : (
                ""
              )}
              <Button
                variant="dark"
                href="/video/userupload"
                size="md"
                className="me-1"
              >
                Upload
              </Button>

							<Button
								variant='dark'
								href={isAuth ? '' : '/login'}
								size='md'
								className='me-1'
								onClick={() => {
									if (isAuth) {
										handleLogout();
									}
								}}>
								{isAuth ? 'Sign Out' : 'Sign In'}
							</Button>

              <Button
                variant="dark"
                href={isAuth ? "/user/mypage" : "/register"}
                size="md"
              >
                {isAuth ? "My Page" : "Sign Up"}
              </Button>
              {/* <RippleButton onClick={e => console.log(e)}>Click me</RippleButton> */}
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Bar;
