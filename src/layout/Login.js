
import axios from 'axios';
import { useEffect, useState } from 'react';

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

  
    return(
        <div className='login'>
        <h2>LoginComponent</h2>
        <form onSubmit={event=>{
            event.preventDefault();
            const userId = event.target.username.value;
            const password = event.target.password.value;
            props.loginRequest(userId, password);

            // 계정정보가 틀렸을때 비밀번호 값 초기화
            event.target.password.value = '';
                       
          }}>
            사용자 id : <input type='text' name='username' placeholder='사용자 id email 형식'></input>
            <br/>
            비밀번호 : <input type='password' name='password' placeholder='비밀번호'></input>
            <p><input type='submit' value='로그인'></input></p>
          </form>
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