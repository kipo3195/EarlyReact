
function UserChatRoomUsersModal(props){
 
    var userList = [props.chatRoomUserList];
    var users = JSON.parse(userList);
    
    //console.log(props.y );
    
    return(

        <div id ='chatRoomUserModal' style={{
            left : props.x,
            top : props.y+10
            
        }}>
            
            <div >
                <table id ='chatRoomUserModalTable' >
                    <tbody>
                        <tr id='chatRoomUserModalTitleTr' >
                            <td id='chatRoomUserModalComment'>참여자</td>
                            <td id ='chatRoomUserModalClose'> 
                                <button onClick={props.closeModal}>
                                    X
                                </button>
                            </td>
                        </tr>
                        

                        {
                            (users.map((user)=>
                            (
                                <tr id='chatRoomUserModalUserTr'>
                                    <td className="chatRoomUserModalUserProfile">early!</td> {/* 프로필 사진 TODO */}
                                    <td className="chatRoomUserModalUser">{user.name}</td>
                                </tr>
                            )))
                        }

                    </tbody>
                </table>
            </div>
            
            <div id ='chatRoomUserInvite'>
                <table>
                    <tr>
                        <td id='chatRoomUserInviteBtn'>
                            <button>초대하기</button>
                        </td>
                    </tr>
                </table>
            </div>
        </div>

    )

}

export default UserChatRoomUsersModal;