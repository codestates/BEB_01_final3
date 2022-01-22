import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Subscribe(props) {
  const [SubscribeNumber, setSubscribeNumber] = useState(0);
  const [Subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    let variable = { userTo: props.userTo };

    console.log(variable);
    axios.post('/api/subscribe/subscribeNumber', variable).then((response) => {
      if (response.data.success) {
        console.log(response.data.subscribeNumber);
        setSubscribeNumber(response.data.subscribeNumber);
      } else {
        alert('구독자 수 정보를 받아오지 못했습니다.');
      }
    });
    let subscribedVariable = {
      userTo: props.userTo,
      userFrom: localStorage.getItem('userId'), //로그인할때 userId에 userId값을 넣어놨었음
    };

    axios.post('/api/subscribe/subscribed', subscribedVariable).then(
      (response) => {
        if (response.data.success) {
          setSubscribed(response.data.subscribed);
        } else {
          alert('정보를 받아오지 못했습니다.');
        }
        console.log('SC',Subscribed);
      }
    );
  }, []);

  const onSubscribe = () => {
    let subscribedVariable = {
      userTo: props.userTo,
      userFrom: props.userFrom,
    };
    if (Subscribed) {
      //이미구독중이라면
      axios.post('/api/subscribe/unSubscribe', subscribedVariable).then(
        (response) => {
          if (response.data.success) {
            setSubscribeNumber(SubscribeNumber - 1);
            setSubscribed(!Subscribed);
          } else {
            alert('구독 취소 하는데 실패 했습니다.');
          }
        }
      );
    } else {
      //구독중이 아니라면
      console.log("여긴가?", subscribedVariable);
      axios.post('/api/subscribe/Subscribe', subscribedVariable).then(
        (response) => {
          if (response.data.success) {
            setSubscribeNumber(SubscribeNumber + 1);
            setSubscribed(!Subscribed);
          } else {
            alert('구독 하는데 실패 했습니다.');
          }
        }
      );
    }
  };

  return (
    <div>
      <button
        style={{
          backgroundColor: `${Subscribed ? '#AAAAAA' : '#CC0000'}`,
          borderRadius: '5px',
          color: 'white',
          padding: '10px 16px',
          fontWeight: '500',
          fontSize: '1rem',
          textTransform: 'uppercase',
        }}
        onClick={onSubscribe}
      >
        {SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}
      </button>
    </div>
  );
}

export default Subscribe;