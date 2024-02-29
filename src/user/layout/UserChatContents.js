
import '../css/UserChat.css';
import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import chatLineHeart from '../../etc/img/chatLineHeart.png'
import chatLineCheck from '../../etc/img/chatLineCheck.png'
import chatLineGood from '../../etc/img/chatLineGood.png'
import chatLineEventUser from '../../etc/img/chatLineEventUser.png'
import chatRoomUsers from '../../etc/img/chatRoomUsers.png'

import UserChatContentsInput from './chat/UserChatContentsInput';
import UserChatLineEventModal from './chat/UserChatLineEventModal';
import UserChatRoomUsersModal from './chat/UserChatRoomUsersModal';

axios.defaults.withCredentials = true;

function UserChatContents(props){
    
    // const [title, setTitle] = useState(null);
    const [contentLines, setContentLines] = useState([]); // []하지 않으면 최초 채팅시 contentLine is not iterable..
    const [nextLine, setNextLine] = useState();
    //const [minLineKey, setMinLineKey] = useState();
    
    // 최초 수신한 채팅 라인
    const [newRecvLine, setNewRecvLine] = useState(null);

    // 채팅 라인 이벤트 modal 
    const [isLineModal, setLineModal] = useState(false);
    // 채팅 라인 이벤트 사용자 
    const [lineEventUser, setLineEventUser] = useState(null);
    // 클릭시 좌표
    const [clientX, setClientX] = useState(null);
    const [clientY, setClientY] = useState(null);

    // 채팅방 참여자 이벤트 modal
    const [isChatRoomUserModal, setChatRoomUserModal] = useState(false);
    
    // 채팅방 참여자 리스트
    const [chatRoomUserList, setChatRoomUserList] = useState(null);

    
    // false scroll 하단 위치 (최초, 채팅 입력) 
    // true scroll 상단으로 고정(더 불러오기)
    const[scrollFix, setScrollFix] = useState(false);

    var title = props.chatRoomTitle;
    var roomKey = props.chatRoomKey;
    
    var sender = props.sender;
    var recevier = props.chatRoomUsers;

    var recvData = props.recvData;
    var lineDatas = props.lineData;

    var readLines = props.readLines;

    var reloadLines = props.reloadLines;

    var reloadLineEvent = props.reloadLineEvent;
    
    // 스크롤 감지 콜백함수 
    function onScrollCallBack(){

        if(scrollRef.current?.scrollTop === 0 && nextLine !== '0'){
            //nextLine 이 '0'인 경우 최초 호출시 서버에서 하나도 받은게 없음 -> 요청하지 않도록 처리
            
            // 채팅 라인 더 불러오기 
            const promise = getChatRoomLine();
            promise.then(PromiseResult=>{
                 //console.log(PromiseResult.chatRoomLine);
                // console.log(PromiseResult.nextLine);
                if(PromiseResult.chatRoomLine != null){
                    var json = JSON.parse(PromiseResult.chatRoomLine);
                    if(json != null){
                        // 리액트에서 array를 합치는 방법(spread) 더 불러온 라인을 기존 라인 위에 더하기
                        const newArr = [
                            ...json, // 더 불러온 라인
                            ...contentLines // 기존에 그려진 라인 
                        ]
                        // console.log(newArr);
                        
                       setContentLines(newArr);
                       //setMinLineKey(json[0].chatLineKey);
                    }
                }
                setScrollFix(true);
                setNextLine(PromiseResult.nextLine);

            })
        }
    }
    // 채팅 라인을 더 조회 하는 함수
    async function getChatRoomLine(){
        var result = null;
    
        await axios({
            method:'POST',
            url:'http://localhost:8080/user/chatRoomLineAppend',
            data:{
                chatRoomKey : roomKey,
                lastLineKey : nextLine
            }}).then(function(response){
                //console.log(response.data);
                result = response.data;
            }).catch(function(error){
                console.log(error);
                
            })

        return result;
    }

    // 내가 속한 채팅방의 라인의 미확인 사용자 건수 갱신          --------------------  1
    useEffect(()=>{
        
        if(reloadLines !== undefined){
            var unreadLineMap = reloadLines;
            var copyContentLines = [...contentLines];
                for(let i = 0; i < copyContentLines.length; i++){
                // 미확인 건수 갱신
                // 현재 내가 보고 있는 라인들 = contentLines을 복사한 copyContentLines을 반복하면서 갱신된 라인 reloadLines의 키(라인키)에 따른 
                // value(건수) 갱신 후 setContentLines
                if(unreadLineMap[copyContentLines[i].chatLineKey] !== undefined){
                    // console.log(copyContentLines[i]);
                    copyContentLines[i].chatUnreadCount = unreadLineMap[copyContentLines[i].chatLineKey];
                }
                } 
              
                setContentLines(copyContentLines);
                // 모두읽음 -> 신규 수신한 라인 초기화
                setNewRecvLine(null);

             console.log('호출 순서 1');
        }

    }, [reloadLines]);


    // 최초 입장시 채팅 라인 그리기         ------------------------    2 
    useEffect(()=>{
        // === 는 값 & 자료형
        // == 는 값
        // undefined는 null과 같은 '값'
        // 최초 랜더링시 lineDatas가 undifined인 경우 대비
        if(lineDatas != null){
            
            var lines = JSON.parse(lineDatas);
    
            // 서버로 부터 받아온 라인들
            setContentLines(lines);
            // 서버로 부터 받아온 라인 중 다음 라인조회 기준 -> 라인 더 불러올때 
            setNextLine(props.nextLine);
            // 서버로 부터 받아온 라인 중 가장 낮은 라인
            // setMinLineKey(lines[0].chatLineKey)
            
        }

        return() =>{
            // 해당 컴포넌트(UserChatContents) 가 unMount 될때 처리함. 
            // 방을 입장할때마다 UserChatContents 해당 방에 해당하는 UserChatContents 컴포넌트가 호출 되므로 
            // 현재 UserChatContents컴포넌트가 unMount 된다. 해당 컴포넌트에 해당하는 modal을 닫기 위하여 작성하였다. 
            setChatRoomUserModal(false);
        }
    }, [lineDatas])


    // 스크롤 
    // 최초입장, 발신시에는 스크롤이 가장 하단.
    // 수신시에는 스크롤의 변경없음.                 ------------------------    3
    const scrollRef = useRef();
    useEffect(()=>{
        // 가장마지막 랜더링 이후에 실행됨.
        // 스크롤 제일 하단에 위치 시키기
        // 스크롤의 최상단의 값을 스크롤의 높이로 처리함.   
        if((scrollRef.current?.scrollTop === 0 || scrollRef.current?.scrollTop !== 0) && !scrollFix){
            // scrollRef.current?.scrollTop === 0 -> 최초 입장
            // scrollRef.current?.scrollTop !== 0 -> 채팅 발신 
            // scrollFix 채팅 수신시에만 true

            scrollRef.current.scrollTop = scrollRef.current?.scrollHeight;
        }else if(scrollRef.current?.scrollTop === 0 && scrollFix){
            scrollRef.current.scrollTop = 10;
        }

        
        

    })
    
    // 채팅 수신시                               ------------------------    4
    useEffect(()=>{
        // props로 전달 받은 recvData를 수신시에만 contentLines에 넣어줄 필요가 있다.
        // useState를 사용하자니, 데이터가 잘 바뀌지 않는 문제가 있었고, 수신/발신을 구분 짓기 어려웠다.
        // 발신 시 const [recvData, setRecvData] = useState(props.recvData) setRecvData통해 랜더링 해도 props로 받아오는 값은 유지되었다.
        // 그래서 useEffect를 활용하여, recvData가 바뀔때마다 = 수신할때 마다 로 판단하여 처리 하였다.
        // 리스트에 add 해주면 된다. 
        if(recvData !== null){
            var json = JSON.parse(props.recvData);
            
            // console.log(json);
            let recvLine = {
                chatSender : json.chatSender,
                chatContents : json.chatContents,
                chatUnreadCount : json.chatUnreadCount,
                chatLineKey : json.chatLineKey
            };

            // 기존라인에 더하기 (아래에 append)
            var copyContentLines = [...contentLines];
            copyContentLines.push(recvLine);
            setContentLines(copyContentLines);

            // 20240127 기존 사용 로직 -> contentsLine과 newContentsLines을 분리하여 보여줌 
            // var copyContentLines = [...newContentLines];
            // copyContentLines.push(recvLine);
            // setNewContentLines(copyContentLines);
            
            // 수신시에는 scrollTop이 0이 아니기 때문에 고정됨.
            setScrollFix(true);
            // console.log(json.chatLineKey, newRecvLine)
            // 최초 수신한 라인
            if(newRecvLine == null){
                
                setNewRecvLine(json.chatLineKey);
            }

        }
    }, [recvData]);

    // 읽음처리 
    // 읽음 처리 설계 20240130 기준
    // 서버의 user/readLines API를 호출
    // recvLine의 이후 라인키를 모두 조회 
    // 요청 사용자(myUnreadLine)의 모든 미확인 건수 삭제 + 해당 라인의 미확인 사용자(unreadLineUsers) 삭제
    // 라인 별 미확인 사용자 (unreadLineUsers)의 count 계산 sCard
    // 라인을 key로 건수를 value 저장
    // 모든 라인키 처리 후 요청 사용자의 해당 채팅방 미확인 건수 0으로 만듦
    // 나의 전체 채팅방의 미확인 건수를 다 더함
    // /user/readLines의 response를 통해 채팅 전체건수, 해당 채팅방의 건수를 전달 받고
    // 웹소켓을 통해 해당 채팅방을 구독하는 모든 사용자에게 읽음 처리된 라인을 라인:건수의 형식으로 publish 하여 처리.
    async function read(){
        var result = null;
        //console.log(minLineKey, roomKey)
        await axios({
            method:'POST',
            url:'http://localhost:8080/user/readLines',
            data:{
                chatRoomKey : roomKey,
                recvLine : newRecvLine
            }}).then(function(response){
                //console.log('readLines : ', response.data);
                result = response.data;
            }).catch(function(error){
                console.log(error);
                result = 'error';
            })

            return result;
    }

    // 읽음처리 이벤트 감지 - 나의 해당 채팅방 & 전체 건수 refresh
    function readChatLines(){

        if(newRecvLine !== null){
            const readLinePromise = read();
            readLinePromise.then(promiseResult=>{
                
                if(promiseResult !== 'error'){
                     console.log(promiseResult);
                    props.readLines(promiseResult.chat);
                }
            })
        }else{
            //console.log('신규 수신한 라인 없음');
        }
        
    }
    // 버튼 이벤트에 동적 데이터 부여
    const likeEvent = (lineKey, e, type) => {
        e.preventDefault();
        console.log(lineKey, type);
         
        const likeEventPromist = likeEventCall(lineKey,type);
        likeEventPromist.then(promiseResult=>{
            console.log(promiseResult);
        })
    }

    // 속해있는 채팅방의 라인 이벤트 갱신 - 어떤 이벤트가 변경되었는지에 따라 처리함. 
    useEffect(()=>{
        //console.log('라인이벤트 변동 감지', reloadLineEvent);
        if(reloadLineEvent !== undefined){
            
            var copyContentLines = [...contentLines];
            for(let i = 0; i < copyContentLines.length; i++){
                if(copyContentLines[i].chatLineKey === reloadLineEvent.lineKey){
                    if(reloadLineEvent.good !== undefined){
                        copyContentLines[i].chatGoodCnt = reloadLineEvent.good;
                    }else if(reloadLineEvent.like !== undefined){
                        copyContentLines[i].chatLikeCnt = reloadLineEvent.like;
                    }else if(reloadLineEvent.check !== undefined){
                        copyContentLines[i].chatCheckCnt = reloadLineEvent.check;
                    }
                }
            } 
            setContentLines(copyContentLines);

        }

    }, [reloadLineEvent]);

    // 버튼 이벤트 호출
    async function likeEventCall(lineKey, type){
        var result = null;
        await axios ({
            method : 'post',
            url : 'http://localhost:8080/user/putChatLineEvent',
            data : {
                roomKey : roomKey,
                lineKey : lineKey,
                type :  type
            }
        }).then(function(response){
            console.log(response);
            result = response.data;
        }).catch(function(error){
            console.log('error! ', error);
        })

        return result;

    }

    // 라인 이벤트 클릭 사용자 정보 조회 type은 모달창을 어디서 띄울지에 대한 계산의 필요성 때문 
    function likeEventUser(lineKey, e, type){
        
        e.preventDefault();
                
        // 현재 채팅 라인의 div 
        var element = document.getElementById("chatRoomContents");
        var left = element.getBoundingClientRect().left; // x축
        var top = element.getBoundingClientRect().top; // y축
    
        // 뷰포트 ? 현재 창에서 문서를 볼 수 있는 부분(전체화면이라면 화면 전체)

        // 클릭한 이미지가 브라우저에서 얼만큼 이동 되었는지 (왼쪽) - chatRoomContents(element)가 뷰포트를 기준으로 얼만큼 떨어져 있는지 
        // = div영역의 왼쪽에서 얼만큼 이동 시키면 되는지 
        var x = e.clientX - left;

        // 클릭한 이미지가 브라우저에서 얼만큼 이동 되었는지 (위) - chatRoomContents가 뷰포트를 기준으로 얼만큼 떨어져 있는지 
        // = div영역의 위에서 얼만큼 이동 시키면 되는지 
        var y = e.clientY - top;
     
        // 콜백함수 
        const likeEventPromist = likeEventUserCall(lineKey);    
        likeEventPromist.then(promiseResult=>{
    
            if(promiseResult.result === 'true'){
            
                setLineEventUser(promiseResult.users);
                setLineModal(true);
                
                // 왼쪽인지 오른쪽인지 체크
                if(type !== null){
                    if(type ==='right'){
                        // 모달창이 채팅라인 왼쪽으로 이동해야 하므로 모달창의 크기(250) 보다 작아야함 
                        // 이미지 크기 만큼 더 이동(20)
                        x = x - 270; 
                    }else{
                        x = x + 20; // 이미지 크기 만큼 더 이동(20)
                    }
                }
                setClientX(x);
                setClientY(y);

                // 공감모달 -> 참여자 모달 닫기
                if(isChatRoomUserModal || chatRoomUserList !== null){
                    setChatRoomUserModal(false);
                    setChatRoomUserList(null);
                }

                
            }
        })
        
    }
    // 라인 이벤트 클릭 사용자 API 호출 
    async function likeEventUserCall(lineKey){
        var result = null;
        await axios ({
            method : 'post',
            url : 'http://localhost:8080/user/getChatLineEventUser',
            data : {
                roomKey : roomKey,
                lineKey : lineKey
            }
        }).then(function(response){
            // console.log(response);
            result = response.data;
        }).catch(function(error){
            console.log('error! ', error);
        })
        return result;
    }

    
    // 채팅방 참여자 조회 API
    function getChatRoomUsers(e){

        var x = e.clientX; 
        // 라인 이벤트 모달은 chatRoomContents안에서 위치를 구했었다면,
        // 채팅방 참여자 모달은 채팅타이틀을 포함한 contentDiv에서 위치를 구해야 한다. 
        // 그렇기 때문에 클릭한 이미지가 브라우저에서 얼만큼 이동 되었는지 (왼쪽) 좌표인 clientX를 사용하여 좌표를 구하여 사용했다. 
        var y = e.clientY;
        const getChatRoomUsersPromise = getChatRoomUsersCall();
        getChatRoomUsersPromise.then(promiseResult=>{
            //console.log(promiseResult);
            setChatRoomUserList(promiseResult.result);
            setChatRoomUserModal(true);

            // 참여자 모달 -> 공감 모달 닫기
            if(isLineModal || lineEventUser !== null){
                setLineModal(false);
                setLineEventUser(null);
            }
            setClientX(x);
            setClientY(y);

        })

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



    const chatContentsInput 
        = <UserChatContentsInput client={props.client} chatRoomKey={roomKey} recevier={recevier} sender={sender}
              addLine={(line)=>{
                // 채팅 발신시
                // 여기서 props로 받아오는 값을 set 하더라도 props의 값이 빠지지는 않는다.  

                // spread 문법. 기존 contentsLines를 얕은 복사 
                // 사용하지 않는다면 copyContentsLines를 참조할 뿐이다. 
                // 참조하는 값으로 useState를 사용해 봤자 리액트는 다시 랜더링 하지 않는다. 
                
                // 신규 채팅은 아래로 더함
                var copyContentLines = [...contentLines];
                copyContentLines.push(line);
                setContentLines(copyContentLines);
               
                // 채팅 발신시 스크롤 제일 하단으로 이동함. 
                scrollRef.current.scrollTop = scrollRef.current?.scrollHeight;
                
            }}></UserChatContentsInput>

    // 라인 이벤트 사용자 확인용 modal 호출
    const chatLineEventModal
            = <UserChatLineEventModal lineEventUser={lineEventUser} x={clientX} y={clientY}
            //닫기
            closeModal={()=>{
                    setLineModal(false);
                    setLineEventUser(null);
                }}>
            </UserChatLineEventModal>

    // 채팅방 참여자 확인용 modal 호출
    const userChatRoomUsers
            =<UserChatRoomUsersModal chatRoomUserList={chatRoomUserList} x={clientX} y={clientY}
            
            //닫기
            closeModal={()=>{
                setChatRoomUserModal(false);
                setChatRoomUserList(null);
            }}></UserChatRoomUsersModal>


    
    return (

        //채팅창
        <div id ='contentDiv' onClick={readChatLines}>
            {// 채팅방 참여자 확인용 modal 호출
            ((isChatRoomUserModal) ? userChatRoomUsers : '')}    

            {/* 채팅방 제목 */}
            <div id ='chatRoomTitle'>
                <table>
                    <tbody>
                        <tr>
                            <td id='chatRoomTitleTd'>{title}</td>
                            <td id='chatRoomUsersTd'><img src={chatRoomUsers} alt='chatRoomusers' onClick={(e)=>{getChatRoomUsers(e)}}></img></td>
                        </tr>
                    </tbody>
                </table>     
            </div>

            {/* 채팅방 라인 */}
            <div id ='chatRoomContents'>
                <div id='chatRoomContentsChild' ref={scrollRef} onScroll={onScrollCallBack}>
                    <table id='chatRoomContentsTable'>
                        <tbody>
                            {/* 이하 조회한 채팅*/}
                            {
                                contentLines && contentLines.map((line) => (
                                    (line.chatSender === sender)
                                    ?
                                    // 나의 채팅 라인
                                    (<tr align ='right' key ={line.chatLineKey} className='myChatLineTR'>
                                        {/* 말풍선 크기 제어*/}
                                        <td className='chatRoomContentsTableTdETC'></td>

                                        <td className='chatRoomContentsTableTdReadOnly'></td>

                                        {/* 채팅 라인 공감 */}
                                        <td className='chatRoomContentsTableTdE'>
                                            {/* 누가 눌렸는지 확인*/}
                                            {((line.chatLikeCnt !== null && line.chatLikeCnt !== '0') ||
                                                (line.chatCheckCnt !== null && line.chatCheckCnt !=='0') ||
                                                    (line.chatGoodCnt !== null && line.chatGoodCnt !=='0'))
                                            ?
                                             (<img className='chatLineImg' src={chatLineEventUser} width='20' alt='user' id='mylineLikeUsers'
                                                onClick={(e)=>{likeEventUser(line.chatLineKey, e, 'right')}}></img>)
                                            :
                                             ("")}
                                            
                                            {/* 좋아요 */}
                                            <img className='chatLineImg' src={chatLineHeart} width='20' alt='heart' 
                                                onClick={(e)=>{likeEvent(line.chatLineKey, e, 'like')}}>
                                            </img>
                                            {(line.chatLikeCnt === null || line.chatLikeCnt === '0')
                                            ?
                                            (""):(line.chatLikeCnt)}
                                            {" "}

                                            {/* 체크 */}
                                            <img className='chatLineImg' src={chatLineCheck} width='20' alt='heart' 
                                                onClick={(e)=>{likeEvent(line.chatLineKey, e, 'check')}}>
                                            </img>
                                            {(line.chatCheckCnt === null || line.chatCheckCnt ==='0')
                                            ?
                                            (""):(line.chatCheckCnt)}
                                            {" "}

                                            {/* 굿 */}
                                            <img className='chatLineImg' src={chatLineGood} width='20' alt='heart' 
                                                onClick={(e)=>{likeEvent(line.chatLineKey, e, 'good')}}>
                                            </img>
                                            {(line.chatGoodCnt === null || line.chatGoodCnt ==='0')
                                            ?
                                            (""):(line.chatGoodCnt)}
                                            {" "}

                                            <input type='button' value='reply'></input>
                                        </td>
                                        {/* 미확인 건수 */}
                                        <td className ='unreadCount'>
                                            {
                                            (line.chatUnreadCount === '0')
                                            ?
                                            ''
                                            :
                                            line.chatUnreadCount
                                            }
                                        </td>
                                        {/* 채팅 라인 */} 
                                        <td className='chatRoomContentsTableRTd'>
                                            {line.chatContents}
                                        </td>
                                    </tr>
                                    )
                                    :
                                    // 상대방의 채팅 라인
                                    (<tr align ='left' key ={line.chatLineKey} className='othersChatLineTR'>
                                        {/* 채팅 라인 */} 
                                        <td className='chatRoomContentsTableLTd' >
                                            {line.chatSenderName} 님의 말 : {line.chatContents}
                                        </td>
                                        {/* 미확인 건수 */}
                                        <td className ='unreadCount'>
                                            {
                                            (line.chatUnreadCount === '0')
                                            ?
                                            ''
                                            :
                                            line.chatUnreadCount
                                            }
                                            </td>
                                        {/* 채팅 라인 공감 */}
                                        <td className='chatRoomContentsTableTdE'>

                                            {/* 누가 눌렸는지 확인*/}
                                            {((line.chatLikeCnt !== null && line.chatLikeCnt !== '0') ||
                                                (line.chatCheckCnt !== null && line.chatCheckCnt !=='0') ||
                                                    (line.chatGoodCnt !== null && line.chatGoodCnt !=='0'))
                                            ?
                                             (<img className='chatLineImg' src={chatLineEventUser} 
                                             onClick={(e)=>{likeEventUser(line.chatLineKey, e, 'left')}} width='20' alt='user'></img>)
                                            :
                                             ("")}

                                             <img className='chatLineImg' src={chatLineHeart} width='20' alt='heart' 
                                                onClick={(e)=>{likeEvent(line.chatLineKey, e, 'like')}}>
                                            </img>
                                            {(line.chatLikeCnt === null || line.chatLikeCnt === '0')
                                            ?
                                            (""):(line.chatLikeCnt)}
                                            {" "}

                                            <img className='chatLineImg' src={chatLineCheck} width='20' alt='heart' 
                                                onClick={(e)=>{likeEvent(line.chatLineKey, e, 'check')}}>
                                            </img>
                                            {(line.chatCheckCnt === null || line.chatCheckCnt ==='0')
                                            ?
                                            (""):(line.chatCheckCnt)}
                                            {" "}

                                            <img className='chatLineImg' src={chatLineGood} width='20' alt='heart' 
                                                onClick={(e)=>{likeEvent(line.chatLineKey, e, 'good')}}>
                                            </img>
                                            {(line.chatGoodCnt === null || line.chatGoodCnt ==='0')
                                            ?
                                            (""):(line.chatGoodCnt)}
                                            {" "}

                                            <input type='button' value='reply'></input>
                                        </td> 
                                        <td className='chatRoomContentsTableTdReadOnly'></td>
                                        {/* 말풍선 크기 제어*/}
                                        <td className='chatRoomContentsTableTdETC'></td>
                                    </tr>)
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            {// 라인 이벤트 사용자 확인용 modal 호출
            ((isLineModal) ? chatLineEventModal : '')}


           
            </div>
            
            {/* 채팅 입력창*/}
            {chatContentsInput}
            
        </div>
    
    )
}

export default UserChatContents;