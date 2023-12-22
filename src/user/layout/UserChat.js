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

    // 웹소켓 클라이언트
    var client = props.client;
        
    // 채팅 리스트
    const items = [props.list];
    // 채팅 리스트 JSON 파싱
    const jsonData = JSON.parse(items);
    
    // 발신자 id
    const sender = props.userId;
    
    
    if(jsonData !== null){
        userChatList = <UserChatList jsonData={jsonData} enterChatRoom={(chatRoomSeq, chatRoomTitle, chatRoomKey, chatRoomUsers)=>{

            setChatRoomSeq(chatRoomSeq);
            setChatRoomTitle(chatRoomTitle);
            setRoomKey(chatRoomKey);
            setChatRoomUsers(chatRoomUsers);
        }}></UserChatList>
    }

    if(chatRoomSeq !== null) {
        // DB 조회 로직 line데이터 
        userChatContents = <UserChatContents sender={sender} client={client} chatRoomTitle={chatRoomTitle} chatRoomKey={chatRoomKey} chatRoomUsers={chatRoomUsers}></UserChatContents>
    }

    return(
        <div>
            {userChatList}
            {userChatContents}
        </div>
    )

}

export default UserChat;