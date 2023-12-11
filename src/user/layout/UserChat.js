import '../css/UserChat.css';
import axios from 'axios';
axios.defaults.withCredentials = true;




function UserChat(props){
    
    console.log('UserChat', props.list);
    var roomInfo = props.list.room_info;
    const items = [roomInfo];
    const jsonData = JSON.parse(items);
    
    //채팅 데이터 jsonArray
    console.log(jsonData);

    
    return(
        
        <div>
            <div id ='chatListDiv'>
                <table id ='chatListTable'>
                    <tbody>
                        {jsonData.map((item) =>
                        <tr className='chatListTr' key={item.room_key}>
                            <td className='chatListTd'>방제목 : {item.chat_room_title} 참여자 : {item.chat_participants}</td>
                        </tr>
                        )}            
                    </tbody>
                </table>
            </div>
            <div id ='contentDiv'>

            </div>
        </div>
    )

}

export default UserChat;