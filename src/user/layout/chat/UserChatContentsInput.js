import '../../css/UserChat.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import UserChatMentionModal from './UserChatMentionModal';

function UserChatContentsInput(props){

    const [contents, setContents] = useState('');

    // 지명채팅 모달 Flag
    const [isMentionModal, setMentionModal] = useState(false);
    // 참여자 = 지명대상
    const [chatRoomUserList, setChatRoomUserList] = useState(null);

    var client = props.client;
    var roomKey = props.chatRoomKey;
    var recevier = props.recevier;
    var sender = props.sender;  
    
    // textarea에서 엔터 클릭시 일단 
    function enterSend(e){
         e.preventDefault(); //onkeyUp의 기본이벤트를 차단하지 않으면 2번 호출됨. 
        
        if(contents === '\n'){
            setContents('');
            return;
        }

        if((contents !== '') && (e.code === 'Enter' || e.key ==='Enter')){
            
            // 줄 바꿈은 메시지를 보내지 않는다.
            if(e.nativeEvent.shiftKey){
                return;
            }else{
                if(contents !== '\n'){
                    // 대화내용 없이 엔터는 \n -> 채팅 전송 안함.
                    sendMessage(contents, true);
                }
                
            }
        }
    }

      // 전송버튼 클릭시 
    function sendMessage(message, enterFlag){
        

        if(message === null || message === ''){
            return;
        }

        // 라인키 발급 로직 
        const lineKeyPromise = getLineKey();
        
        lineKeyPromise.then(promisePromiseResult=>{
            if(promisePromiseResult !== 'error'){
                var lineKey = promisePromiseResult;                
                if(enterFlag){
                    // 엔터로 전송시 개행처리 \n 제거 
                    message = message.substr(0, message.length-1);
                }
                // 웹소켓 채팅 발신
                client.publish({
                    // 데이터를 보내는 경로 /app + 서버(UserChatController)의 @MessageMapping(/test/message)
                    // chatType 동적 처리하기 TODO
                    destination:"/app/user/chat",
                    body:JSON.stringify({
                        chatRoomKey : roomKey,
                        chatContents : message,
                        chatReceiver : recevier,
                        chatSender : sender,
                        chatType : "C",
                        chatLineKey : lineKey
                    })
                });

                // 라인 데이터 보여주기 
                let line ={
                    chatRoomKey : roomKey,
                        chatContents : message,
                        chatReceiver : recevier,
                        chatSender : sender,
                        chatType : "C",
                        chatLineKey : lineKey,
                        chatUnreadCount : (recevier.split('|')).length-1 // 발신자에게 보여줄 미확인 건수
                }

                //상위 컴포넌트에 알려줌
                props.addLine(line);  

                // textarea 초기화용
                setContents('');

            }else{
                console.log('채팅 전송 실패');
            }
        })
    }

    // 라인키 발급 API 호출
    async function getLineKey(){
        
        var result = null;

        await axios({
            method:'get',
            url:'http://localhost:8080/user/getLineKey',

        }).then(function(response){
            //console.log(response);
            result = response.data.lineKey;
        }).catch(function(error){
            console.log('getLineKey error : ', error);
            result = "error";
        })

        return result;
    }

        // 채팅방 참여자 조회 API 호출
        async function getChatRoomUsersCall(){

            var result = null;
    
            await axios({
                method:'POST',
                url:'http://localhost:8080/user/getChatRoomUsers',
                data:{
                    chatRoomKey : roomKey,
                    limitCnt : 0 // 동적 처리 필요 
                }}).then(function(response){
                    //console.log(response.data);
                    result = response.data;
                }).catch(function(error){
                    console.log(error);
                    
                })
    
            return result;
    
        }


    // 채팅데이터 입력 감지
    function changeText(e){

        console.log(e.keyCode);
        var word = e.target.value;
        
        if(word.startsWith('@')){
            // 띄어쓰기를 했을때 모달창을 닫음
            if(word.includes(' ')){
                setMentionModal(false);
            }else{
                // 지명대상 참여자 조회
                const getChatRoomUsersPromise = getChatRoomUsersCall();
                getChatRoomUsersPromise.then(promiseResult=>{
                    
                    setChatRoomUserList(promiseResult.result);
                    setMentionModal(true);
                })
            }

        };

        setContents(e.target.value);    
     
    }
    // 채팅 데이터 esc 감지 -> 지명 모달 닫기 처리
    function escKeyDown(e){
        console.log(e.currentTarget);
        
        if(e.code === 'Escape'){
            if(isMentionModal){
                setMentionModal(false);
            }
        }
    }
    const chatMentionModal = <UserChatMentionModal chatRoomUserList={chatRoomUserList} closeModal={()=>{
        setMentionModal(false);
    }}></UserChatMentionModal>

    return (
    
    <div id ='chatRoomText'>
        <form onSubmit={event=>{
            event.preventDefault();
            // stomp pub

            sendMessage(event.target.chatTextArea.value, false);

            }}>
            <table id ='chatTable'>
                <tbody>
                    <tr>                                
                        <td><textarea id='chatTextArea' rows="9" style={{width:"100%"}} placeholder='채팅을 입력해주세요... [줄바꿈 Shift + Enter]'
                         onKeyUp={e=> enterSend(e)}
                         onChange={e=> changeText(e)}
                         value ={contents}
                         onKeyDown={e=> escKeyDown(e)}
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

        {/* 지명 채팅 대상자 리스트 모달*/}
        {isMentionModal ? chatMentionModal : ''}
    </div>
                 
    )


}


export default UserChatContentsInput