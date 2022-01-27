import React from 'react';
import { useParams } from 'react-router-dom';

function AuctionDetailPage(props) {

    const tokenId= useParams().tokenId;
    console.log(tokenId)

    

  return <div>
      AuctionDetailPage
  </div>;
}

export default AuctionDetailPage;
