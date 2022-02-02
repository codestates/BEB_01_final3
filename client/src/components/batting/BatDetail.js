import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Col, Row, Modal, Button, Container, Card } from "react-bootstrap";
import styled from "styled-components";
import Spinner from '../spinner/nftListSpinner';
import Swal from "sweetalert2";
import {
  ShakeOutlined,
  RiseOutlined,
  AlignLeftOutlined,
  ContainerOutlined,
  RedditSquareFilled,
} from "@ant-design/icons";


const Contents = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 40rem;
  align-items: center;
  justify-content: center;
`;

const Div = styled.div`
  width: 40%;
  height: 30%;
`;

////////////////////End Styled/////////////////////////////////
function BetDetail(props,{show,betData}) {
  const navigate = useNavigate();
  const [userbids, setuserbids] = useState("");
  const [topPrice, setTopPrice] = useState("");
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
   

 
  useEffect(() => {
    axios.post("/api/bat/contentList", {contentName:props.betData}).then((res) => {
      //데이터 가공을 해주어야합니다. 같은 content끼리묵어야 합니다.
      //일단 몇개의 데이터가 있는지 확인해 봅시다.
    
      if (res.data.success) {
        console.log(res.data.success);
        setList(res.data.info);
      }
    });
  }, []);
  

  function closeSerial(contentsName, serial) {
    // 이제 방을 닫는 트랜잭션을 보내봅시다.
    axios.post("/api/bat/closeSerial", { contentsName,serial }).then((res) => {
      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "Wow.....",
          text: res.data.detail,
          // showCancelButton: true, // cancel버튼 보이기. 기본은 원래 없음
          // confirmButtonColor: '#3085d6', // confrim 버튼 색깔 지정
          // cancelButtonColor: '#d33', // cancel 버튼 색깔 지정
          // confirmButtonText: '승인', // confirm 버튼 텍스트 지정
          // cancelButtonText: '취소', // cancel 버튼 텍스트 지정
          // reverseButtons: true, // 버튼 순서 거꾸로
        }).then((res) => {
          window.location.reload();
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: res.data.detail,
          // showCancelButton: true, // cancel버튼 보이기. 기본은 원래 없음
          // confirmButtonColor: '#3085d6', // confrim 버튼 색깔 지정
          // cancelButtonColor: '#d33', // cancel 버튼 색깔 지정
          // confirmButtonText: '승인', // confirm 버튼 텍스트 지정
          // cancelButtonText: '취소', // cancel 버튼 텍스트 지정
          // reverseButtons: true, // 버튼 순서 거꾸로
        });
      }
    });
  }
  const closeContent = () => {
		setIsLoading(true);

		axios.post("/api/bat/closeContent", { contentNum: props.contentNum })
			.then(res => {
      
        Swal.fire({
          icon: "success",
          title: "Wow.....",
          text: res.data.detail,
        }).then((res) => {
          setIsLoading(false);
          window.location.reload();
        });
			
			})
			

	}
  
  return (
    <Modal
      {...props}
      size="xl "
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Body className="show-grid">
        {isLoading === false ?
          <Contents>
            {list.map((el) => {
              return (
                <>
                 
                    <Card bg="white" text="black" style={{ margin: "1%", width:"15rem", height:"15rem" }}>
                      <Card.Body>
                      <Card.Title >
                          Title :{" "}
                          {[el.contentsName] + el.subTitle + "Ep." + el.serial}
                        </Card.Title>
                        <Card.Title>contentNum : {el.contentsNum}</Card.Title>
                        {el.status === true ? (
                          <Card.Title>status : [진행중]</Card.Title>
                        ) : (
                          <Card.Title>status : [종료]</Card.Title>
                        )}
                        <span>
                          <Button
                            variant="black"
                            style={{ border: "1px solid #eee" }}
                            onClick={() => {
                              closeSerial(el.contentsName, el.serial);
                            }}
                          >
                            Game Close
                          </Button>
                        </span>
                      </Card.Body>
                    </Card>
                 
                </>
              );
            })}
          </Contents> :
          <>
            <Contents>
          <Spinner></Spinner>
          </Contents>
          </>
        }
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={closeContent}>
          컨텐츠 종료
        </Button>
        <Button onClick={props.show}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
export default BetDetail;
