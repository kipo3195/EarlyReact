import { useEffect, useRef, useState } from 'react';

function AddressChatRoomModal(props){

    var myInfo = props.myInfo;
    var friendInfo = props.friendInfo;

    function closeModal(e){
        e.preventDefault();
        props.closeModal();
    }

    return (
        <div id='addrChatRoomDiv'>
            <div id ='addrChatRoomTitle'>
                <table id='addrChatRoomCloseTable'>
                    <tbody>
                        <tr>
                            <td><span className='addrChatRoomTitleName'>나</span>와 <span className='addrChatRoomTitleName'>{friendInfo.name}</span>님의 1:1 대화방</td>
                            <td id='addrChatRoomCloseTd'>
                                <input type='button' value='X' onClick={e=>{closeModal(e)}}></input>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div id ='addrChatRoomContents'>
                채팅 내용영역
            </div>
            <div id ='addrChatRoomEnter'>
                채팅입력 영역
            </div>
            <div id ='addrChatRoomBtn'>
                버튼 영역
            </div>
        </div>
    )
}


export default AddressChatRoomModal;