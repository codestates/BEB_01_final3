import React, { useState, useEffect } from "react";
// import axios from "axios";
// import moment from "moment";
// import { useCallback } from "react";
// import { useParams } from "react-router-dom";
// import { Form, Row, Col } from "react-bootstrap";
// import { Button, Card } from "react-bootstrap";
import Cardpage from "./Cardpage";
// import hooks from "./countt";
// import Countt from "./Countt";
// const { Meta } = Card;

function CounterPage() {

  // setTimeout(`location.href='/video/${videoId}/'`,1000);  

  return (
    <div>
      <div>
        {/* <span id="timer">{countDownTimer(VideoDetail.opendate)}</span> */}
        {/* <span id="timer">{countDownTimer('2022-01-20 21:49:20')}</span> */}
        <React.Fragment>
        <Cardpage />
        {/* <Countt /> */}
        </React.Fragment>
      </div>
      {/* <Row gutter={16} 
      style={{ display: "flex", justifyContent: "center"}}>{renderCard}</Row> */}
    </div>
  );
}

export default CounterPage;
