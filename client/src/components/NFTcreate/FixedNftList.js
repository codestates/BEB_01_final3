import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NftListSpinner from "../spinner/nftListSpinner";
import NFTbuy from "./NFTbuy";
import styled from "styled-components";
import Swal from "sweetalert2";
import SideBar from "../NavBar/SideMainBar";

const Div = styled.div`
  margin: auto;
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`;

function NftList() {
  const [nft, setNft] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.post("/api/contract/nft/list", { type: "fixed" }).then((res) => {
      if (res.data.data.length !== 0) {
        setNft(res.data.data);
        console.log(res.data.data.length);
        setLoading(true);
      } else if (res.data.data.lenght === 0) {
        setLoading(false);
      }
    });
  }, []);

  return (
    <div style={{marginTop: '15px'}}> <h1>Fixed price NFTs</h1>
    <Div>
      
      
      <SideBar width={300} />
      {loading === false ? (
        <NftListSpinner></NftListSpinner>
      ) : (
        <NFTbuy nftlist={nft}></NFTbuy>
      )}
      
    </Div>
    </div>
  );
}

export default NftList;
