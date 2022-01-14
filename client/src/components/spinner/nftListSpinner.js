import PacmanLoader from "react-spinners/PacmanLoader";
import styled from "styled-components";
import { Card, Avatar, Col, Typography, Row} from 'antd';



const Spinner = () => {


    const Flex = styled.div`    
     display: flex;
     flex-direction: column;
     justify-content: center
     flex-wrap : wrap
     height : 50rem;
`;
   

    const Title = styled.h1`
    width : 50rem;
    font-family:fantasy;
    font-size: 64px;
    font-weight: bold;
    margin: 8px;
    margin-bottom: 96px;
    text-align: center;
    color: red;
    
`;





    return(
        <Flex>  
              <Title>It's coming soon</Title> 
        <Title>We are preparing to sell nft.</Title> 
        
       <PacmanLoader size="100" height="400px" width="180px" color="red" radius="8"/>   
       
        </Flex>
        )
  
};

export default Spinner;