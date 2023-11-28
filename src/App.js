import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import cookie from 'react-cookies';

import Header from './layout/Header';
import Footer from './layout/Footer';
import Login from './layout/Login';
import Home from './layout/Home';
import Join from './layout/Join';
import FindId from './layout/FindId';
import FindPw from './layout/FindPw';
import Authentication from './layout/Authentication';

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

  let content = null;

  // data는 post 방식일때 body
  if(mode === 'login'){
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
        
        setMode('home');
      }).catch(function(error){
        console.log(error);
        alert(' 아이디(로그인 전용 아이디) 또는 비밀번호를 잘못 입력했습니다. 입력하신 내용을 다시 확인해주세요.');
      })
    }} authenticationPage={()=>{
      setMode('authenticationPage');
    }} joinPage={()=>{
      setMode('joinPage');
    }} findPw={()=>{
      setMode('findPw')
    }} findId={()=>{
      setMode('findId')
    }}></Login>
  }else if(mode === 'home'){
    content = <Home logout={()=>{
      setMode('login');
    }}></Home>
  }else if(mode === 'authenticationPage'){
    content = <Authentication></Authentication>
  }else if(mode === 'joinPage'){
    content = <Join successJoin={()=>{
      setMode('login');
    }} back={()=>{
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
  }

  return (
    
      <div>
        {/* <Test></Test>
        <TestAsync></TestAsync> */}
        <Header></Header>
        {content}
        <Footer></Footer>

      </div>
  );
}

export default App;
