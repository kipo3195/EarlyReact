
function UserChatRoomUsersModal(props){
 
    var userList = [props.chatRoomUserList];
    var users = JSON.parse(userList);
    console.log(users);

    return(

        <div>
            <table >
                <tbody>
                    <tr>
                        <td>참여자</td>
                        <td colSpan='3'> 
                            <button>
                                X
                            </button>
                        </td>
                    </tr>
                    
                    {
                        (users.map((user)=>
                        (
                            <tr>{user.name}</tr>
                        )))
                    }

                </tbody>
            </table>
        </div>

    )

}

export default UserChatRoomUsersModal;