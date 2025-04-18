
import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import * as StompJs from "@stomp/stompjs";
import * as SockJS from "sockjs-client";
import cookie from 'react-cookies';

 import AccessToken from './modules/AccessToken';


/* eslint import/no-webpack-loader-syntax: off */
import Worker from 'worker-loader!./modules/accessTokenWorker';

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
import AddressList from './modules/AddressList';



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

  const serverUrl = process.env.REACT_APP_SERVER_A_URL;
  const serverLoginUrl = process.env.REACT_APP_SERVER_LOGIN_URL;
  const serverWsUrl = process.env.REACT_APP_SERVER_WS_URL;



  // 최초 진입시 'login' useState를 통해 set하면 App이 갱신
  const [mode, setMode] = useState('login');
  const [list, setList] = useState(null);
  const [client, setClient] = useState(null);
  const [userId, setUserId] = useState(null);
  const [name, setName] = useState(null);
  
  
  // accesstoken 갱신 worker
  const [tokenWorker, setTokenWorker] = useState(null);
  // accesstoken을 header에 갱신하기 위함
  const [token, setToken] = useState(null);
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  // 전체 건수
  const [chatUnread, setChatUnread] = useState(null);
  // 수신한 채팅방의 건수 
  const [chatRoomUnread, setChatRoomUnread] = useState(null);

  //const [chatRoomSeq, setChatRoomSeq]= useState(null);
  //console.log(chatRoomSeq);

  var stompClient = null;

  let header = null;
  let content = null;
  let footer = null;
          
  let navigate = useNavigate();

  // access token 갱신 스레드
  function accessTokenRefresh(accesstoken, userId, worker){
   
    // 최초 accesstoken 넘겨줌 -> accessTokenWorker의 addEventListener
    worker.postMessage({
      userId: userId,
      accesstoken : accesstoken
    });

    worker.onmessage = e => {
      // accessTokenWorker의 postMessage 결과
      const { _accesstoken } = e.data;

      // 변경된 access Token을 다시 accessTokenWorker의 addEventListener 넘겨줌 (무한반복)
      worker.postMessage({
        userId: userId,
        accesstoken : _accesstoken
      });

      // 갱신된 token을 set하여 axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; 변경처리 하기위함
      setToken(_accesstoken);
  
    }

  }

  function webSocketCallback(stompClient, userId, chat, accesstoken, worker, name){
        // 로그인 완료 + 웹소켓 구독(자신의 ID) 완료

        // 20240121 - access token refresh worker 시작 
    
        accessTokenRefresh(accesstoken, userId, worker);

        // 로그인 후 최초 axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; 처리를 위함 
        setToken(accesstoken);
        // 로그아웃시 worker를 삭제처리 하기 위해 전역관리를 위함
        setTokenWorker(worker);
        setUserId(userId);
        setClient(stompClient);
        setChatUnread(parseInt(chat));
        setName(name);
        // 인증 완료 이후에 useNavigate를 이용하여 url을 변경함. 단, useNavigate를 사용하기 위해서는 react-router-dom 설치가 필요하며,
        // useNagivate hook을 사용하는 상위 컴포넌트 (현재의 상위 컴포넌트는 App)는 <BrowserRouter> 컴포넌트로 감싸 있어야 한다. (index.js 확인)
        navigate('/user'); 
        setMode('user');
        
  }

  // 웹소켓 구독 url로 데이터 수신 
  function subCallback(message){
    if (message.body) {
      // 여기서 갱신된 건수 받음

      //console.log(message.body);
      var unreadJson = JSON.parse(message.body);
      var type = unreadJson.type;

      if(type === 'chat'){
        // 신규 채팅 수신 -> 전체 건수 및 수신한 채팅 건수 동기화, 리스트 갱신
        var chat = unreadJson.chat;
        var room = unreadJson.room;
        setChatUnread(chat);
        setChatRoomUnread(room);

      }else if(type ==='msg'){
        console.log('recv msg unread');
      }else if(type ==='mail'){
        console.log('recv msg mail');
      }

    } else {
      
    }
  }
 
  async function checkToken(_mode){

    var nav = '/' + _mode;
    //console.log('checkToken 호출');
    const accessTokenPromise = checkAccessToken(_mode);
    // console.log('checkToken 호출 accessTokenPromise :', accessTokenPromise);
    accessTokenPromise.then(promiseResult=>{
      
      if(promiseResult === 'success'){
          // 정상 요청
          // 요청이 같을때 랜더링을 막기위한 처리
          if(mode !== _mode){
            navigate(nav);
            setMode(_mode);
            setList(null); //다른 nav를 눌렸을때 해당 nav에 대한 list를 조회하기 위해서 
          }
          // else{
          //   setAccTokenValid(true);
          // }
      }else if(promiseResult === '403'){
          // 서버 체크시 jwt가 없거나 유효하지 않은 것으로 판단(만료와는 다름)
          alert('인증정보가 유효하지 않는 요청이므로 로그아웃 됩니다.');
          navigate('/');
          if(client !== null){
            //console.log('로그아웃 요청시 sockjs client', client);      -- 웹소켓 연결확인용
            client.deactivate();
          }
          //20240513 
          //tokenWorker.terminate();
          setTokenWorker(null);
          setClient(null);
          setList(null);
          setChatRoomUnread(null);
          setMode('login');
          console.log('promiseResult === 403 error : ', accessTokenPromise);
      }else if(promiseResult === '400'){

        // jwt 토큰 만료시
        alert('로그인 기간이 만료되어 로그아웃 됩니다.');
        navigate('/');
        if(client !== null){
          //console.log('로그아웃 요청시 sockjs client', client);      -- 웹소켓 연결확인용
          client.deactivate();
        }
        //tokenWorker.terminate();
        setTokenWorker(null);
        setClient(null);
        setList(null);
        setChatRoomUnread(null);
        setMode('login');
        console.log('promiseResult === 400 error : ', accessTokenPromise);

        // 20240121 기존로직 - access 만료시 자동 갱신 처리를 위한 로직
        //   // access 토큰 만료 
        //   const promise = AccessToken(promiseResult);
        //   promise.then(promiseResult =>{
        //   if(promiseResult === 'logout'){
          
        //     alert('로그인 기간이 만료되어 로그아웃 됩니다.')
        //     navigate('/');
        //     if(client !== null){
        //       //console.log('로그아웃 요청시 sockjs client', client);      -- 웹소켓 연결확인용
        //       client.deactivate();
        //     }
        //     setClient(null);
        //     setList(null);
        //     setChatRoomUnread(null);
        //     setMode('login');

        //   }else if(promiseResult === 'success'){
        //     console.log('access token success', _mode);
            
        //     // 기존
        //     // navigate(nav);
        //     // setMode(_mode);
         
        //     if(mode !== _mode){
        //       // 다른 페이지 이동
        //       navigate(nav);
        //       setMode(_mode);
        //     }else{
        //       // 기존 페이지 유지 
        //       setAccTokenValid(true);
        //     }
        //   }

        // }).catch(function(error){
        //   console.log(error);
        // })

        }

      })
  };


  // 이벤트 전 access 토큰 검증 
  async function checkAccessToken(_mode){
    // console.log('access 토큰 체크 시작');
    //  20240114 tokenFlag는 checkAccessToken 호출시return값. 단, 요청하는 mode가 다를때는 set해서 재랜더링 return값 사용불가 
    var tokenFlag = null; 
    var tokenErrorCode = null;
   
    var result = null; 
    await axios({
        method:'GET',
        url : serverUrl+'/user/tokenVerification'
    }).then(function(response){
      
      tokenFlag = response.data.flag;
      tokenErrorCode = response.data.error_code;

      //console.log('checkAccessToken', tokenFlag, tokenErrorCode);

      if(tokenFlag === 'success'){
        result = tokenFlag;
      }else {
        result = tokenErrorCode;
      }
      
    }).catch(function(error){
      console.log(error);
    })

    return result;
  }
  

  {/*                     이하 화면                  */}


  // data는 post 방식일때 body
  if(mode === 'login'){ 
    // 어떠한 상황에서 로그아웃 되더라도 다시 로그인 요청시에는 브라우저의accessToken을 전송하지 않도록 함
    axios.defaults.headers.common['Authorization'] = null;

    header = <Header></Header>
    content = <Login loginRequest={(userId, password, provider)=>{
      axios({
        method:'post',
        url : serverLoginUrl,
        data:{
          "username":userId,
          "password":password,
          "provider":provider
        }
      }).then(function(response){
        const flag = response.data.flag;
        const accesstoken  = response.data.token;
        const name = response.data.name;
        
        // console.log('로그인시 결과 : ', response)
        // 채팅 미확인 건수
        const chat = response.data.chat;
        if(flag === 'success' && accesstoken !== null){
          // httpOnly header에 access token 추가 
          //axios.defaults.headers.common['Authorization'] = `Bearer ${accesstoken}`;
          // console.log('변경 전 ',accesstoken );
          
          //access token 발급을 위한 webworker 생성 웹소켓 disconnect시 terminate(); -> 사용하지 않음 기존 로그아웃 시 terminate() 주석처리 
          const worker = new Worker();
        
          // 웹소켓 구독 추가 
          stompClient = new StompJs.Client({
            //brokerURL : "ws://localhost:8080/earlyShake", // 직접접근인데..안됨
            webSocketFactory: () => new SockJS(serverWsUrl),  //프록시로 접근-서버에서 지정한 endpoint
            debug : function(data) {
                //console.log(data);
            }, 
            //reconnectDelay: 5000, // 자동 재 연결
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect:()=>{
                // console.log("connect web socket userID : ", userId);
                // 자신의 ID를 url로 하는 구독 추가, setClient
                stompClient.subscribe("/topic/user/" + userId, subCallback);
                stompClient.subscribe("/queue/user/" + userId, webSocketCallback(stompClient, userId, chat, accesstoken, worker, name));
                
            },
            onStompError: (frame) => {
                console.error(frame);
            },
            onDisconnect:()=>{
              // 기존은 로그아웃시 worker.terminate()를 통해 웹 워커를 종료시켰다. 
              // 하지만 서버와 연결이 정상적이지 않게 끊어진 경우 = 로그아웃에도 웹워커를 통해 accessToken을 갱신하는 처리가 죽지않아서 
              // 객체를 생성한 시점에 terminate 처리를 수행하도록 수정하였다.
              // 아마 비동기적인 요소로 인해 로그인 시점(webSocketCallback 메소드 내부에서 생성한 객체)에 useState를 통해서 전역으로 처리 하도록 한다고해도
              // 이후 로그아웃 시점에는 worker를 알 수 없는 상황이 생겨 terminate하더라도 정확하게 처리가 되지 않는 현상으로 인해 
              // worker가 죽지 않고 서버에 accessToken 갱신 처리를 요청 하였다고 생각한다.      
              worker.terminate();
            }
        
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
      
    }} 
    authenticationPage={()=>{
      setMode('authenticationPage');
    }} joinPage={()=>{
      navigate('/join');
      setMode('joinPage');
    }} findPw={()=>{
      setMode('findPw')
    }} findId={()=>{
      setMode('findId')
    }} googleLogin={()=>{
       console.log("구글로그인 시도!!");
    
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
       
    header = <UserHeader chatUnread={chatUnread} logout={()=>{
      // 로그 아웃시 access token 초기화 처리.
      // 해주지 않는다면 로그아웃 이후에도 해당 브라우저는 access token을 가지고 있어서 서버에 요청가능해짐.
      // 쿠키영역에 있는 refresh 토큰은 삭제 되지 않는데 어차피 서버에서는 access token을 가장 먼저 체크하기도 하고 다시 로그인하면 
      // 쿠키영역 업데이트함. 
      // axios.defaults.headers.common['Authorization'] = null; -> 페이지가 로그인일때 처리해 주는 것으로 변경함. 
      // mode를 변경하는 것 보다 list를 빼는 것을 먼저처리함으로 써 로그아웃시 리스트 데이터를 초기화시킴

      if(client !== null){
        console.log('로그아웃 요청시 sockjs client', client);     ///-- 웹소켓 연결확인용
        client.deactivate();
      }

      console.log('deactivate sockjs 이후 client', client);      // -- 웹소켓 연결확인용
     
      //tokenWorker.terminate();
      setTokenWorker(null);
      setClient(null);
      setList(null);
      setChatRoomUnread(null);
      setMode('login');
      navigate('/');
  
  

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
      // 4. 정상이라면 checkAccessToken에 던지는 매개변수에 맞는 페이지 및 navigate 처리, logout이라면 로그인 페이지로 이동처리.
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
    console.log(mode);
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
            if(list === null){
              var addressListPromiseResult = null;
              let addressListPromise = AddressList(userId, "0");
              addressListPromise.then(addressListPromiseResult =>{
                var result = addressListPromiseResult.type.result;
                if(result === 'success'){
                  var data = addressListPromiseResult.data;
                  setList(data);
                }else{
                  console.log(data);
                }
              })     
            }else{
              content = <UserAddress list={list} client={client} name={name} getAddressList={(limit)=>{
                // 기존 리스트 + 신규 리스트를 더함 spread 함수 
                var addressListPromiseResult = null;
                let addressListPromise = AddressList(userId, limit);
                addressListPromise.then(addressListPromiseResult =>{
                  var beforeList = list.friend_list;
                  var appendList = addressListPromiseResult.friend_list;
                  const newArr = [
                    ...beforeList,
                    ...appendList
                  ]
                  addressListPromiseResult.friend_list = newArr;
                  setList(addressListPromiseResult);
                })  
              }} addFriendSuccess={()=>{
                setList(null);
              }} chatListReload={(chat)=>{
                setChatUnread(parseInt(chat));
              }}></UserAddress>
            }
          }else if(url === 'chat'){
            if(list === null){
              // 채팅 리스트를 매번 호출 하는 것은 무리가 있다. 최초 한번 요청하고 이후에 
              // 특정 시간이 지났을때나 받아오면 어떨까?
              // 한번만 받아와서 실시간 패킷을 받았을때 리스트를 갱신 - 방정보를 알아야함.
              // 실시간 패킷 수신시 리스트 갱신 요청함. 

              // console.log('리스트 최초 호출')

              var chatListPromiseResult = null;
              let chatListPromise = ChatList(userId); // 1
              chatListPromise.then(promise =>{
                var type = promise.type;
                var data = promise.data;
                if(type && data){
                  if(type ==='success'){
                    setList(data.chat_list);
                  }else{
                    console.log('chatList server check !')
                    setList(type);
                  }
                }
              })
            }else{
              // 최초 호출로 리스트 정보 받고 .... 리스트만 랜더링
              // 리스트가 없거나 사용자 토큰으로 받을 수 없는 경우 다르게 조건처리해야함. 
              // console.log(list);
              if(list === 'fail'){
                navigate('/');
                // access token 발급 사용자가 아님(서버 DB에 없는 경우)
                alert('비정상적인 정보로 서버에 요청하므로 로그아웃 됩니다.');
                if(client !== null){
                  //console.log('로그아웃 요청시 sockjs client', client);      -- 웹소켓 연결확인용
                  client.deactivate();
                }
                //tokenWorker.terminate();
                setTokenWorker(null);
                setClient(null);
                setList(null);
                setChatRoomUnread(null);
                setMode('login');
              }else if(list === 'empty'){
                // 채팅 리스트가 없는경우
                content = <UserNoChat></UserNoChat>
              }else{
                //console.log('APP.js list : ',list);
                content = <UserChat list={list} client={client} userId ={userId} name={name} chatRoomUnread={chatRoomUnread} 
                
                chatListRefresh={()=>{
                  // 채팅 입력시 리스트 갱신 요청

                  //console.log('신규 채팅방 생성시 리스트 갱신 요청');
                  var chatListPromiseResult = null;
                  let chatListPromise = ChatList(userId); // 2

                  chatListPromise.then(promise =>{
                    var type = promise.type;
                    var data = promise.data;
                    if(type && data){
                      if(type ==='success'){
                        setList(data.chat_list);
                      }else{
                        console.log('chatList server check !')
                        setList(type);
                      }
                    }
                  })
                }}

                chatListReload={(chat)=>{
                  // 채팅 수신시 건수 갱신 + 리스트 갱신
                  var chatListPromiseResult = null;
                  let chatListPromise = ChatList(userId); // 3
                  chatListPromise.then(chatListPromiseResult =>{

                    chatListPromise.then(promise =>{
                      var type = promise.type;
                      var data = promise.data;
                      if(type && data){
                        if(type ==='success'){
                          setList(data.chat_list);
                        }else{
                          console.log('chatList server check !')
                          setList(type);
                        }
                      }
                    })
                  })
              
                }}></UserChat>
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
