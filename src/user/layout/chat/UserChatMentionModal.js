

function UserChatMentionModal(props) {

    // console.log(props.chatRoomUserList);
    // var userList = [props.chatRoomUserList];
    // var users = JSON.parse(userList);

    var users = props.chatRoomUserList;
    return(
        // 지명 모달창 표시 
        <div id ='chatMentionModal' style={{
            top : 470,
            left : 750    
        }}>
            <table>
                <tbody>
                    <tr>
                        <td>
                            <button onClick={props.closeModal}>X</button>
                        </td>
                    </tr>
                        {
                            (users.map((user)=>
                            (
                                <tr id='chatMentionModalUserTr'>
                                    <td className="chatMentionModalUserProfile">early!</td> {/* 프로필 사진 TODO */}
                                    <td className="chatMentionModalUser">{user.name}</td>
                                </tr>
                            )))
                        }
                </tbody>
            </table>
        </div>


    )
}



export default UserChatMentionModal