
import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import CommentList from './CommentList';
import ReplyComment from './ReplyComment';
//유저 정보, 리덕스 훅(useSele)

function Comment(props) {

  const videoId = useParams().videoId;
  const user = useSelector(state => state.user)
  // console.log('user', user)
  //state에서 state.user 정보를 가져와서 user 변수에 넣어줌
  //리덕스 어플리케이션에 state 의 user 정보를 모두 가져옴
  //onSubmit 부분 writer로 보내준다 user.userData._id
  //리덕스 어플리케이션 State 부분 참고
  const [commentValue, setcommentValue] = useState("")
  // 1.댓글 작성으로 인해 컴포넌트 상태값이 동적으로 바뀌면 상태 관리를 해준다. 



  const handleClick = (event) => {
    setcommentValue(event.currentTarget.value)
  }
  //2. 이벤트가 일어나는 타겟의 value를 commentValue값으로 변경해준다. 
  // handleClick 이벤트로 인해 textarea에 글을 입력하면 실시간으로 입력이 된다. 
  //event.target, event.currenttarget의 차이
  //event.target은 이벤트버블링의 가장 마지막에 위치한 최하위의 요소를 반환, 즉 클릭된 요소를 기준으로 사용하는 경우 event.target을 사용
  //event.currentTarget의 경우 이벤트가 바인딩된 요소, 해당하는 요소를 반환
  //쉽게 풀어서 event.target은 최하위 요소를 반환하기에 특정 요소를 잡아내기 힘들고 event.currenttarget은 이벤트가 바인딩 된 요소를
  //반환하기 때문에 특정가능해서 편하다.

  const onSubmit = (event) => {
    event.preventDefault();
    // event.preventDefault 는 onSubmit 발생 시 페이지를 리프레쉬 하는것을 막아준다

    const variables = {
      writer: user.userData._id,
      content: commentValue,
      postId: videoId
    }

    axios.post('/api/comment/saveComment', variables)
      .then(response => {
        if (response.data.success) {
          console.log(response.data.result)
          setcommentValue(''); //저장후 빈칸으로 만들기 위해
          props.refreshpage(response.data.result)
        } else {
          alert('댓글 작성에 실패했습니다')
        }
      })
  }

  
  return (
    <div >
      <br />
      <p style={{ width: '15%' }}>댓글</p>
      {/* <hr /> */}
      {/* 기본 명령 형식 */}
      <div >
        <form style={{
          display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start'
        }} onSubmit={onSubmit}>
          <textarea
            style={{
              width: '100%',
              borderTop: '0',
              borderRight: '0',
              borderLeft: '0',
              borderBottom: '2px solid'
            }}
            onChange={handleClick}
            value={commentValue}
            placeholder="글은 글쓴이의 거울입니다"
          />
          <br />

          <button style={{ width: '5%', height: '52px' }} onClick={onSubmit}>
            댓글
          </button>
        </form>
      </div>
      {/* 댓글 리스트 */}
      {props.commentLists && props.commentLists.map((comment, index) =>
      (!comment.responseTo &&
        <React.Fragment>
          <CommentList refreshpage={props.refreshpage} comment={comment} />
          <ReplyComment refreshpage={props.refreshpage} parentCommentId={comment._id} commentLists={props.commentLists} key={index}/>
        </React.Fragment>
        //React.Fragement로 감싸주지 않으면 에러난다
      )
        //comemnt.resposeTo && == 댓댓글이 없는 애들만 출력
      )}
      {/*만약 props.commentLists가 있으면 map 함수로  commentList로 comment 전달 */}
    </div>

  )
}

export default Comment;