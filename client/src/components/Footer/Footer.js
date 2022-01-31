import React from "react";
import { Row, Col } from "react-bootstrap";
import styled from "styled-components";
import logo from '../img/투명로고.png'
const FooterDiv = styled.div`
  margin-top: 140px;
  z-index: 200;
  /* background-color: #7de7a6; */
`;

const Footer = () => {
  
  return (
    // <div id="main-footer" className="text-center p-2">
    // m-auto 왼쪽오른쪽 여백 알아서 맞춰라. m : margin
    <FooterDiv>
    <Row>
        <img src={logo} height={60} width={50}></img>
      <Row>
        {/* Column1 */}
        <Col>
          <h1>WATTO</h1>
          <h4 className="list-unstyled">
             <li>WATTO TEAM</li>
            <li>김건우 안형준 김기대 송근동</li>
            <li>Korea</li>
            <li>수정중</li>
            <li>수정중</li>
          </h4>
        </Col>
        {/* Column2 */}
        <Col>
          <h4>Stuff</h4>
          <ui className="list-unstyled">
            <li>수정중</li>
            <li>수정중</li>
            <li>수정중</li>
          </ui>
        </Col>
        {/* Column3 */}
        <Col>
          <h4>WELL ANOTHER COLUMN</h4>
          <ui className="list-unstyled">
            <li>수정중</li>
            <li>수정중</li>
            <li>수정중</li>
          </ui>
        </Col>
      </Row>
      </Row>
      <hr />
      <div className="row">
        <p className="col-sm">
          &copy;{new Date().getFullYear()} WATTO | All rights reserved |
          Terms Of Service | Privacy
        </p>
      </div>
    </FooterDiv>
  );
};

export default Footer;
