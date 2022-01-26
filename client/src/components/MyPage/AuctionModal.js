import {Modal, Button } from "react-bootstrap";
import React, { useState } from "react";
import axios from "axios";

const AuctionModal = ({ check, modalInfo, userInfo }) => {
  
    const [Auctionsell, setsellPrice] = useState("");
    
    const publicKey = userInfo.publicKey
    
    

    function sell(tokenId, imgUri) {
     
      if (userInfo.image === imgUri) {
        axios.post("/api/contract/nft/auction", {
          tokenId,
          privateKey: userInfo.privateKey,
          Auctionsell,
          publicKey,
          userInfo
        })
        .then((res) => {
          if (res.data.success) {
            // setProfile(wtImg);
            window.location.reload();
          }
        });
    } else {
      axios
          .post("/api/contract/nft/auction", {
            tokenId,
            Auctionsell,
            publicKey,
            Auctionsell
          })
          .then((res) => {
            if (res.data.success) {
              window.location.reload();
            }
          });
        }
    }
    // fixed
      //마이 엔에프티 nft 카드 fixed 클릭 => fixed 함수 이동 => 모달 함수 전달 => useState 모달 저장 => fixedmodal 컴포넌트로 정보 전달 => 모달창에서 금액 누르고 셀 누르면 => sell 함수로 이동
      // => 정보 받고 받아온 sellNft 함수 실행

      //auction 
      //마이 엔에프티 nft 카드 acution 클릭 => acution 함수 이동 => 모달 함수 전달 => useState 모달 저장 => acutionmodal 컴포넌트로 정보 전달 => 모달창에서 금액 누르고 셀 누르면 => sell 함수로 이동
      // => sellNFt 함수 실행
      
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
                    <input style={{ border: 'none', borderBottom: '1px dashed' }} onChange={(e) => {setsellPrice(e.target.value)}}></input>
                    <span>NWT</span>
                </Modal.Title>
               
            </Modal.Body>
            <Modal.Footer style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center"
            }}>
                <p> startPrice  </p>
                
            </Modal.Footer >
           
            <Modal.Footer>
                <Button onClick={() => { sell(modalInfo.tokenId,modalInfo.imgUri) }}>Sell</Button>
                <Button variant="danger" onClick={check}>Close</Button>
            </Modal.Footer>
            </Modal>
      );
}

export default AuctionModal;



