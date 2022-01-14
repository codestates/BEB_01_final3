import React, { useEffect } from 'react';
// import Axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { auth } from '../actions/user_action';
import { useNavigate } from 'react-router-dom';


function ActualComp(navigate){
  console.log(navigate)
  return <>Actual Comp</>
}
// function Auth(SpecificComponent, option, adminRoute = null){
export default function (SpecificComponent, option, adminRoute = null) {

    //null    =>  아무나 출입이 가능한 페이지
    //true    =>  로그인한 유저만 출입이 가능한 페이지
    //false   =>  로그인한 유저는 출입 불가능한 페이지

    function AuthenticationCheck(props) {

        const user = useSelector(state => state.user)
        let navigate = useNavigate(); 
        const dispatch = useDispatch();

        useEffect(() => {

            dispatch(auth()).then(response => {
                console.log('res', response)
                //로그인 하지 않은 상태 
                if (!response.payload.isAuth) {
                    if (option) {
                        navigate('/login')
                    }
                } else {
                    //로그인 한 상태 
                    if (adminRoute && !response.payload.isAdmin) {
                        navigate('/')
                    } else {
                        if (option === false)
                        navigate('/')
                    }
                }
            })
        }, [])

        

        return (
            <SpecificComponent  {...props} user={user} navigate={navigate} />
            // <SpecificComponent />
        )
    }
    return <AuthenticationCheck />
}
//토큰이 인코딩 되있는 상태에서 디코드를 하면 userId가 나온다

//쿠키에 저장된 토큰을 서버에서 가져와서 복호화 한다.
//복호화 하면 userID가 나오고 userId를 이용해서
//데이터 베이스 user collection 에서 유저를 찾고
//쿠키에서 받아온 토큰이 유저도 가지고 있는지 확인한다.
