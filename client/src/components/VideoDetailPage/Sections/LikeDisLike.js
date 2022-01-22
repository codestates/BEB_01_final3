import React, { useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import { LikeOutlined, DislikeOutlined, LikeFilled, DislikeFilled } from '@ant-design/icons';
import axios from 'axios';
import { useParams } from "react-router-dom";
// import { useSelector } from 'react-redux';



function LikeDisLike(props) {

    const videoId = useParams().videoId;
    // const user = useSelector(state => state.user)
    const [Likes, setLikes] = useState(0);
    const [LikeAction, setLikeAction] = useState('');
    const [Dislikes, setDislikes] = useState(0);
    const [DisLikeAction, setDisLikeAction] = useState('');

    let variable = {}
    //const 불변, let 변경가능
    // console.log('var', variable)
    // console.log('videoId', videoId)
    // console.log('videoId', props.videoId)
    // console.log('userId', props.userId)
    // console.log('commentId', props.commentId)

    if (props.video) {
        variable = { videoId: videoId, userId: props.userId };
        // console.log('var',variable)
        //비디오 콘텐츠에 대한 정보(videoDetailPage)
    } else {
        variable = { commentId: props.commentId, userId: props.userId }
        // console.log('Cvar',variable)
        //댓글에 대한 정보(CommentList)
    }

    // console.log('props', props)
    useEffect(() => {

        axios.post('/api/like/getlikes', variable)
            .then(response => {
                if (response.data.success) {
                    //얼마나 많은 좋아요를 받았는지
                    setLikes(response.data.likes.length);
                    //내가 좋아요를 이미 눌렀는지
                    response.data.likes.map((like) => {
                        if (like.userId === props.userId) {
                            //pros.userId는 로그인한 사용자의 Id이기때문
                            setLikeAction('liked');
                        }
                    });
                } else {
                    alert('좋아요 정보 받기 실패')
                }
            })

        axios.post('/api/like/getDislikes', variable).then((response) => {
            if (response.data.success) {
                //얼마나 많은 싫어요를 받았는지
                setDislikes(response.data.dislikes.length);
                //내가 싫어요를 이미 눌렀는지
                response.data.dislikes.map((dislike) => {
                    if (dislike.userId === props.userId) {
                        //pros.userId는 로그인한 사용자의 Id이기때문
                        setDisLikeAction('disliked');
                    }
                });
            } else {
                alert('DisLike에 대한 정보를 가져오지 못했습니다.');
            }
        });

    }, [])

    const LikeOn = () => {
        if (LikeAction === '') {
            axios.post('/api/like/upLike', variable).then((response) => {
                if (response.data.success) {
                    setLikes(Likes + 1);
                    setLikeAction('liked');

                    if (DisLikeAction !== '') {
                        setDisLikeAction('');
                        setDislikes(Dislikes - 1);
                    }
                } else {
                    alert('Like를 올리지 못했습니다.');
                }
            });
        } else {
            axios.post('/api/like/unLike', variable).then((response) => {
                if (response.data.success) {
                    setLikes(Likes - 1);
                    setLikeAction('');
                } else {
                    alert('Like를 내리지 못했습니다.');
                }
            });
        }
    };

    const DisLikeOn = () => {
        if (DisLikeAction !== '') {
            axios.post('/api/like/unDislike', variable).then((response) => {
                if (response.data.success) {
                    setDislikes(Dislikes - 1);
                    setDisLikeAction('');
                } else {
                    alert('dislike를 지우지 못했습니다.');
                }
            });
        } else {
            axios.post('/api/like/upDislike', variable).then((response) => {
                if (response.data.success) {
                    setDislikes(Dislikes + 1);
                    setDisLikeAction('disliked');

                    if (LikeAction !== '') {
                        setLikeAction('');
                        setLikes(Likes - 1);
                    }
                } else {
                    alert('dislike를 올리지 못했습니다.');
                }
            });
        }
    }



    return (
        <div>

            {/*Like*/}
            <span key="comment-basic-like">
                <Tooltip title="Like">
                    {LikeAction === '' ? <LikeOutlined onClick={LikeOn} /> : <LikeFilled onClick={LikeOn} />}
                </Tooltip>
                <span style={{ paddingLeft: '4px', cursor: 'auto' }}> {Likes}</span>
            </span>

            {/*Dislike*/}
            <span key="comment-basic-dislike" style={{ marginLeft: '4px' }}>
                <Tooltip title="Dislike">
                    {DisLikeAction === '' ? (
                        <DislikeOutlined onClick={DisLikeOn} />
                    ) : (
                        <DislikeFilled onClick={DisLikeOn} />
                    )}
                </Tooltip>
                <span style={{ paddingLeft: '4px', cursor: 'auto' }}> {Dislikes}</span>
            </span>

        </div>
    )
}

export default LikeDisLike


//<div>, <span>의 차이
//div는 박스단위 설정
//span은 줄단위 설정