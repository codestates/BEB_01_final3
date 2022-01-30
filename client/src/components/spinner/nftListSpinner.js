import PacmanLoader from "react-spinners/PacmanLoader";
import styled, { keyframes} from "styled-components";
import { Card, Avatar, Col, Typography, Row} from 'antd';


const Spinner = () => {


const move = keyframes`

  0% {
    top: 0;
  }
  20% {
    top: -3rem  ;
  }
  40% {
    top: 0;
  }
  60% {
    top: 0;
  }
  80% {
    top: 0;
  }
  100% {
    top: 0;
  
}


`;
    
const Flex = styled.div`    

span{
    animation : ${move} 1s infinite;
    position : relative;
    color: #7DE7A6;
    font-size: 8rem;
}
span:nth-child(1){
    animation-delay: 0.1s;
}
span:nth-of-type(2){
    animation-delay: 0.2s;
}

span:nth-of-type(3){
    animation-delay: 0.3s;
}

span:nth-of-type(4){
    animation-delay: 0.4s;
}
span:nth-of-type(5){
    animation-delay: 0.5s;
}


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
            
                <span>W</span>
                <span>A</span>
                <span>T</span>
                <span>T</span>
                <span>O</span>
                
        </Flex>
        )
  
};

export default Spinner;