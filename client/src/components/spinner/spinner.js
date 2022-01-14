import RingLoader from "react-spinners/RingLoader";
import styled from "styled-components";
import { Card, Avatar, Col, Typography, Row} from 'antd';



const Spinner = () => {

    const Title = styled.h1`
    font-size: 64px;
    font-weight: bold;
    margin: 8px;
    margin-bottom: 96px;
    text-align: center;
    color:gray;
    fontFamily:fantasy;
`;

const Flex = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flexWrap : wrap,
`;

const Div = styled.div`
     width :100%;
     display: flex;
    justify-content: center;
    align-items: center;
`

    return(
        <Flex>
        <Col>
         <Row>
        <Title>Request ------- NFTING</Title>
        </Row>
        <Row>
        <Div>
        <RingLoader size="400" height="400px" width="180px" color="#6b5ce7" radius="8"/>   
        </Div>
        </Row>
        </Col>
        </Flex>
        )
  
};

export default Spinner;