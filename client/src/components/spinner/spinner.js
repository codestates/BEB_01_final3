import RingLoader from "react-spinners/RingLoader";
import styled from "styled-components";
import img from './kaoSpinner.gif';
import { Card, Avatar, Col, Typography, Row} from 'antd';



const Spinner = () => {

    const Title = styled.h1`
    font-size: 32px;
    font-weight: bold;
    margin: 8px;
    margin-bottom: 96px;
    text-align: center;
    color:white;
   
`;
  
  
    const SpinnerImg = styled.img`
      
    `
    
const Flex = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flexWrap : wrap,
`;

const Div = styled.div`
     width :100%;
     display: flex;
     background: url(img);
    justify-content: center;
    align-items: center;
`

    return(
        <Flex>
        <Col>
         <Row>
        </Row>
        <Row>
        <Div>
         <SpinnerImg src={img}></SpinnerImg>            
        </Div>
        </Row>
        <Title>Please wait a little bit.</Title>    
        </Col>
        </Flex>
        )
  
};

export default Spinner;