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

    const [recvData, setRecvData] = useState(null);
    // 웹소켓 클라이언트
    var client = props.client;
        
    // 채팅 리스트
    const items = [props.list];
    // 채팅 리스트 JSON 파싱
    const jsonData = JSON.parse(items);
    
    // 발신자 id
    const sender = props.userId;

    function chatRoomCallback(message){
        if (message.body) {
            
            var recvJson = JSON.parse(message.body);
            var chatSender = recvJson.chatSender;
            if(sender !== chatSender){
                setRecvData(message.body);
            }
          } else {
            
          }
    }
    console.log(jsonData);
    // 리스트 조회
    if(jsonData !== null){
        userChatList = <UserChatList jsonData={jsonData} enterChatRoom={(chatRoomSeq, chatRoomTitle, _chatRoomKey, chatRoomUsers)=>{
            
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

            setChatRoomSeq(chatRoomSeq);
            setChatRoomTitle(chatRoomTitle);
            setRoomKey(_chatRoomKey);
            setChatRoomUsers(chatRoomUsers);


        }}></UserChatList>
    }

    // 리스트에서 방 선택
    if(chatRoomSeq !== null && chatRoomKey !== null) {
        // DB 조회 로직 line데이터 

        userChatContents 
            = <UserChatContents 
                sender={sender} client={client} 
                chatRoomTitle={chatRoomTitle} chatRoomKey={chatRoomKey} 
                chatRoomUsers={chatRoomUsers} recvData={recvData}></UserChatContents>
    }

    return(
        <div>
            {userChatList}
            {userChatContents}
        </div>
    )

}

export default UserChat;