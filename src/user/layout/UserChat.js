import '../css/UserChat.css';
import axios from 'axios';
import Parser from 'html-react-parser';
axios.defaults.withCredentials = true;




function UserChat(props){
    
    console.log('UserChat', props.list);
    var roomInfo = props.list.room_info;
    // const items = ['a','b','c','d','e','f','g','h','i','j'];
    console.log(roomInfo);
    const items = [roomInfo];
    const jsonData = JSON.parse(items);
    console.log(jsonData);

    const newItem = [jsonData];
    return(
        
        <div>
            <div id ='chatListDiv'>
                <table id ='chatListTable'>
                    <tbody>
                        {newItem.map((item) =>
                        <tr key={item}>

                            <td>방제목 : {item.chat_room_title}</td>
                            <td>{item.chat_participants}</td>
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