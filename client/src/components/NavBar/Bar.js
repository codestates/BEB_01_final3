import React, { useState, useEffect } from 'react';
import {
	Navbar,
	Nav,
	NavDropdown,
	Button,
	Container,
	Offcanvas,
	Form,
	FormControl,
} from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { auth, logoutUser } from '../../actions/user_action';
import axios from 'axios';
import watto from '../img/watto.png';

function Bar({ isLogin }) {
	// const [show, setShow] = useState(false);
	const [isAuth, setIsAuth] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);
	// const handleClose = () => setShow(false);
	// const handleShow = () => setShow(true);

	const dispatch = useDispatch();

	dispatch(auth()).then((res) => {
		// console.log(res.payload);
		setIsAuth(res.payload.isAuth);
		setIsAdmin(res.payload.isAdmin);
		console.log('SA', res.payload.isAuth);
		console.log('SD', res.payload.isAdmin);
	});

	const handleLogout = () => {
		console.log('logoout');
		axios
			.get(`/api/users/logout`, { withCredentials: true })
			.then((response) => {
				if (response.data.success) {
					console.log('로그아웃 성공');
					setIsAuth(false);
				} else {
					console.log('로그아웃 실패');
					alert('로그아웃 하는데 실패 했습니다.');
				}
			});
	};

	return (
		<Navbar bg='black' expand='lg'>
			<Navbar.Brand href='/' al>
				<img src={watto} width='250' />
			</Navbar.Brand>
		

			<Container fluid>
				<Navbar.Toggle aria-controls='navbarScroll' />
				<Navbar.Collapse id='navbarScroll'>
				
					<Navbar.Toggle aria-controls='navbarScroll' />
					<Navbar.Collapse id='navbarScroll'>
						<Form className='d-flex'>
							<FormControl
								type='search'
								placeholder='Search'
								className='me-4'
								aria-label='Search'
							/>
							<Button variant='outline-success'>Search</Button>
						</Form>
					</Navbar.Collapse>

					<Nav>
						<div className='mb-2'>
							{isAdmin ? (
								<Button
									variant='dark'
									href='/exchange'
									size='md'
									className='me-1'>
									Exchange
								</Button>
							) : (
								''
							)}
							{isAdmin ? (
								<Button
									variant='dark'
									href='/Adupload'
									size='md'
									className='me-1'>
									AdUpload
								</Button>
							) : (
								''
							)}

							<Button
								variant='dark'
								href='/video/upload'
								size='md'
								className='me-1'>
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

							<Button variant='dark' href='/register' size='md'>
								{isAuth ? 'My Page' : 'Sign Up'}
							</Button>
						</div>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}

export default Bar;
