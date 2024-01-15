import '../css/UserChat.css';
import axios from 'axios';
import { useEffect, useState } from 'react';


import UserChatList from './UserChatList';
import UserChatContents from './UserChatContents';

axios.defaults.withCredentials = true;

function UserChat(props){

    // 화면 컴포넌트 
    var userChatList = null;
    var userChatContents = null;

    const [chatRoomSeq, setChatRoomSeq] = useState(null);
    const [chatRoomTitle, setChatRoomTitle] = useState(null);
    const [chatRoomKey, setRoomKey] = useState(null);
    const [chatRoomUsers, setChatRoomUsers] = useState([null]);
    // 채팅 수신 데이터
    const [recvData, setRecvData] = useState(null);

    // 채팅 라인
    const [lineData, setLineData] = useState(null);

    // 다음 조회시 기준이되는 라인
    const [nextLine, setNextLine] = useState(null);

    // 웹소켓 클라이언트
    var client = props.client;
        
    // 채팅 리스트
    const items = [props.list];
    // 채팅 리스트 JSON 파싱
    const jsonData = JSON.parse(items);
    
    // 발신자 id
    const sender = props.userId;

    // 신규 수신 채팅방 및 건수 
    const chatRoomUnread = props.chatRoomUnread;

    // 입장한 채팅방의 대화 callback 함수 
    function chatRoomCallback(message){
        if (message.body) {
            console.log('body : ', message.body);
            var recvJson = JSON.parse(message.body);
            var chatSender = recvJson.chatSender;
            if(sender !== chatSender){
                setRecvData(message.body);
            }
          } else {
            
          }
    }

    // 입장시 해당 방의 line 조회 
    async function getChatRoomLines(chatRoomKey){
        var result = null;
    
        await axios({
            method:'POST',
            url:'http://localhost:8080/user/chatRoomLine',
            data:{
                chatRoomKey : chatRoomKey 
            }}).then(function(response){
                // console.log(response.data);
                result = response.data;
            }).catch(function(error){
                console.log(error);
                
            })

            return result;
    }

    // 방 입장  
    if(jsonData !== null){
        userChatList = <UserChatList chatRoomUnread={chatRoomUnread} jsonData={jsonData} enterChatRoom={(chatRoomSeq, chatRoomTitle, _chatRoomKey, chatRoomUsers)=>{
            
            // 토큰 검증 


            if(client !== null){
                if(chatRoomKey === null){
            
                    // 방 최초 입장시 구독
                    // id 값은 subscribe의 key와 같다. 
                    client.subscribe('/topic/room/'+_chatRoomKey, chatRoomCallback, {id:_chatRoomKey});
                    // console.log('신규구독 추가 url chatRoomSeq : ', _chatRoomKey);
    
                }else if(chatRoomKey !== null && chatRoomKey !== _chatRoomKey){
            
                    // 다른 방 입장시 기존 방 구독 취소 후 구독
                    // 구독 취소시 key값인 id 정보를 파라미터로 넘겨준다.
                    client.unsubscribe(chatRoomKey);
                    // console.log('구독 취소 후 새로 구독');
                    client.subscribe('/topic/room/'+_chatRoomKey, chatRoomCallback, {id:_chatRoomKey});
                }
            }
                  
            // 여기서 기존 라인 DB 조회 이후 재랜더링
            const promise = getChatRoomLines(_chatRoomKey);
            
            promise.then(promisePromiseResult=>{
                //console.log(promisePromiseResult.chatRoomLine);
                //console.log(promisePromiseResult.nextLine);
                setLineData(promisePromiseResult.chatRoomLine);
                setNextLine(promisePromiseResult.nextLine);
                setChatRoomSeq(chatRoomSeq);
                setChatRoomTitle(chatRoomTitle);
                setRoomKey(_chatRoomKey);
                setChatRoomUsers(chatRoomUsers);
            })

        }} chatListReload={()=>{
            // 더 상위 컴포넌트로 이동
            props.chatListReload();
        }}></UserChatList>
    }

    // 방 입장 및 채팅 라인 수신 recvData
    if(chatRoomSeq !== null && chatRoomKey !== null) {
        
        userChatContents 
        = <UserChatContents 
            sender={sender} client={client} 
            chatRoomTitle={chatRoomTitle} chatRoomKey={chatRoomKey} 
            chatRoomUsers={chatRoomUsers} recvData={recvData} lineData={lineData} nextLine={nextLine}></UserChatContents>
      
    }

    return(
        <div>
            {userChatList}
            {userChatContents}
        </div>
    )

}

export default UserChat;