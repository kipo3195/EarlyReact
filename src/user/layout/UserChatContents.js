import '../css/UserChat.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

import UserChatContentsInput from './chat/UserChatContentsInput';

axios.defaults.withCredentials = true;

function UserChatContents(props){
    
    // const [title, setTitle] = useState(null);
    const [contentLines, setContentLines] = useState();
    var title = props.chatRoomTitle;
    var roomKey = props.chatRoomKey;
    
    var sender = props.sender;
    var recevier = props.chatRoomUsers;

    var recvData = props.recvData;

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
                lineData : json.chatContents    
            };
            var copyContentLines = [...contentLines];
            copyContentLines.push(recvLine);
            setContentLines(copyContentLines);
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
                var copyContentLines = [...contentLines];
                copyContentLines.push(line);
                setContentLines(copyContentLines);

            }}></UserChatContentsInput>
    
    //방이 변경되는 이벤트 호출 시마다 그리는 라인데이터를 초기화 시킴roomKey 자리에는 props의 어떤 데이터를 받아도 됨. 
    useEffect(()=>{
    
        setContentLines([]);

    },[roomKey])
    
    
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
                <div id='chatRoomContentsChild'>
                    <table id='chatRoomContentsTable'>
                        <tbody>
                            {
                                contentLines && contentLines.map((line) =>(

                                   (line.userid === sender)
                                   ? 
                                   (<tr className='chatRoomContentsTableTrR' align ='right'>
                                        <td className='chatRoomContentsTableTrTdETC'></td>
                                        <td className='chatRoomContentsTableTrTdETC'></td>
                                        <td className='chatRoomContentsTableTrRTd'>
                                            {line.lineData}
                                        </td>
                                   </tr>)
                                   :
                                    (<tr className='chatRoomContentsTableTrL' align ='left'>
                                        <td className='chatRoomContentsTableTrLTd' >
                                            {line.userid}님의 말 : {line.lineData}
                                        </td>
                                        <td className='chatRoomContentsTableTrTdETC'></td>
                                        <td className='chatRoomContentsTableTrTdETC'></td>
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

export default UserChatContents