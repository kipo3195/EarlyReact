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

    console.log('다시호출');
    
    const chatContentsInput 
        = <UserChatContentsInput client={props.client} chatRoomKey={roomKey} recevier={recevier} sender={sender}

              addLine={(line)=>{

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
                <table>
                    <tbody>
                        {contentLines && contentLines.map((line) =>
                            <tr className='contentLineTr'>
                                <td className='contentLineTd'>{line.lineData}</td>    
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>


            {/* 채팅 입력창*/}
            {chatContentsInput}
            
        </div>
    
    )
}

export default UserChatContents