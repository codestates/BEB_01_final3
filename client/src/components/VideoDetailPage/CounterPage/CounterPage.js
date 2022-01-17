import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import Timer from './Timer'
import moment from 'moment'
import { useCallback } from 'react';
import { useParams } from "react-router-dom";


function CounterPage() {

    const videoId = useParams().videoId;
    const variable = { videoId: videoId };
    const [VideoDetail, setVideoDetail] = useState([]);

    useEffect(() => {
        axios.post('/api/video/getVideoDetail', variable).then((response) => {
            if (response.data.success) {
                console.log('getvideodata', response.data);
                setVideoDetail(response.data.videoDetail);
            } else {
                alert('비디오 정보를 가져오길 실패했습니다.');
            }
        });
    }, []);

    console.log('date', VideoDetail.opendate)

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
            {countDownTimer(VideoDetail.opendate)}</span>
            {/* <Timer hoursMinSecs={hoursMinSecs}/> */}
        </div>
    )
}

export default CounterPage
