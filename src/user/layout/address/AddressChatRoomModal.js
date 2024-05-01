import { useEffect, useRef, useState } from 'react';
import UserChatContentsInput from '../chat/UserChatContentsInput';

import '../../css/UserChat.css'
import MentionCheck from '../../../modules/MentionCheck';

function AddressChatRoomModal(props){

    const [contentLines, setContentLines] = useState([]);
    const scrollRef = useRef();
    const [nextLine, setNextLine] = useState([]);

    var myInfo = props.myInfo;
    var friendInfo = props.friendInfo;

    var roomKey = props.roomKey;
    var recevier = props.recevier;
    var sender = props.sender;
    var emptyRoomFlag = props.emptyRoomFlag;
    var title = props.title;
    var createRoomDate = props.createRoomDate;
    var lineDatas = props.lineDatas;

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
            var lines = JSON.parse(lineDatas);
              // 서버로 부터 받아온 라인들
              setContentLines(lines);
              // 서버로 부터 받아온 라인 중 다음 라인조회 기준 -> 라인 더 불러올때 
              setNextLine(props.nextLine);
              // 서버로 부터 받아온 라인 중 가장 낮은 라인
              // setMinLineKey(lines[0].chatLineKey)
        }

    }, [lineDatas])
    console.log(recevier);

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
        <div id='addrChatRoomDiv'>
            <div id ='addrChatRoomTitle'>
                <table id='addrChatRoomCloseTable'>
                    <tbody>
                        <tr>
                            {
                                title != undefined ? 
                            <td><span className='addrChatRoomTitleName'>{title}</span></td>
                            :
                            <td><span className='addrChatRoomTitleName'>나</span>와 <span className='addrChatRoomTitleName'>{friendInfo.name}</span>님의 1:1 대화방</td>
                            }
                            <td id='addrChatRoomCloseTd'>
                                <input type='button' value='X' onClick={e=>{closeModal(e)}}></input>
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