import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import cookie from 'react-cookies';

function Test(){
  const [item, setItem] = useState([]);

  useEffect(()=>{
    axios({
        method:'GET',
        url : 'http://localhost:8080/api/test'
    }).then(function(response){
      console.log(response.data.data);
      setItem(response.data.data);
    }).catch(function(error){
      console.log(error);
    })
    
  })

  return (
    <div> 
      response 결과 : {item}
    </div>
  )
}

function TestAsync(){

  const [asyncItem, setAsyncItem] = useState(null);

  return(
    <div>
      <p>result : {asyncItem}</p>
      <input type="button" value="async test" onClick={()=>{
       axios({
        method:'GET',
        url : 'http://localhost:8080/api/random'
        }).then(function(response){
          console.log(response.data.data);
          setAsyncItem(response.data.data);
        }).catch(function(error){
          console.log(error);
        })
        
      }}/>
    </div>
  )
}

// 로그인 요청 컴포넌트 
function LoginComponent(props){
  return(
      <div>
        <h2>LoginComponent</h2>
        <form onSubmit={event=>{
          event.preventDefault();
          const userId = event.target.username.value;
          const password = event.target.password.value;
          props.loginRequest(userId, password);
        }}>
          사용자 id : <input type='text' name='username'  placeholder='사용자 id email 형식'></input>
          <br/>
          비밀번호 : <input type='password' name='password' placeholder='비밀번호'></input>
          <p><input type='submit' value='로그인'></input></p>
        </form>
      </div>
  )
}

// 주석 추가 
function App() {
  return (
      <div>
        {/* <Test></Test>
        <TestAsync></TestAsync> */}
        <LoginComponent loginRequest={(userId, password)=>{
          console.log(userId, password)
           axios({
            method:'post',
            url : 'http://localhost:8080/login',
            data:{
              "username":userId,
              "password":password
            }
            }).then(function(response){
              const flag = response.data.flag;
              if(flag === 'success'){
                alert("로그인 성공 !")
                const jwt = response.data.token;
                console.log(jwt);
              }else{
                alert("로그인 실패 !");
              }
            }).catch(function(error){
              console.log(error);
              alert("로그인 실패 ! 입력한 정보를 확인하세요.");
            })
        }}></LoginComponent>
      </div>
  );
}

export default App;
