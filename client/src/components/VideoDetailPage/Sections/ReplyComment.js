import React, { useEffect, useState } from 'react'
import CommentList from './CommentList'

function ReplyComment(props) {


    const [childCommentNum, setchildCommentNum] = useState(0)
    const [OpenReCom, setOpenReCom] = useState(false)

    useEffect(() => {

        let commentNum = 0;

        props.commentLists.map((comment) => {
            if(comment.responseTo === props.parentCommentId){
                commentNum ++
            }
        })
        
        setchildCommentNum(commentNum)

    }, [props.commentLists])

    const renderReComment = (parentCommentId) => (

        props.commentLists.map((comment, index) =>
            <React.Fragment>
                {comment.responseTo === parentCommentId && 
                //responseTo와 parentCommentId 가 같아야 랜더링이된다
                //resposenTo가 없는 첫 댓글은 고려대상이 아니다.
                <div style={{ width: '80%', marginLeft: '40px'}}>
                <CommentList refreshpage={props.refreshpage} comment={comment} key={index} />
                <ReplyComment refreshpage={props.refreshpage} commentLists={props.commentLists} parentCommentId={comment._id}  key={index}/>
                </div>
                }
            </React.Fragment>
        )

    )

    const onHandleChange = () => {
        setOpenReCom(!OpenReCom);
    }

    return (
        <div>

            {childCommentNum > 0 && (//0보다 크면 랜더링되게한다
                <p
                    style={{ fontSize: '12px', margin: '0', marginLeft: '80px', color: 'gray', textAlign: 'left'}}
                    onClick={onHandleChange}>
                    답글 보기 {childCommentNum} (s)
                </p>
            )}

            {OpenReCom && 
                renderReComment(props.parentCommentId)
                //대댓글 작성시 눌리면 나오고 아니면 숨긴 상태
            }

            
        </div>
    )
}

export default ReplyComment
