import React, { useState, useEffect } from "react";
import {
  Navbar,
  Nav,
  NavDropdown,
  Button,
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
import watto from "../img/watto.png";
import DropdownMenu from "react-bootstrap/esm/DropdownMenu";

function Bar({ isLogin }) {
  const [show, setShow] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchValue, setSearchValue] = useState(false);
  const [searchOption, setSearchOption] = useState("");

  const navigate = useNavigate();

  const dispatch = useDispatch();

  dispatch(auth()).then((res) => {
    // console.log(res.payload);
    setIsAuth(res.payload.isAuth);
    setIsAdmin(res.payload.isAdmin);
    // console.log("SA", res.payload.isAuth);
    // console.log("SD", res.payload.isAdmin);
  });

  const onSubmit = (e) => {
    console.log("value", searchValue);
    console.log("option", searchOption);

    e.preventDefault();

    let search = { name: searchValue };

    if(searchOption === "NFT"){
			console.log("NFT 컨텐츠에 들어왔구나");

			dispatch(searchNFT(search))
				.then(response => {
				// setMessage(response.payload.message);
				if(response.payload.success === true) {

					console.log('bar.nft', response);
					navigate('/SearchNft');
									
				}
				else if(response.payload.success === false) {
					navigate('/SearchFail')
					alert("실패");
				}
			})
		}
		else if(searchOption === "CONTENT"){
			console.log("옵션 컨텐츠에 들어왔구나");
			console.log('c.t', search);

			dispatch(searchContent(search))
				.then(response => {
					console.log(response);
				// setMessage(response.payload.message);
				if(response.payload.success === true) {
						console.log('bar.content', response);
						navigate('/SearchContent');
				}
				else if(response.payload.success === false) {
						navigate('/SearchFail')
						alert("실패");

				}
				
				
			})
		}

    else if(searchOption === "CHANNEL"){
      console.log("체널임?");

      dispatch(Channel(search))
				.then(response => {
					console.log(response);
				// setMessage(response.payload.message);
				if(response.payload.success === true) {
						console.log('bar.content', response);
						navigate('/channel');
				}
				else if(response.payload.success === false) {
						navigate('/SearchFail')
						alert("실패");

				}
				
				
			})
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

  return (
    <Navbar bg="black" expand="lg" style={{position: "fixed", width: "100%", height: "70px" , zIndex: 100}}>
      <Navbar.Brand href="/" al>
        <img src={watto} width="140" />
      </Navbar.Brand>

      <Container fluid>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Navbar.Toggle aria-controls="navbarScroll" />

          <Navbar.Collapse id="navbarScroll" className="d-flex justify-content-center">
            <Form className="d-flex">
              <DropdownButton variant="light">
                <Dropdown.Item
                  type="option"
                  // value={option}
                  onClick={(e) => {
                    setSearchOption("NFT");
                  }}
                >
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
              <Button variant="light" method="get" onClick={onSubmit} style={{marginLeft: "-25px",}}>
                Search
              </Button>
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

              <Button
                variant="dark"
                href="/video/userupload"
                size="md"
                className="me-1"
              >
                Upload
              </Button>

              <Button
                variant="dark"
                href={isAuth ? "" : "/login"}
                size="md"
                className="me-1"
                onClick={() => {
                  if (isAuth) {
                    handleLogout();
                  }
                }}
              >
                {isAuth ? "Sign Out" : "Sign In"}
              </Button>

              <Button
                variant="dark"
                href={isAuth ? "/user/mypage" : "/register"}
                size="md"
              >
                {isAuth ? "My Page" : "Sign Up"}
              </Button>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Bar;
