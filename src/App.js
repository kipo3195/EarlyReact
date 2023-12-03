
import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import cookie from 'react-cookies';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';

import AccessToken from './modules/AccessToken';

import Header from './common/layout/Header';
import Footer from './common/layout/Footer';
import Login from './common/layout/Login';
import Home from './common/layout/Home';
import Join from './common/layout/Join';
import FindId from './common/layout/FindId';
import FindPw from './common/layout/FindPw';
import Authentication from './common/layout/Authentication';
import UserHeader from './user/layout/UserHeader';

import User from './user/layout/User';
import UserAddress from './user/layout/UserAddress';
import UserChat from './user/layout/UserChat';
import UserMessage from './user/layout/UserMessage';
import UserEmail from './user/layout/UserEmail';
import UserCalendar from './user/layout/UserCalendar';
import UserEnv from './user/layout/UserEnv';
import UserCs from './user/layout/UserCs';
import UserInfo from './user/layout/UserInfo';




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
  let footer = null;

  let navigate = useNavigate();


  // 이벤트 전 토큰 검증 + access 토큰 재발급 
  async function checkToken(){
    var tokenFlag = null; 
    var tokenErrorCode = null;
    var result = null;

    await axios({
        method:'GET',
        url : 'http://localhost:8080/user/tokenVerification'
    }).then(function(response){
      
      tokenFlag = response.data.flag;
      tokenErrorCode = response.data.error_code;

      if(tokenFlag === 'success'){
        result = 'success';
      }else if(tokenErrorCode === '403'){
        // 바로 로그아웃 처리 refresh 토큰이 없는것으로 판단.
        alert('로그인 기간이 만료되어 로그아웃 됩니다.1');
        setMode('login');
      }else{
        // access 토큰 만료 
        const promise = AccessToken(tokenFlag, tokenErrorCode);

        promise.then(result =>{
          if(result === 'logout'){
            alert('로그인 기간이 만료되어 로그아웃 됩니다.2');
            setMode('login');
            navigate('/');
          }else{
           console.log('재발급 완료', result);
           
          }

        }).catch(function(error){
          console.log(error);
        })

      }
      
    }).catch(function(error){
      console.log(error);
    })
    
    return result;
  }
  
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
        
        if(flag === 'success' && accesstoken !== null){
          axios.defaults.headers.common['Authorization'] = `Bearer ${accesstoken}`;
          
          // 인증 완료 이후에 useNavigate를 이용하여 url을 변경함. 단, useNavigate를 사용하기 위해서는 react-router-dom 설치가 필요하며,
          // useNagivate hook을 사용하는 상위 컴포넌트 (현재의 상위 컴포넌트는 App)는 <BrowserRouter> 컴포넌트로 감싸 있어야 한다. (index.js 확인)
          navigate('/user'); 
          setMode('user');
        }else{
          alert('로그인 실패');
        }
        
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
    footer = <Footer></Footer>
  }else if(mode === 'authenticationPage'){
    content = <Authentication></Authentication>
  }else if(mode === 'joinPage'){
    header = <Header></Header>
    content = <Join successJoin={()=>{
      setMode('login');
    }} back={()=>{
      navigate('/');
      setMode('login');
    }}></Join>
  }else if(mode === 'findPw'){
    header = <Header></Header>
    content = <FindPw back={()=>{
      setMode('login');
    }} findId={()=>{
      setMode('findId');
    }}></FindPw>
  }else if(mode === 'findId'){
    header = <Header></Header>
    content = <FindId back={()=>{
      setMode('login');
    }}></FindId>
  }else if(mode.startsWith('user')){
    header = <UserHeader logout={()=>{
      // 로그 아웃시 access token 초기화 처리.
      // 해주지 않는다면 로그아웃 이후에도 해당 브라우저는 access token을 가지고 있어서 서버에 요청가능해짐.
      // 쿠키영역에 있는 refresh 토큰은 삭제 되지 않는데 어차피 서버에서는 access token을 가장 먼저 체크하기도 하고 다시 로그인하면 
      // 쿠키영역 업데이트함. 
      axios.defaults.headers.common['Authorization'] = null;
      navigate('/');
      setMode('login');
    }} cs={()=>{
      navigate('/user/cs');
      setMode('user/cs');
    }} info={()=>{
      navigate('/user/info');
      setMode('user/info');
    }} address={()=>{
      navigate('/user/address');
      setMode('user/address');
    }} chat={()=>{
      var result = null;
      // 20231203 토큰 검증 로직 추가함. 
      var resultPromise = checkToken();
      resultPromise.then(result =>{
        if(result === 'success'){
          navigate('/user/chat');
          setMode('user/chat');
        }else{
          
         console.log(result);
        }
      }).catch(function(error){
        console.log(error);
      })
    
    }} message={()=>{

      navigate('/user/message');
      setMode('user/message');
    }} email={()=>{
      navigate('/user/email');
      setMode('user/email');
    }} calendar={()=>{
      navigate('/user/calendar');
      setMode('user/calendar');
    }} env={()=>{
      navigate('/user/env');
      setMode('user/env');
    }}

    ></UserHeader>
    var modes = mode.split("/");

    if(mode === 'user'){
      // 메인 페이지 호출
      content = <User></User>
    }else{
      // 이벤트에 따른 페이지 호출
      for(var i = 0; i < modes.length; i++){
        if(i === 1){
          var url = modes[i];
          //url 정의 

          if(url === 'address'){
            content = <UserAddress></UserAddress>
          }else if(url === 'chat'){
            content = <UserChat></UserChat>
          }else if(url === 'message'){
            content = <UserMessage></UserMessage>
          }else if(url === 'email'){
            content = <UserEmail></UserEmail>
          }else if(url === 'calendar'){
            content = <UserCalendar></UserCalendar>
          }else if(url === 'env'){
            content = <UserEnv></UserEnv>
          }else if(url === 'cs'){
            content = <UserCs></UserCs>
          }else if(url === 'info'){ 
            content = <UserInfo></UserInfo>
          }
          // 더 커지면 url.append(modes[i]) 해서 url로 조건문 체크
        }
      }
    }
  }

  return (
    
      <div>
        {/* <Test></Test>
        <TestAsync></TestAsync> */}

          {header}
          {content}
          {footer}

      </div>
  );
}

export default App;
