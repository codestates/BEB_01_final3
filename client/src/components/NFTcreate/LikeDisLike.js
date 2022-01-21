import React, { useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import {HeartOutlined, HeartFilled} from '@ant-design/icons'; 
import axios from 'axios';

function LikeDisLike({nftId, userId}) {

    // const videoId = useParams().videoId;
    // const user = useSelector(state => state.user)
    const [Likes, setLikes] = useState(0);
    const [LikeAction, setLikeAction] = useState(false);
    const [Dislikes, setDislikes] = useState(0);
    const [DisLikeAction, setDisLikeAction] = useState('');

    let variable = {}
    //const 불변, let 변경가능
    // console.log('var', variable)
    // console.log('videoId', videoId)
    // console.log('videoId', props.videoId)
    // console.log('userId', props.userId)
    // console.log('commentId', props.commentId)

        variable = { nftId: nftId, userId: userId };
        // console.log('var',variable)
        //비디오 콘텐츠에 대한 정보(videoDetailPage)

    // console.log('props', props)
    useEffect(() => {

        axios.post('/api/like/getlikes', variable)
            .then(response => {
                if (response.data.success) {
                    //얼마나 많은 좋아요를 받았는지
                    setLikes(response.data.likes.length);
                    //내가 좋아요를 이미 눌렀는지
                    response.data.likes.map((like) => {
                        if (like.userId === userId) {
                            //pros.userId는 로그인한 사용자의 Id이기때문
                            setLikeAction(true);
                        }
                    });
                } else {
                    alert('좋아요 정보 받기 실패')
                }
            })
    }, [])

    const LikeOn = () => {
        if (LikeAction === false) {
            axios.post('/api/like/upLike', variable).then((response) => {
                if (response.data.success) {
                    setLikes(Likes + 1);
                    setLikeAction(true);
                    console.log("좋아유");

                    // if (DisLikeAction !== '') {
                    //     setDisLikeAction('');
                    //     setDislikes(Dislikes - 1);
                    // }
                } else {
                    alert('Like를 올리지 못했습니다.');
                }
            });
        } else {
            axios.post('/api/like/unLike', variable).then((response) => {
                if (response.data.success) {
                    setLikes(Likes - 1);
                    setLikeAction(false);
                } else {
                    alert('Like를 내리지 못했습니다.');
                }
            });
        }


        // if(LikeAction === false){
        //     setLikes(Likes + 1);
        //     setLikeAction(true);
        // }
        // else {
        //     setLikes(Likes - 1);
        //     setLikeAction(false);
        // }

    };


    return (
        <div>

            <span>
                <Tooltip title="Like">
                    {LikeAction === false ? <HeartOutlined onClick={LikeOn} /> : <HeartFilled style={{color:'red'}} onClick={LikeOn} /> }
                </Tooltip>
                <span style={{ paddingLeft: '4px', cursor: 'auto' }}> {Likes}</span>
            </span>

        </div>
    )
}

export default LikeDisLike
