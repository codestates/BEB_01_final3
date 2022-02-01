import React, { useEffect, useState } from "react";
import "../../App.css";
import Sidebar from "../DeveloperPage/DevComponent/Sidebar";
import Layout, { Content } from "antd/lib/layout/layout";
import { Button, Card } from "react-bootstrap";
import Avatar from "antd/lib/avatar/avatar";
import wtImg from "../img/wtimg.png";
import axios from "axios";
import styled from "styled-components";
// import { default as Spinner } from './Spinner';
import { Form, Col, Row } from "antd";
import Swal from "sweetalert2";

const Contents = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  justify-content: center;
  background-color: darkgray;
`;

function BattingList({ contentName, check }) {
  const [list, setList] = useState([]);

  useEffect(() => {
    axios.post("/api/bat/contentList", { contentName }).then((res) => {
      //데이터 가공을 해주어야합니다. 같은 content끼리묵어야 합니다.
      //일단 몇개의 데이터가 있는지 확인해 봅시다.

      if (res.data.success) {
        setList(res.data.info);
      }
    });
  }, []);

  function closeSerial(contentsName, serial) {
    // 이제 방을 닫는 트랜잭션을 보내봅시다.
    axios.post("/api/bat/closeSerial", { contentsName, serial }).then((res) => {
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

  return (
    <>
      <Contents>
        {list.map((el) => {
          return (
            <>
              <Card bg="white" text="black" style={{ margin: "1%" }}>
                <Card.Body>
                  <Card.Title>
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
                      style={{ border: "1px dashed gray", color: "red	" }}
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
      </Contents>
    </>
  );
}

export default BattingList;
