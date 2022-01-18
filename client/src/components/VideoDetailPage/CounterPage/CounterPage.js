import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment'
import { useCallback } from 'react';
import { useParams } from "react-router-dom";


function CounterPage() {

    const videoId = useParams().videoId;
    const variable = { videoId: videoId };
    const [VideoDetail, setVideoDetail] = useState([]);
    const [Survival, setSurvival] = useState('');

    useEffect(() => {
        axios.post('/api/video/getVideoDetail', variable).then((response) => {
            if (response.data.success) {
                console.log('getvideodata', response.data);
                setVideoDetail(response.data.videoDetail);
                setSurvival(response.data.videoDetail.survival);
            } else {
                alert('비디오 정보를 가져오길 실패했습니다.');
            }
        });
    }, []);

    // console.log('date', VideoDetail.opendate)
    console.log('videoData', Survival[0])
    
    const people = Survival[0];
    console.log(people)
    //랜더링 되자 마자 videoData 를 제일 먼저 호출해버림 = undefined 
    //console.log('videoData', VideoDetail.survival) => 아직 useEffect가 호출되지 않은상태이고
    //따라서 그 값을 불러오지 못함
    //그래서 useEffect 안에 response.data.videoDetail.survival 을 useState 값으로 지정하고
    // console.log('videoData', Survival[0])  : Survival => useState에 선언이 되어있는 상태고 빈 상태이기 때문에
    // useEffect가 다시한번 돌아가면서 채워줌 

    //useEffect 함수 호출, 
    //getvideodata 로그
    //videoData 로그
    //getvidodata 로그
    //videoData 로그 
    

    // const people = VideoDetail.survival[0];
    // const z = useMemo(() => people, VideoDetail.survival[0])
    // console.log('pe', people);
    // const arr1 = people.split(", ");
    // console.log('arr', arr1);
    // console.log('arr1', arr1[0]);

    // const timestamps = VideoDetail.opendate
    // const opendate = new Date(timestamps)
    // console.log(opendate)
    //Number

    // const hoursMinSecs = {hours:10, minutes: 20, seconds: 40}
    const countDownTimer = useCallback((date) => {
        let _vDate = moment(date);
        let _second = 1000;
        let _minute = _second * 60;
        let _hour = _minute * 60;
        let _day = _hour * 24;
        let timer;

        function showRemaining() {
            try {
                let now = moment();
                let distDt = _vDate - now;

                if (distDt < 0) {
                    clearInterval(timer);
                    let HapDate = '0' + 'd ' + '0' + 'h ' + '0' + 'm ' + '0' + 's';
                    document.getElementById('timer').innerHTML = HapDate;
                    return;
                }
                let days = Math.floor(distDt / _day);
                let hours = Math.floor((distDt % _day) / _hour);
                let minutes = Math.floor((distDt % _hour) / _minute);
                let seconds = Math.floor((distDt % _minute) / _second);

                let HapDate = parseInt(days) + 'd ' + parseInt(hours) + 'h ' + parseInt(minutes) + 'm ' + parseInt(seconds) + 's';
                document.getElementById('timer').innerHTML = HapDate;
            }
            catch (e) {
                console.log(e);
            }
        }
        timer = setInterval(showRemaining, 1000);
    }, []);

    return (
        <div>
            <span id="timer">
                개시 일
            {countDownTimer(VideoDetail.opendate)}
            </span>
        </div>
    )
}

export default CounterPage
