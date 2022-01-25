

import PacmanLoader from "react-spinners/PacmanLoader";
import styled from "styled-components";
import {Modal,Card, Button } from "react-bootstrap";
import React, { useState, useEffect } from "react";



const AuctionModal = ({ check, modalInfo, sellNFT }) => {
    

    const [sellPrice, setPrice] = useState("");
    

    function sell(tokenId, imgUri) {
       
        sellNFT(tokenId, imgUri,sellPrice)
        return;
    }
    //  console.log("a",this.img);
  
    
    return (
            <Modal
            show
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
           
            >
            <Modal.Header closeButton onClick={check}>
                <Modal.Title id="contained-modal-title-vcenter">
                <p>Please Set The Start Price!</p>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center"
            }}>

                <Modal.Title id="contained-modal-title-vcenter">
                    <input style={{ border: 'none', borderBottom: '1px dashed' }} onChange={(e) => {setPrice(e.target.value)}}></input>
                    <span>NWT</span>
                </Modal.Title>
               
            </Modal.Body>
            <Modal.Footer style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center"
            }}>
                <p> startPrice </p>
                
            </Modal.Footer >
           
            <Modal.Footer>
                <Button onClick={() => { sell(modalInfo.tokenId,modalInfo.imgUri) }}>Sell</Button>
                <Button variant="danger" onClick={check}>Close</Button>
            </Modal.Footer>
            </Modal>
      );
}

export default AuctionModal;



