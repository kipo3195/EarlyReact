

function UserChatMentionModal(props) {

    var userList = [props.chatRoomUserList];
    var users = JSON.parse(userList);

    return(

        <div id ='chatMentionModal'>
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