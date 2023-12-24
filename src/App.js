
import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import cookie from 'react-cookies';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import * as StompJs from "@stomp/stompjs";
import * as SockJS from "sockjs-client";
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
import UserNoChat from './user/layout/UserNoChat';

import ChatList from './modules/ChatList';




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
  const [list, setList] = useState(null);
  const [client, setClient] = useState(null);
  const [userId, setUserId] = useState(null);
  var stompClient = null;

  let header = null;
  let content = null;
  let footer = null;
          

  let navigate = useNavigate();

  function webSocketCallback(stompClient, userId){
        // 로그인 완료 + 웹소켓 구독(자신의 ID) 완료
        setUserId(userId);
        setClient(stompClient);
        // 인증 완료 이후에 useNavigate를 이용하여 url을 변경함. 단, useNavigate를 사용하기 위해서는 react-router-dom 설치가 필요하며,
        // useNagivate hook을 사용하는 상위 컴포넌트 (현재의 상위 컴포넌트는 App)는 <BrowserRouter> 컴포넌트로 감싸 있어야 한다. (index.js 확인)
        navigate('/user'); 
        setMode('user');
  }

  function onMessageReceived(){
    console.log('데이터 수신')
  }
  
  // 이벤트 전 토큰 검증 + access 토큰 재발급 
  async function checkToken(mode){
    var tokenFlag = null; 
    var tokenErrorCode = null;

    var nav = '/' + mode;
   
    await axios({
        method:'GET',
        url : 'http://localhost:8080/user/tokenVerification'
    }).then(function(response){
      
      tokenFlag = response.data.flag;
      tokenErrorCode = response.data.error_code;

      console.log(tokenFlag);
      if(tokenFlag === 'success'){
        // 정상 요청
        console.log('success', mode);
        navigate(nav);
        setMode(mode);
      }else if(tokenErrorCode === '403'){
        // 바로 로그아웃 처리 refresh 토큰이 없는것으로 판단.
        alert('로그인 기간이 만료되어 로그아웃 됩니다');
        navigate('/');
        if(client !== null){
          //console.log('로그아웃 요청시 sockjs client', client);      -- 웹소켓 연결확인용
          client.deactivate();
        }
        setClient(null);
        setList(null);
        setMode('login');
        
      }else{
        // access 토큰 만료 
        const promise = AccessToken(tokenFlag, tokenErrorCode);

        promise.then(promiseResult =>{
          if(promiseResult === 'logout'){
          
            alert('로그인 기간이 만료되어 로그아웃 됩니다.')
            navigate('/');
            if(client !== null){
              //console.log('로그아웃 요청시 sockjs client', client);      -- 웹소켓 연결확인용
              client.deactivate();
            }
            setClient(null);
            setList(null);
            setMode('login');

          }else if(promiseResult === 'success'){
            console.log('access token success', mode);
            navigate(nav);
            setMode(mode);

          }

        }).catch(function(error){
          console.log(error);
        })

      }
      
    }).catch(function(error){
      console.log(error);
    })
  }
  

  {/*                     이하 화면                  */}


  // data는 post 방식일때 body
  if(mode === 'login'){ 

    console.log('login page의 sockjs Client ', client);
    
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
          // httpOnly header에 access token 추가 
          axios.defaults.headers.common['Authorization'] = `Bearer ${accesstoken}`;
          
          // 웹소켓 구독 추가 
          stompClient = new StompJs.Client({
            //brokerURL : "ws://localhost:8080/ws",
            webSocketFactory: () => new SockJS("/earlyShake"), 
            debug : function(data) {
                console.log(data);
            }, 
            // reconnectDelay: 5000, // 자동 재 연결
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect:()=>{
                // console.log("connect web socket userID : ", userId);
                // 자신의 ID를 url로 하는 구독 추가, setClient
                stompClient.subscribe("/topic/user/" + userId);
                stompClient.subscribe("/queue/user/" + userId, webSocketCallback(stompClient, userId));
            },
            onStompError: (frame) => {
                console.error(frame);
            },

          
        
        });
        
        stompClient.activate(); // 활성화(없으면 Connect함수 호출하지 않음. )
        
        // 이하 로직 webSocketCallback으로 이동함. 20231217
        // 인증 완료 이후에 useNavigate를 이용하여 url을 변경함. 단, useNavigate를 사용하기 위해서는 react-router-dom 설치가 필요하며,
        //   useNagivate hook을 사용하는 상위 컴포넌트 (현재의 상위 컴포넌트는 App)는 <BrowserRouter> 컴포넌트로 감싸 있어야 한다. (index.js 확인)
        //   navigate('/user'); 
        //   setMode('user');
 
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
      // mode를 변경하는 것 보다 list를 빼는 것을 먼저처리함으로 써 로그아웃시 리스트 데이터를 초기화시킴

      if(client !== null){
        console.log('로그아웃 요청시 sockjs client', client);     ///-- 웹소켓 연결확인용
        client.deactivate();
      }
      console.log('deactivate sockjs 이후 client', client);      // -- 웹소켓 연결확인용
      
      setClient(null);
      setList(null);
      setMode('login');
    }} cs={()=>{

      navigate('/user/cs');
      setMode('user/cs');
      
    }} info={()=>{
      
      checkToken('user/info');
    }} address={()=>{
      
      checkToken('user/address');
    
    }} chat={()=>{
      
      // 토큰 검증 로직 20231204
      // 각 함수별로 보여줄 페이지의 mode를 던져주면 내부에서 navigate를 사용하여 url도 처리함
      // 1. tokenVerification url 호출하여 현재 브라우저가 갖는 access token으로 1차 검증
      // 2. access token이 만료된 경우 refresh 토큰으로 2차 검증 AccessToken.js
      // 3. 만료인지 재발급인지 판단해서 promise 객체를 리턴, promiseResult가 success인지 logout인지에 따라 처리(navigate, setMode);
      // 4. 정상이라면 checkToken에 던지는 매개변수에 맞는 페이지 및 navigate 처리, logout이라면 로그인 페이지로 이동처리.
      checkToken('user/chat');
    
    }} message={()=>{

      checkToken('user/message');
    
    }} email={()=>{

      checkToken('user/email');

    }} calendar={()=>{
    
      checkToken('user/calendar');

    }} env={()=>{
      
      checkToken('user/env');
      
    }}
    ></UserHeader>
    var modes = mode.split("/");

    if(mode === 'user'){
      // console.log('login 이후 메인페이지의 sockjs Client ', client);      -- 웹소켓 연결확인용
      // 로그인 이후  메인 페이지 호출
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
            if(list === null){
              // 채팅 리스트를 매번 호출 하는 것은 무리가 있다. 최초 한번 요청하고 이후에 
              // 특정 시간이 지났을때나 받아오면 어떨까?
              // 한번만 받아와서 실시간 패킷을 받았을때 리스트를 갱신 - 방정보를 알아야함. 

              console.log('리스트 최초 호출')
              var chatListPromiseResult = null;
              let chatListPromise = ChatList();
              chatListPromise.then(chatListPromiseResult =>{
                
                setList(chatListPromiseResult.chat_list);
              })
            }else{
              // 최초 호출로 리스트 정보 받고 .... 리스트만 랜더링
              // 리스트가 없거나 사용자 토큰으로 받을 수 없는 경우 다르게 조건처리해야함. 
              console.log(list);
              if(list === "C403"){
                // access token 발급 사용자가 아님(서버 DB에 없는 경우)
                alert('비정상적인 토큰으로 서버에 요청하므로 로그아웃 됩니다.');
                if(client !== null){
                  //console.log('로그아웃 요청시 sockjs client', client);      -- 웹소켓 연결확인용
                  client.deactivate();
                }
                setClient(null);
                setList(null);
                setMode('login');
              }else if(list === "C404"){
                // 채팅 리스트가 없는경우
                content = <UserNoChat></UserNoChat>
              }else{
                content = <UserChat list={list} client={client} userId ={userId}></UserChat>
              }
            }
            
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
