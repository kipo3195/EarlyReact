import '../css/UserChat.css';
import axios from 'axios';
import { useEffect, useState, useRef } from 'react';

import UserChatContentsInput from './chat/UserChatContentsInput';

axios.defaults.withCredentials = true;

function UserChatContents(props){
    
    // const [title, setTitle] = useState(null);
    const [newContentLines, setNewContentLines] = useState();
    const [contentLines, setContentLines] = useState();
    const [nextLine, setNextLine] = useState();
    
    // false scroll 하단 위치 (최초, 채팅 입력) 
    // true scroll 상단으로 고정(더 불러오기)
    const[scrollFix, setScrollFix] = useState(false);

    var title = props.chatRoomTitle;
    var roomKey = props.chatRoomKey;
    
    var sender = props.sender;
    var recevier = props.chatRoomUsers;

    var recvData = props.recvData;
    var lineDatas = props.lineData;

    // 스크롤 감지 콜백함수 
    function onScrollCallBack(){

        if(scrollRef.current?.scrollTop === 0 && nextLine !== '0'){
            //nextLine 이 '0'인 경우 최초 호출시 서버에서 하나도 받은게 없음 -> 요청하지 않도록 처리
            const promise = getChatRoomLine();
            promise.then(PromiseResult=>{
                // console.log(PromiseResult.chatRoomLine);
                // console.log(PromiseResult.nextLine);
                if(PromiseResult.chatRoomLine != null){
                    var json = JSON.parse(PromiseResult.chatRoomLine);
                    if(json != null){
                        // 리액트에서 array를 합치는 방법(spread)
                        const newArr = [
                            ...json, // 더 불러온 라인
                            ...contentLines // 기존에 그려진 라인 
                        ]
                        // console.log(newArr);
    
                       setContentLines(newArr);
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
    
    // 스크롤 
    // 최초입장, 발신시에는 스크롤이 가장 하단.
    // 수신시에는 스크롤의 변경없음. 
    const scrollRef = useRef();
    useEffect(()=>{
    
        // 가장마지막 랜더링 이후에 실행됨.
        // 스크롤 제일 하단에 위치 시키기
        // 스크롤의 최상단의 값을 스크롤의 높이로 처리함. 
        // console.log('스크롤 : ',scrollFix);
        if(scrollRef.current?.scrollTop === 0 && !scrollFix){
            scrollRef.current.scrollTop = scrollRef.current?.scrollHeight;
        }else if(scrollRef.current?.scrollTop === 0 && scrollFix){
            scrollRef.current.scrollTop = 10;
        }


    })

    // 최초 입장시 채팅 라인 그리기
    useEffect(()=>{
        
        // === 는 값 & 자료형
        // == 는 값
        // undefined는 null과 같은 '값'
        // 최초 랜더링시 lineDatas가 undifined인 경우 대비
        if(lineDatas != null){
            
            var lines = JSON.parse(lineDatas);

            // 서버로 부터 받아온 라인들
            setContentLines(lines);

            // 서버로 부터 받아온 라인 중 다음 라인조회 기준
            setNextLine(props.nextLine);

            // 채팅방 라인 조회시 신규 채팅 초기화
            setNewContentLines([]);
        }
    }, [lineDatas])
    
    // 채팅 수신시 
    useEffect(()=>{
        // props로 전달 받은 recvData를 수신시에만 contentLines에 넣어줄 필요가 있다.
        // useState를 사용하자니, 데이터가 잘 바뀌지 않는 문제가 있었고, 수신/발신을 구분 짓기 어려웠다.
        // 발신 시 const [recvData, setRecvData] = useState(props.recvData) setRecvData통해 랜더링 해도 props로 받아오는 값은 유지되었다.
        // 그래서 useEffect를 활용하여, recvData가 바뀔때마다 = 수신할때 마다 로 판단하여 처리 하였다.
        // 리스트에 add 해주면 된다. 
        if(recvData !== null){
            var json = JSON.parse(props.recvData);
            let recvLine = {
                userid : json.chatSender,
                lineData : json.chatContents,
                unreadCount : json.chatUnreadCount   
            };
            var copyContentLines = [...newContentLines];
            copyContentLines.push(recvLine);
            setNewContentLines(copyContentLines);
            
            // 수신시에는 scrollTop이 0이 아니기 때문에 고정됨.

        }
    }, [recvData]);
    
    const chatContentsInput 
        = <UserChatContentsInput client={props.client} chatRoomKey={roomKey} recevier={recevier} sender={sender}
              addLine={(line)=>{
                // 채팅 발신시
                // 여기서 props로 받아오는 값을 set 하더라도 props의 값이 빠지지는 않는다.  

                // spread 문법. 기존 contentsLines를 얕은 복사 
                // 사용하지 않는다면 copyContentsLines를 참조할 뿐이다. 
                // 참조하는 값으로 useState를 사용해 봤자 리액트는 다시 랜더링 하지 않는다. 
                var copyContentLines = [...newContentLines];
                copyContentLines.push(line);
                setNewContentLines(copyContentLines);

                // 가장 마지막 랜더링시 처리를위해 top을 0으로변경
                scrollRef.current.scrollTop = 0;
                setScrollFix(false);
            }}></UserChatContentsInput>
    
    return (

        //채팅창
        <div id ='contentDiv'>

            {/* 채팅방 제목 */}
            <div id ='chatRoomTitle'>
                <table>
                    <tbody>
                        <tr>
                            <th id='chatRoomTitleTh'>{title}</th>
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
                                    (<tr align ='right' key ={line.chatSeq}>
                                        <td className='chatRoomContentsTableTdETC'></td>
                                        <td className='chatRoomContentsTableTdETC'></td>
                                        <td className='chatRoomContentsTableTdETC'></td>
                                        <td className='chatRoomContentsTableRTd'>
                                            {line.chatContents}
                                        </td>
                                    </tr>)
                                    :
                                    (<tr align ='left' key ={line.chatSeq}>
                                        <td className='chatRoomContentsTableLTd' >
                                            {line.chatSender}님의 말 : {line.chatContents}
                                        </td>
                                        <td id ='unreadCount'>{line.chatUnreadCount}</td>
                                        <td className='chatRoomContentsTableTdETC'></td>
                                        <td className='chatRoomContentsTableTdETC'></td>
                                    </tr>)
                                ))
                            }


                            {/* 이하 신규 채팅*/}
                            {
                                newContentLines && newContentLines.map((line) =>(

                                   (line.userid === sender)
                                   ? 
                                   (<tr align ='right' key ={line.chatSeq}>
                                        <td className='chatRoomContentsTableTdETC'></td>
                                        <td className='chatRoomContentsTableTdETC'></td>
                                        <td className='chatRoomContentsTableTdETC'></td>
                                        <td className='chatRoomContentsTableRTd'>
                                            {line.lineData}
                                        </td>
                                   </tr>)
                                   :
                                    (<tr align ='left' key ={line.chatSeq}>
                                        <td className='chatRoomContentsTableLTd' >
                                            {line.userid}님의 말 : {line.lineData}
                                        </td>
                                        <td id ='unreadCount'>{line.unreadCount}</td>
                                        <td className='chatRoomContentsTableTdETC'></td>
                                        <td className='chatRoomContentsTableTdETC'></td>
                                    </tr>)
                                ))

                            }
                        </tbody>
                    </table>
                </div>
            </div>


            {/* 채팅 입력창*/}
            {chatContentsInput}
            
        </div>
    
    )
}

export default UserChatContents;