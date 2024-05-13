import { useEffect, useRef, useState } from 'react';
import UserChatContentsInput from '../chat/UserChatContentsInput';


import MentionCheck from '../../../modules/MentionCheck';
import axios from 'axios';

axios.defaults.withCredentials = true;

function AddressChatRoomModal(props){

    const serverUrl = process.env.REACT_APP_SERVER_A_URL;

    const [contentLines, setContentLines] = useState([]);
    const scrollRef = useRef();
    const [nextLine, setNextLine] = useState([]);
    const [endLineFlag, setEndLineFlag] = useState(false);

    // 최초 수신한 채팅 라인- null이아닌경우는 읽어야할 채팅이 존재함. 
    const [newRecvLine, setNewRecvLine] = useState(null);

    var myInfo = props.myInfo;
    var friendInfo = props.friendInfo;

    var roomKey = props.roomKey;
    var recevier = props.recevier;
    var sender = props.sender;
    var emptyRoomFlag = props.emptyRoomFlag;
    var title = props.title;
    var createRoomDate = props.createRoomDate;
    var lineDatas = props.lineDatas;
    var recvData = props.recvData;

    // 닫기
    function closeModal(e){
        e.preventDefault();
        props.closeModal();
    }

    // 채팅방 라인 그리기 
    useEffect(()=>{
        if(lineDatas === '' || lineDatas == undefined){
            // 생성되지 않은 방
            setContentLines('');
            setNextLine(props.nextLine);
        }else{
            // 서버로 부터 받아온 라인들
            var lines = JSON.parse(lineDatas);

            setContentLines(lines);

            // 서버로 부터 받아온 라인 중 가장 낮은 라인 
            setNextLine(lines[0].chatLineKey);
        }
        return(
            // 해당 방에 대해서 채팅 라인을 다 불러왔다면
            // 방을 옮겨서 들어갈때 초기화 해주기 위함.
            setEndLineFlag(false)
        )

    }, [lineDatas])

    // 채팅 라인 더 불러오기 
    function getChatLines(e){
        e.preventDefault();
        if(!endLineFlag){
            const getChatLinesPromise = getChatLinesRequest();
            
            getChatLinesPromise.then((promise)=>{
                console.log(promise);
                var type = promise.type;
                var data = promise.data;
                if(type && data){
                    var result = type;
                    if(result === 'success'){
                        var temp = data.chatRoomLine;
                        if(temp != undefined){
                            var beforeContents = [...contentLines];
                            var appendContents = JSON.parse(temp);
                            const newArr = [
                                ...appendContents,
                                ...beforeContents
                            ]
                            setContentLines(newArr);
                            setNextLine(newArr[0].chatLineKey);
                        }else{
                            setEndLineFlag(true);
                        }
                    }
                } 
            })
        }else{
            //console.log('더 불러올 라인 없음');
        }
        
    }
    
    async function getChatLinesRequest(){
        var returnData = null;
        await axios({
            url:serverUrl+'/user/getChatLines',
            method:'post',
            data:{
                roomKey : roomKey,
                enterType : "a",
                userId : myInfo.username,
                readLineKey : nextLine
            }
        }).then(function(response){
            
            returnData = response.data;
            
        }).catch(function(error){
            console.log(error);
        });

        return returnData;
    }

    // 채팅방 모달 클릭시 읽음처리 
    function readChat(e){
        e.preventDefault();
        
        if(newRecvLine != null){
            // 신규 채팅 라인이 있을때만..
            const readChatPromise = readChatRequest();
    
            readChatPromise.then((promise)=>{
                var type = promise.type;
                var data = promise.data;
                if(type && data){
                    var result = type;
                    if(result === 'success'){
                        props.readLines(data.chat);
    
                        // 모든 라인을 읽음 처리함. 
                        setNewRecvLine(null);
                    }
                }
            })
        }
    }

    // 읽음처리
    async function readChatRequest(){

        var returnData = null;

        await axios({
            url:serverUrl+'/user/readLines',
            method:'post',
            data:{
             chatRoomKey : roomKey,
             userId : sender
            }
        }).then(function(response){

            returnData = response.data;
        }).catch(function(error){
            console.log(error);
        });

        return returnData;
    }

    // 실시간 채팅 수신 
    useEffect(()=>{

        if(recvData != null){
            var json = JSON.parse(props.recvData);
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
            // setScrollFix(true);
            // console.log(json.chatLineKey, newRecvLine)
            // 최초 수신한 라인
            if(newRecvLine == null){
                setNewRecvLine(json.chatLineKey);
            }
        }
    },[recvData]);


    const chatContentsInput 
    = <UserChatContentsInput client={props.client} chatRoomKey={roomKey} recevier={recevier} sender={sender} emptyRoomFlag={emptyRoomFlag}
          title={title} createRoomDate ={createRoomDate} 
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
           
            //console.log('add line 호출');
            // 리스트 갱신용 
            // props.refreshList();

            // 채팅 발신시 스크롤 제일 하단으로 이동함. 
            //scrollRef.current.scrollTop = scrollRef.current?.scrollHeight;
            
        }}></UserChatContentsInput>


        // 지명채팅 키워드가 있을때 
        function mentionCheck(chatLine){
            var result = '';
    
            result = <MentionCheck checkLine={chatLine}></MentionCheck>
    
            return result;
        }    

    return (
        <div id='addrChatRoomDiv' onClick={e=>{readChat(e)}}>
            <div id ='addrChatRoomTitle'>
                <table id='addrChatRoomCloseTable'>
                    <tbody>
                        <tr>
                            {
                                title !== undefined ? 
                            <td><span className='addrChatRoomTitleName'>{title}</span></td>
                            :
                            <td><span className='addrChatRoomTitleName'>나</span>와 <span className='addrChatRoomTitleName'>{friendInfo.name}</span>님의 1:1 대화방</td>
                            }
                            <td id='addrChatRoomCloseTd'>
                                <input type='button' value='X' onClick={e=>{closeModal(e)}}></input>
                            </td>
                            <td >
                                <input type='button' value='더 불러오기' onClick={e=>{getChatLines(e)}}></input>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div id ='addrChatRoomContents'>
                <table id ='chatRoomContentsTable'>
                    <tbody>
                        {
                        (contentLines === undefined) ? (''):
                        (contentLines && contentLines.map((line) =>(
                            (line.chatSender === sender)
                            ?
                            (<tr align ='right' key ={line.chatLineKey} className='myChatLineTR'>
                                {/* 말풍선 크기 제어*/}
                                <td className='chatRoomContentsTableTdETC'></td>

                                <td className='chatRoomContentsTableTdReadOnly'></td>

                                {/* 채팅 라인 공감 */}
                                
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
                                    
                                    {/*지명채팅인지 정규식으로 체크*/}          
                                    {line.chatContents.includes('@mt') ? 
    
                                    mentionCheck(line.chatContents)

                                    : line.chatContents}

                                </td>
                            </tr>
                            )
                            :
                                // 상대방의 채팅 라인
                                (<tr align ='left' key ={line.chatLineKey} className='othersChatLineTR'>
                                {/* 채팅 라인 */} 
                                <td className='chatRoomContentsTableLTd' >
                                    {line.chatSenderName} 님의 말 : 
                                    
                                    {/*지명채팅인지 정규식으로 체크*/}          
                                    {line.chatContents.includes('@mt') ? 
    
                                    mentionCheck(line.chatContents)

                                : line.chatContents}
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
                            
                                <td className='chatRoomContentsTableTdReadOnly'></td>
                                {/* 말풍선 크기 제어*/}
                                <td className='chatRoomContentsTableTdETC'></td>
                            </tr>)
                        )))
                    }
                    </tbody>
                </table>
              
            </div>
            <div id ='addrChatRoomEnter'>
                {/* 채팅 입력창*/}
                {chatContentsInput}
            </div>
            {/* <div id ='addrChatRoomBtn'>
                버튼 영역
            </div> */}
        </div>
    )
}


export default AddressChatRoomModal;