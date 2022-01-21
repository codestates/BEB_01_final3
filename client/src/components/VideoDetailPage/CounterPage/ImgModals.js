import PacmanLoader from 'react-spinners/PacmanLoader';
import styled from 'styled-components';
import { Modal, Card, Button } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';

const Modals = ({ show, img, off }) => {
	const Img = styled.div`
		padding: 1%;
	`;

	const selectImg = (a) => {
		// pfp(a);
		off(false);
	};
	//  console.log("a",this.img);

	console.log(img);

	return (
		<Modal
			show
			size='md'
			aria-labelledby='contained-modal-title-vcenter'
			centered>
			<Modal.Header closeButton onClick={off}>
				<Modal.Title id='contained-modal-title-vcenter'>
					Survivors
				</Modal.Title>
			</Modal.Header>
			<Modal.Body
				style={{
					display: 'flex',
					flexWrap: 'wrap',
					justifyContent: 'center',
					backgroundColor: 'black',
				}}>
				<Card style={{ width: '25rem', height: '30rem' }}>
					<Img>
						<Card.Img
							src={img}
							style={{
								// margin: '10px',
								width: '24.5rem',
								height: '29.5rem',
								justifyContent: 'center',
								// cursor: 'pointer',
							}}
						/>
					</Img>
				</Card>
				{/* {cards.map((el) => {
					return (
						<Card style={{ width: '5rem' }}></Card>
						// <Img>
						// 	<Card
						// 		style={{
						// 			width: '10rem',
						// 			height: '10rem',
						// 			margin: '1%',
						// 			cursor: 'pointer',
						// 		}}
						// 		onClick={() => {
						// 			selectImg(el.imgUri);
						// 		}}>
						// 		<Card.Img
						// 			variant='top'
						// 			src={el.imgUri}
						// 			style={{
						// 				height: '100%',
						// 			}}
						// 		/>
						// 	</Card>
						// </Img>
					);
				})} */}
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={off}>Close</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default Modals;
