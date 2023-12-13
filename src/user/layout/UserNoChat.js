import '../css/UserChat.css';
import axios from 'axios';
axios.defaults.withCredentials = true;




function UserNoChat(props){
    

    
    return(
        
        <div>
            {/*리스트 영역 */}
            <div id ='chatListDiv'>
                <table id ='chatListTable'>
                    <tr>
                        <td id ='userNoChatTd'>주소록에서 사용자들과 함께 채팅방을 만들어보세요 !</td>    
                    </tr>
                </table>
            </div>

            {/*컨텐츠 영역*/}
            <div id ='contentDiv'>

            </div>
        </div>
    )

}

export default UserNoChat;