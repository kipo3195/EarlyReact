import axios from 'axios';
import UserChat from '../user/layout/UserChat';



async function ChatList(){

    var data = null;

    await axios({
        method:'post',
        url:'http://localhost:8080/user/chatList'
    }).then(function(response){

        console.log(response);
        data = response.data;

    }).catch(function(error){

        console.log(error);
    
    })

    return <UserChat list={data}></UserChat>

    
}


export default ChatList;