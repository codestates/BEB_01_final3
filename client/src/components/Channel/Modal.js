import PacmanLoader from "react-spinners/PacmanLoader";
import styled from "styled-components";
import { Card, Button } from "react-bootstrap";
import React, { useState, useEffect } from "react";

const Modal = ({ modal, img }) => {
    useEffect(() => {
        document.body.style.cssText = `position: fixed; top: -${window.scrollY}px`
      return () => {
        const scrollY = document.body.style.top
        document.body.style.cssText = `position: ""; top: "";`
        window.scrollTo(0, parseInt(scrollY || '0') * -1)
      }
    }, [])

    const ModalWrapper = styled.div `
  box-sizing: border-box;
  display: ${ (
        modal
    ) => (
        modal
            ? 'block'
            : 'none'
    )};
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  overflow: auto;
  outline: 0;`

    const ModalOverlay = styled.div `
  box-sizing: border-box;
  display: ${ (
        modal
    ) => (
        modal
            ? 'block'
            : 'none'
    )};
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 999;`

    const ModalInner = styled.div `
display : flex;
flex-direction: row;
justify-content: space-between;
flex-wrap: wrap;
box-sizing: border-box;
position: relative;
box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.5);
background-color: #fff;
border-radius: 10px;
width: 50%;
top: 50%;
transform: translateY(-50%);
margin: 0 auto;
padding: 40px 20px;
`
    const Img = styled.div `
     padding : 1%;
    `

    return (
        <> < ModalOverlay visible = {
            modal
        } /> <ModalWrapper tabIndex="-1" visible={modal}>
            <ModalInner tabIndex="0" className="modal-inner">

                {
                   
                    img.map((el) => {
                        return (
                            <Img>
                            <Card
                                style={{
                                    width: "5rem",
                                    height: "5rem",
                                    margin: "1%",
                                    cursor: "pointer"
                                }}>
                                <Card.Img
                                    variant="top"
                                    src={el.imgUri}
                                    style={{
                                        height: "220px"
                                    }}/>

                                </Card>
                                </Img>
                        )
                    })
                }
            </ModalInner>
        </ModalWrapper>
    </>
    )

}

export default Modal;
