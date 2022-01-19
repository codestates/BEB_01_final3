import PacmanLoader from "react-spinners/PacmanLoader";
import styled from "styled-components";
import {Modal,Card, Button } from "react-bootstrap";
import React, { useState, useEffect } from "react";

const Modals = ({show,img, off,pfp}) => {
    const Img = styled.div `
    padding : 1%;
   `

    const selectImg = (a) => {
        pfp(a)
        off(false);
    }
    //  console.log("a",this.img);
  
    
    return (
            <Modal
            show
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
           
            >
            <Modal.Header closeButton onClick={off}>
                <Modal.Title id="contained-modal-title-vcenter">
                My Profile NFT LIST!
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center"
            }}>
                {
                    img.map((el) => {

                        if (el.sale === false) {
                            return (
                                <Img>   
                                <Card
                                        style={{
                                            width: "10rem",
                                            height: "10rem",
                                            margin: "1%",
                                            cursor: "pointer"
                                        }} onClick={() => { selectImg(el.imgUri)}}>
                                    <Card.Img
                                        variant="top"
                                        src={el.imgUri}
                                        style={{
                                            height: "220px"
                                        }}/>
    
                                    </Card>
                                    </Img>
                            )
                        }
                        
                    })
                }
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={off}>Close</Button>
            </Modal.Footer>
            </Modal>
      );
}

export default Modals;
