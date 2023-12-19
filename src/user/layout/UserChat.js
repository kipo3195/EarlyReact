import '../css/UserChat.css';
import axios from 'axios';
import { useState } from 'react';

axios.defaults.withCredentials = true;


function UserChat(props){

    const [roomKey, setRoomKey] = useState(null);
    const [title, setTitle] = useState(null);
    const [recevier, setRecevier] = useState(null);
    const [contents, setContents ] = useState(null);
    const [contentLines,setContentLines ] = useState([]);

    
    // 웹소켓 클라이언트
    var client = props.client;
    // 채팅 리스트
    const items = [props.list];
    // console.log(items);
    const jsonData = JSON.parse(items);
    //채팅 데이터 jsonArray
    // console.log(jsonData);

    const sender = props.userId;
    

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

    // 룸 클릭시 해당 방으로 이동하는 함수
    function roomClick(chatRoomSeq, chatRoomUsers, chatRoomTitle){
        console.log("여기", chatRoomUsers);
        if(chatRoomTitle === null){
            setTitle(makeTitle(chatRoomUsers));
        }else{
            setTitle(chatRoomTitle);
        }
        setRoomKey(chatRoomSeq);
        setRecevier(chatRoomUsers);
    
    }

    // 전송버튼 클릭시 
    function sendMessage(message){
        console.log(roomKey, message);
        if(message === null || message === ''){
            alert('못보냄');
            return;
        }

        client.publish({
            // 데이터를 보내는 경로 /app + 서버(UserChatController)의 @MessageMapping(/test/message)
            destination:"/app/test/message",
            body:JSON.stringify({
                chatRoomKey : roomKey,
                chatContents : message,
                chatReceiver : recevier,
                chatSender : sender
            })
        });

        let json ={

            userid :sender,
            lineData : message
            
            }     
       
        contentLines.push(json);
        console.log(contentLines);
        
    }
    // textarea 데이터 입력시 
    function changeContents(e){

        setContents(e.target.value);
    
    }

    // textarea에서 엔터 클릭시 일단 
    function enterSend(e){

        if(e.code === 'Enter' || e.key ==='Enter'){
            
            sendMessage(contents);
        }
    
    }


    
    return(
        
        <div>
            {/*리스트 영역 */}
            <div id ='chatListDiv'>
                <table id ='chatListTable'>
                    <tbody>
                        {jsonData.map((item) =>
                        
                        <tr className='chatListTr' key={item.chatRoomSeq} onClick={event=> {
                            event.preventDefault();
                            // 리스트 클릭시 방제목 변경처리
                            roomClick(item.chatRoomSeq, item.chatRoomUsers, item.chatRoomTitle);
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
                            <td>
                               <input type='hidden' value={item.chatRoomUsers}></input>
                            </td>
                            
                        </tr>
                        )}            
                    </tbody>
                </table>
            </div>

            {/*컨텐츠 영역*/}
            <div id ='contentDiv'>
                <div id ='chatRoomTitle'>
                    <table>
                        <tbody>
                            <tr>
                                <th id='chatRoomTitleTh'>{title}</th>
                            </tr>
                        </tbody>
                    </table>     
                </div>

                <div id ='chatRoomContents'>
                    {contentLines.map((item)=>{
              
                    })}
                </div>

                <div id ='chatRoomText'>
                    <form onSubmit={event=>{
                        event.preventDefault();
                        // stomp pub
                        
                        //console.log(event.target.chatTextArea.value);
                        sendMessage(event.target.chatTextArea.value);

                        event.target.chatTextArea.value = null;

                        }}>
                        <table id ='chatTable'>
                            <tbody>
                                <tr>                                
                                    <td><textarea id='chatTextArea' rows="9" style={{width:"100%"}} placeholder='채팅을 입력해주세요... [줄바꿈 Shift + Enter]'
                                     onKeyUp={e=> enterSend(e)}
                                     onChange={e=> changeContents(e)}
                                     ></textarea></td>
                                </tr>
                            </tbody>
                            <tfoot id ='chatRoomButton'>
                                <tr>                    
                                    <td colSpan='5'>
                                        <input type ='button' value='botton1'></input>
                                        <input type ='button' value='botton2'></input>
                                        <input type ='button' value='botton3'></input>
                                        <input id='chatTextSend' type ='submit' value='전송'></input>
                                    </td>            
                                </tr>
                            </tfoot>
                        </table>
                    </form>
                </div>

                <div >
                </div>
            </div>
        </div>
    )

}

export default UserChat;