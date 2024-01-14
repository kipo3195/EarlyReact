import '../css/UserChat.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

axios.defaults.withCredentials = true;
function UserChatList(props){

    const jsonData = props.jsonData;

    const chatRoomUnread = props.chatRoomUnread;

    useEffect(()=>{
        // 신규 채팅 수신한 정보 chatRoomUnread = roomKey|count 
        // 신규 채팅을 수신한 방은 가장 상단에 적용되어야 한다.
        // 그러므로 20240110 기준으로 채팅리스트를 모두 가지고 오도록 처리한다.
        // 이후 페이징 처리를 적용 하도록 한다.
        // console.log('chatRoomUnread', chatRoomUnread);
        if(chatRoomUnread !== null){
            
            // 최초 채팅리스트 호출시 chatRoomUnread은 null, 이때는 갱신하지 않도록 처리함.
            props.chatListReload();

        }

    },[chatRoomUnread]);

    // 룸 클릭시 해당 방으로 이동하는 함수
    function roomClick(chatRoomSeq, chatRoomUsers, chatRoomTitle, chatRoomKey){
        
        // 방 이름으로 ~외 몇명으로 만듬
        if(chatRoomTitle === null){
            chatRoomTitle = makeTitle(chatRoomUsers);
        }
        
        props.enterChatRoom(chatRoomSeq, chatRoomTitle, chatRoomKey, chatRoomUsers);
    
    }
    
    // 방제목 생성 함수 
    function makeTitle(t){
        return t.split('|')[0] + ' 외 ' + (t.split('|').length - 1)+'명';
    }

    // 리스트 마지막 일자 생성 함수 
    function makeLastDate(t){
        var date ='';

        for(var i = 0 ; i < 6; i++){
            date += t[i];
            if(i === 1 || i === 3){
                date +='-';
            }
            
        }

        return date;
    }


    return (
            
             <div id ='chatListDiv'>
                <table id ='chatListTable'>
                    <tbody>
                        {jsonData.map((item) =>
                        
                        <tr className='chatListTr' key={item.chatRoomSeq} onClick={event=> {
                            event.preventDefault();
                            // 리스트 클릭시 방제목 변경처리
                            roomClick(item.chatRoomSeq, item.chatRoomUsers, item.chatRoomTitle, item.chatRoomKey);
                        }}>
                            <td className='chatListTitleTd'>
                                {/* return 내에서 조건문(삼항 연산자)*/}
                                { 
                                    item.chatRoomTitle === null
                                    ? makeTitle(item.chatRoomUsers)
                                    : item.chatRoomTitle
                                }
                            </td>
                                {/* return 내에서 split*/}
                            <td className='chatListUsersTd'>{ 
                                item.chatRoomTitle === null
                                ? ''
                                : makeTitle(item.chatRoomUsers)
                                }
                            </td>
                            <td className='chatListLastDateTd'>
                                {makeLastDate(item.lastLineKey)}
                            </td>
                            <td className='chatListUnreadCountTd'>
                                {item.unreadCount}
                            </td>
                            <td>
                            <input type='hidden' value={item.chatRoomUsers}></input>
                            </td>
                            
                        </tr>
                        )}            
                    </tbody>
                </table>
            </div>
        
            )
}


export default UserChatList;