import '../../css/UserChat.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import UserChatMentionModal from './UserChatMentionModal';

function UserChatContentsInput(props){

    const serverUrl = process.env.REACT_APP_SERVER_A_URL;

    
    const [contents, setContents] = useState('');
    // 지명채팅 모달 Flag
    const [isMentionModal, setMentionModal] = useState(false);
    // 참여자 = 지명대상 = 서버로 부터 받아온
    const [chatRoomUserList, setChatRoomUserList] = useState(null);
    // 검색용 참여자
    const [chatRoomSearchUserList, setChatRoomSearchUserList] = useState(null);
    
    // 채팅 라인 \n 배열관리 
    const [wordArray, setWordArray] = useState(null);
    // 변경이 일어난 배열의 index
    const [wordArrayIdx, setWordArrayIdx] = useState(null);

    // 빈값일때 입력 못하게 함
    const [emptyCheck, setEmptyCheck] = useState(false);

    var client = props.client;
    var roomKey = props.chatRoomKey;
    var recevier = props.recevier;
    var sender = props.sender;  
    var title = props.title;
    var createRoomDate = props.createRoomDate;
    
    // 방 최초입장시에만 값 존재 
    var _emptyRoomFlag = props.emptyRoomFlag;

    const [emptyRoomFlag, setEmptyRoomFlag] = useState(false);

    useEffect(()=>{

        // 해당영역은 신규 생성(채팅X) -> 기존방 입장 혹은 기존방 입장 -> 신규생성시에만 호출된다. 
        console.log('_emptyRoomFlag : ', _emptyRoomFlag);
        setEmptyRoomFlag(_emptyRoomFlag);

    }, [_emptyRoomFlag])


    useEffect(() =>{
        // 신규 생성한 방이면 true;
        //setEmptyRoomFlag(_emptyRoomFlag);
        // 해당 useEffect는 roomKey가 변경될때마다 실행됨.
        return()=>{
            // 지명 채팅 모달을 닫기 위해 실행. 
            // 해당 컴포넌트가 unMount 될때 실행됨.
            setMentionModal(false);

        }
    }, [roomKey])

    // textarea에서 엔터 클릭시 일단 
    function enterSend(e){
    
        //console.log('onKeyUp 이벤트 : ', e.target.value);
         e.preventDefault(); //onkeyUp의 기본이벤트를 차단하지 않으면 2번 호출됨. 
         if(contents === '\n'){
             setContents('');
             return;
            }
            
            if((contents !== '') && (e.key ==='Enter')){

            // 줄 바꿈은 메시지를 보내지 않는다.
            if(e.nativeEvent.shiftKey){
                return;
            }else{
                if(contents !== '\n'){
                    // 대화내용 없이 엔터는 \n -> 채팅 전송 안함.

                    //console.log(emptyRoomFlag);

                    if(emptyRoomFlag){
                    
                        // 비동기로 방생성 API 호출 이후에 채팅 라인 전달 처리
                        // 생성자, 룸키, 참여자, 방제목
                        const roomKeyPromise = putRoomKey(sender, roomKey, recevier, title);
                        roomKeyPromise.then(roomKeyPromiseResult=>{
                            // console.log(roomKeyPromiseResult);
                            // 20240312 여기까지 확인함. 

                            sendMessage(contents, true);
                            setMentionModal(false);
                            setEmptyRoomFlag(false);
                        })

                    }else{
                         sendMessage(contents, true);
                         setMentionModal(false);
                    }

                }
                
            }
        }
    }

    async function putRoomKey(sender, roomKey, recevier, title){

        var result = null;

        console.log('방생성시 : ', sender, roomKey, recevier, title);
        // 방 생성
        await axios({
            method:'post',
            url: serverUrl +'/user/putChatRoom',
            data : {
                sender : sender,
                chatRoomKey : roomKey,
                chatRoomUsers : recevier,
                chatRoomTitle : title,
                lastLineKey : '0',
                createRoomDate : createRoomDate
            }

        }).then(function(response){
            console.log(response);
            if(response.data.flag ==='success'){
                result = "success";
            }else{
                result = "false";    
            }
        }).catch(function(error){
            result = "error";
        })

        return result;

    }

      // 전송버튼 클릭시 
    function sendMessage(message){
        
        if(message === null || message === ''){
            return;
        }

        // 라인키 발급 로직 
        const lineKeyPromise = getLineKey();
        
        lineKeyPromise.then(promisePromiseResult=>{
            if(promisePromiseResult !== 'error'){
                var lineKey = promisePromiseResult;       
                        
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
            url:serverUrl +'/user/getLineKey',

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
                url:serverUrl +'/user/getChatRoomUsers',
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
        // console.log('onChange시 이벤트 감지 : ', e.target.value);
        // 입력데이터
        var word = e.target.value;
        
        // 입력데이터 줄바꿈
        var wordArr = word.split('\n');
        // console.log(wordArr);

        // 줄바꿈을 기준으로 배열로 관리
        setWordArray(wordArr);
        // 변경이 일어난 배열 idx
        setWordArrayIdx(wordArr.length-1);

        // 줄바꿈 후 마지막 열
        word = wordArr[wordArr.length-1];

        //console.log(word);
        // 줄바꿈 후 마지막 열의 지명 체크
        if(word.startsWith('@')){

            // 띄어쓰기를 했을때 모달창을 닫음
            if(word.includes(' ')){
                setMentionModal(false);
            }else{
                if(isMentionModal){
                    // 모달창이 떠있다 = 참여자 리스트를 가져왔다.
                    var tempChatRoomUserList = [];
                    
                    word = word.substr(1, word.length); // @ 제거 - 검색 데이터
                    
                    // 서버에서 가져온 chatRoomUserList
                    for(var i = 0 ; i < chatRoomUserList.length; i++){
                        var username = chatRoomUserList[i].name;
                        if(username.includes(word)){
                            tempChatRoomUserList.push(chatRoomUserList[i]);
                            // console.log('검색된 대상 : ', chatRoomUserList[i]);
                        }
                    }                    
                    setChatRoomSearchUserList(tempChatRoomUserList);
                
                    
                }else{
                    // 지명대상 참여자 조회
                    const getChatRoomUsersPromise = getChatRoomUsersCall();
                    getChatRoomUsersPromise.then(promiseResult=>{
                        //console.log(promiseResult.result);
                        if(promiseResult.result !== null){
                            var list = [promiseResult.result];
                            var json = JSON.parse(list);
                            if(json !== null){
                                setChatRoomUserList(json);
                                setChatRoomSearchUserList(json);        
                                setMentionModal(true);
                            }
                        }
                        // 기존은 문자열 그대로 컴포넌트로 넘겼음. 
                        // setChatRoomUserList(promiseResult.result);
                        // setMentionModal(true);
                    })
                }
            }

        }
        setContents(e.target.value);    
     
    }
    // 채팅 데이터 esc 감지 -> 지명 모달 닫기 처리
    function escKeyDown(e){
        //console.log('onKeyDown 이벤트 감지 :', e.code);
        
        if(e.code === 'Escape'){
            if(isMentionModal){
                setMentionModal(false);
            }
        }
    }
    const chatMentionModal = <UserChatMentionModal chatRoomUserList={chatRoomSearchUserList} 
        closeModal={()=>{
            setMentionModal(false);
        }} 
        selectUser={(user)=>{
    
            // 지명 라인 
            var temp = wordArray[wordArrayIdx];
            // 지명 검색단어 -> 선택한 사용자로 replace
            temp = '@' + temp.replace(temp, user.name) +'@mt';
            wordArray[wordArrayIdx] = temp;
            var tempContents = '';
            // \n을 기준으로 split된 라인들을 합치는 과정
            for(var i = 0; i < wordArray.length; i++){
                
                if(i == wordArray.length-1){
                    tempContents += wordArray[i]
                }else{
                    tempContents += wordArray[i] + '\n';
                }
            }

            setMentionModal(false);
            setContents(tempContents);
                        
        }}>
    </UserChatMentionModal>

        // 키가 입력 될때마다 감지 값은 handleChange 함수가 변경함. 
        const handleKeyDown = (event) => {
            
            if (event.key === 'Enter' && event.shiftKey) {
            // console.log('Shift+Enter 입력됨');         
            }
            
            else if (event.key === 'Enter' && contents.trim().length == 0) {
            event.preventDefault(); // 기본 동작 취소
            //console.log('단순 Enter 입력 차단됨');

            }else if(event.key === 'Enter'){
                // 채팅 발송
                // console.log('발신 내용 : ', event.target.value);
                if(emptyRoomFlag){
                    
                    // 비동기로 방생성 API 호출 이후에 채팅 라인 전달 처리
                    // 생성자, 룸키, 참여자, 방제목
                    const roomKeyPromise = putRoomKey(sender, roomKey, recevier, title);
                    roomKeyPromise.then(roomKeyPromiseResult=>{
                        // console.log(roomKeyPromiseResult);
                        // 20240312 여기까지 확인함. 

                        sendMessage(event.target.value);
                        setMentionModal(false);
                        setEmptyRoomFlag(false);
                    })

                }else{
                     sendMessage(event.target.value);
                     setMentionModal(false);
                }
            }
        };

        // 바뀔때 마다 감지해서 contents를 변경함. 
        const handleChange = (event) => {
            setContents(event.target.value);
        };

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
                        <td>
                            <textarea id='chatTextArea' rows="9" style={{width:"100%"}} placeholder='채팅을 입력해주세요... [줄바꿈 Shift + Enter]'
                                onChange={handleChange}
                                value ={contents}
                                onKeyDown={handleKeyDown}
                         > </textarea></td>
                    </tr>   
                </tbody>
                <tbody id ='chatRoomButton'>
                    <tr>                    
                        <td colSpan='5'>
                            <input type ='button' value='botton1'></input>
                            <input type ='button' value='botton2'></input>
                            <input type ='button' value='botton3'></input>
                            <input id='chatTextSend' type ='submit' value='전송'></input>
                        </td>            
                    </tr>
                </tbody>
            </table>
        </form>

        {/* 지명 채팅 대상자 리스트 모달*/}
        {isMentionModal ? chatMentionModal : ''}
    </div>
                 
    )


}


export default UserChatContentsInput