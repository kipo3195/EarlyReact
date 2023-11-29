
import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import cookie from 'react-cookies';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';


import Header from './common/layout/Header';
import Footer from './common/layout/Footer';
import Login from './common/layout/Login';
import Home from './common/layout/Home';
import Join from './common/layout/Join';
import FindId from './common/layout/FindId';
import FindPw from './common/layout/FindPw';
import Authentication from './common/layout/Authentication';

import User from './user/layout/User';



axios.defaults.url="http://localhost"
axios.defaults.withCredentials = true;
// 서버와 refreshToken cookie를 주고 받기 위한 설정

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



function App() {

  // 최초 진입시 'login' useState를 통해 set하면 App이 갱신
  const [mode, setMode] = useState('login');
  
  let header = null;
  let content = null;

  let navigate = useNavigate();
  
  // data는 post 방식일때 body
  if(mode === 'login'){  
    header = <Header></Header>
    content = <Login loginRequest={(userId, password)=>{
      axios({
        method:'post',
        url : 'http://localhost:8080/login',
        data:{
          "username":userId,
          "password":password
        }
      }).then(function(response){
        const flag = response.data.flag;
        const accesstoken  = response.data.token;
        axios.defaults.headers.common['Authorization'] = `Bearer ${accesstoken}`;
        
        //정상인지 판단


       // 인증 완료 이후에 useNavigate를 이용하여 url을 변경함. 단, useNavigate를 사용하기 위해서는 react-router-dom 설치가 필요하며,
       // useNagivate hook을 사용하는 상위 컴포넌트 (현재의 상위 컴포넌트는 App)는 <BrowserRouter> 컴포넌트로 감싸 있어야 한다. (index.js 확인)
      navigate('/user'); 
      setMode('home');
        
      }).catch(function(error){
        console.log(error);
        alert(' 아이디(로그인 전용 아이디) 또는 비밀번호를 잘못 입력했습니다. 입력하신 내용을 다시 확인해주세요.');
      })
    }} authenticationPage={()=>{
      setMode('authenticationPage');
    }} joinPage={()=>{
      navigate('/join');
      setMode('joinPage');
    }} findPw={()=>{
      setMode('findPw')
    }} findId={()=>{
      setMode('findId')
    }}></Login>

  }else if(mode === 'authenticationPage'){
    content = <Authentication></Authentication>
  }else if(mode === 'joinPage'){
    content = <Join successJoin={()=>{
      setMode('login');
    }} back={()=>{
      navigate('/');
      setMode('login');
    }}></Join>
  }else if(mode === 'findPw'){
    content = <FindPw back={()=>{
      setMode('login');
    }} findId={()=>{
      setMode('findId');
    }}></FindPw>
  }else if(mode === 'findId'){
    content = <FindId back={()=>{
      setMode('login');
    }}></FindId>
  }else if(mode === 'home'){
    header = <Header></Header>
    content = <User back={()=>{
      navigate('/');
      setMode('login');
    }}></User>
  }

  return (
    
      <div>
        {/* <Test></Test>
        <TestAsync></TestAsync> */}

          {header}
          {content}
          <Footer></Footer>
        
      </div>
  );
}

export default App;
