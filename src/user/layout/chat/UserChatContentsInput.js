import '../../css/UserChat.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

function UserChatContentsInput(props){

    const [contents, setContents] = useState('');

    var client = props.client;
    var roomKey = props.chatRoomKey;
    var recevier = props.recevier;
    var sender = props.sender;  
    
    // textarea에서 엔터 클릭시 일단 
    function enterSend(e){
         e.preventDefault(); //onkeyUp의 기본이벤트를 차단하지 않으면 2번 호출됨. 

        if((contents !== '') && (e.code === 'Enter' || e.key ==='Enter')){
            
            // 줄 바꿈은 메시지를 보내지 않는다.
            if(e.nativeEvent.shiftKey){
                return;
            }else{
                if(contents !== '\n'){
                    // 대화내용 없이 엔터는 \n -> 채팅 전송 안함.
                    sendMessage(contents);
                }
                setContents('');
            }
        }
    }

      // 전송버튼 클릭시 
    function sendMessage(message){
        console.log(roomKey, message);
        if(message === null || message === ''){
            alert('채팅을 전송할 수 없습니다.');
            return;
        }
        // 엔터로 전송시 개행처리 제거 
        message = message.substr(0, message.length-1);

        // 웹소켓 채팅 발신
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

        // 라인 데이터 보여주기 

        let line ={
            userid :sender,
            lineData : message
        }

        //상위 컴포넌트에 알려줌
        props.addLine(line);  
    
    }

    // 채팅데이터 입력시 
    function changeText(e){
        setContents(e.target.value);
     
    }

    return (
    
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
                         onChange={e=> changeText(e)}
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
                 
    )


}


export default UserChatContentsInput