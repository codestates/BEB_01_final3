import React, { useState } from 'react'
import { Comment, Avatar, Button, Input } from 'antd';
import { useParams } from "react-router-dom";
import axios from 'axios';
import { useSelector } from 'react-redux';
import LikeDisLike from './LikeDisLike';

const { TextArea } = Input;

function CommentList(props) {

    const videoId = useParams().videoId;
    const user = useSelector(state => state.user)
    const [CommentValue, setCommentValue] = useState("")

    const [ReplyOpen, setReplyOpen] = useState(false)
    //숨겨져있어야하기때문에 false 

    const HandleChange = (event) => {
        setCommentValue(event.currentTarget.value)
    }
    //VideoDetail/Sections/Comment.js 참고

    const onClickReplyOpen = () => {
        setReplyOpen(!ReplyOpen)
    }

  

    // console.log('videoId', videoId)
    // console.log('user', user.userData._id)
    // console.log('commentId', props.comment)
    //답글 버튼을 클릭하면 ReplyOpen이 토글이 될수있게 한다음 return 부분에서 
    //ReplyOpen이 참일 경우에만 form 부분이 오픈될수있게 설정한다 ReplyOpen &&

    const onSubmit = (event) => {
        event.preventDefault();

        const variables ={
            writer: user.userData._id,
            content: CommentValue,
            postId: videoId,
            responseTo: props.comment._id
            //모든 댓글들의 데이터베이스를 가져오려고 한다.
            //가장 부모되는 videoDetailPage의 useEffect에서 가져온다
          }
      
          axios.post('/api/comment/saveComment', variables )
            .then(response => {
              if(response.data.success){
                console.log(response.data.result)
                setCommentValue(''); //저장후 빈칸으로 만들기 위해
                setReplyOpen(false)
                props.refreshpage(response.data.result)
              }else {
                alert('댓글 작성에 실패했습니다')
              }
            })
    }

    // console.log('CLId', props.comment._id)
    // console.log('CLC',props.comment)

    const actions = [
        <LikeDisLike userId={localStorage.getItem('userId')} commentId={props.comment._id} />,
        <span onClick={onClickReplyOpen} key="comment-basic-reply-to">답글</span>
    ]

    return (
        <div >
            
            <Comment
                actions={actions}
                author={props.comment.writer.name}
                avatar={<Avatar src={props.comment.writer.image} alt />}
                content={<p>{props.comment.content}</p>}
                style={{ textAlign: 'left',
                    
                }}
            />
            {/*VideoDetailPage에서 모든 comment 받고 Comment로 전달, Comment에서 CommentList로 전달해서 받고
            props.comment.~~로 읽어온다
            */}
            {ReplyOpen &&

                <form style={{
                    display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end'
                }} onSubmit={onSubmit}>
                    <TextArea
                        style={{
                            width: '80%',
                            borderTop: '0',
                            borderRight: '0',
                            borderLeft: '0',
                            borderBottom: '1px solid',
                            height: '30px',
                            margin: '0'
                        }}
                        onChange={HandleChange}
                        value={CommentValue}
                        placeholder="글은 글쓴이의 거울입니다"
                    />
                    <br />

                    <button style={{ width: '5%', height: '30px' }} onClick={onSubmit}>
                        댓글
                        
                    </button>
                </form>
            }
        </div>
    )
}

export default CommentList
