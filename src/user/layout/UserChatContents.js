import '../css/UserChat.css';
import axios from 'axios';
import { useState } from 'react';

axios.defaults.withCredentials = true;

function UserChatContents(props){

    // const [title, setTitle] = useState(null);
    var title = props.chatRoomTitle;
    var roomKey = props.chatRoomKey;
    var client = props.client;
    var sender = props.sender;
    var recevier = props.chatRoomUsers;
    
    const [contents, setContents] = useState('');
    const [contentLines,setContentLines ] = useState([]);

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
        e.preventDefault(); //onkeyUp의 기본이벤트를 차단하지 않으면 2번 호출됨. 

        
        if((contents !=='') && (e.code === 'Enter' || e.key ==='Enter')){
            console.log(e);
            
            setContents('');
            //sendMessage(contents);
        }
    
    }

    function enterSendDown(e){
        
        console.log(e);
    }

    return (
  
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
                    console.log(event.target.chatTextArea.value);
                    //sendMessage(event.target.chatTextArea.value);

                    event.target.chatTextArea.value = null;

                    }}>
                    <table id ='chatTable'>
                        <tbody>
                            <tr>                                
                                <td><textarea id='chatTextArea' rows="9" style={{width:"100%"}} placeholder='채팅을 입력해주세요... [줄바꿈 Shift + Enter]'
                                 onKeyUp={e=> enterSend(e)}
                                 onKeyDown={e=> enterSendDown(e)}
                                 onChange={e=> changeContents(e)}
                                 value ={contents}
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
        </div>
    
    )
}

export default UserChatContents