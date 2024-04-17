
import axios from 'axios';
import { useEffect, useState } from 'react';
import '../css/login.css';
import { Route } from 'react-router-dom';
import FindId from './FindId'; 

import googleLoginBtn from '../../etc/img/googleLoginBtn.png';
import naverLoginBtn from '../../etc/img/naverLoginBtn.png';
import kakaoLoginBtn from '../../etc/img/kakaoLoginBtn.png';
import cookie from "react-cookies";

// 로그인 요청 컴포넌트 
// function LoginComponent(props){
//     return(
//         <div>
//           <h2>LoginComponent</h2>
//           <form onSubmit={event=>{
//             event.preventDefault();
//             const userId = event.target.username.value;
//             const password = event.target.password.value;
//             props.loginRequest(userId, password);
//           }}>
//             사용자 id : <input type='text' name='username'  placeholder='사용자 id email 형식'></input>
//             <br/>
//             비밀번호 : <input type='password' name='password' placeholder='비밀번호'></input>
//             <p><input type='submit' value='로그인'></input></p>
//           </form>
//         </div>
//     )
//   }



function Login(props){

  const serverUrl = process.env.REACT_APP_SERVER_A_URL;

  var flag = cookie.load("flag");
   var userId = props.userId;
   var temp = props.temp;
   var provider = props.provider;

  useEffect(()=>{
  
    if(flag ==='success'){
      
      userId = cookie.load("userId");
      temp = cookie.load("temp");
      provider = cookie.load("provider");

      if(userId !== ''){

        props.loginRequest(userId, temp, provider);
      }


    }
  },[flag])
    
    return(
      // 최초 메인페이지는 login
        <div className='login'>

          <div id='loginTitle'>
              <table>
                <tbody>
                    <tr>
                      <td id='titleSide'></td>
                      <td id='title'>Early</td>
                      <td id='titleSide'></td>
                    </tr>
                  </tbody>
              </table>
          </div>
        
         <div id='loginContents'>
          
              <form onSubmit={event=>{
                  event.preventDefault();
                  const userId = event.target.username.value;
                  const password = event.target.password.value;
                  props.loginRequest(userId, password, "default");

                  // 계정정보가 틀렸을때 비밀번호 값 초기화
                  event.target.password.value = '';                   
                }}>
                  <table id='loginTable'>
                    <tbody>
                      <tr>
                        <td>
                          <input type='text' name='username' placeholder=' 계정' size="30"></input>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <input type='password' name='password' placeholder=' 비밀번호' size="30"></input>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <input type='checkbox'></input>
                        </td>
                      </tr>
                      <tr>
                          <td>
                            <input id='loginSubmit' type='submit' value='로그인' ></input>
                          </td>
                      </tr>  
                    </tbody>
                  </table>
              </form>
            
          </div>   
          
          
          <div id ='loginFooter'>
              <a href='' className='loginEtcHref' onClick={event=>{
                event.preventDefault();
                props.findId();
              }}>계정찾기</a>  ｜
              <a href='' className='loginEtcHref' onClick={event=>{
                event.preventDefault();
                props.findPw();
              }}>비밀번호 찾기</a> ｜
              <a href='' className='loginEtcHref' onClick={event=>{
                event.preventDefault();
                props.joinPage();
                //props.authenticationPage();
              }}>회원가입</a>
               
            </div> 

            <div id ='OAuthLoginDiv'>
              <table className='OAuthLoginTable' align='center'>
                <tbody>   
                    <tr>
                      <td>
                        {/* <a href="http://localhost:8080/auth/google/web"> */}
                          <img src={naverLoginBtn} width='180px' height='45px' alt='naverLogin'></img>  
                        {/* </a> */}
                      </td>
                    </tr>
                </tbody>
              </table>
              <table className='OAuthLoginTable' align='center'>
                <tbody>   
                    <tr>
                      <td>
                        {/* 이미지에 링크 걸기*/}
                        <a href={serverUrl + "/auth/google/web"}>
                          <img src={googleLoginBtn} width='180px' height='45px' alt='googleLogin'></img>  
                        </a>
                      </td>
                    </tr>
                </tbody>
              </table>
              <table className='OAuthLoginTable' align='center'>
                <tbody>   
                    <tr>
                      <td>
                        {/* <a href="http://localhost:8080/auth/google/web"> */}
                             <img src={kakaoLoginBtn} width='180px' height='45px' alt='kakaoLogin'></img>  
                        {/* </a> */}
                      </td>
                    </tr>
                </tbody>
              </table>
            </div>
       </div>
        
    )
}

// const Login = () => {
//     return (
//         <div className='login'>

//            <LoginComponent loginRequest={(userId, password)=>{
//           console.log(userId, password)
//            axios({
//             method:'post',
//             url : 'http://localhost:8080/login',
//             data:{
//               "username":userId,
//               "password":password
//             }
//             }).then(function(response){
//               const flag = response.data.flag;
//               if(flag === 'success'){
//                 alert("로그인 성공 !")
//                 const jwt = response.data.token;
//                 console.log(jwt);
               
//               }else{
//                 alert("로그인 실패 !");
//               }
//             }).catch(function(error){
//               console.log(error);
//               alert("로그인 실패 ! 입력한 정보를 확인하세요.");
//             })
//         }}></LoginComponent>

//         </div>
//     )
// }

export default Login;