import axios from 'axios';
import UserChat from '../user/layout/UserChat';



async function ChatList(){

    var returnData = null;

    await axios({
        method:'post',
        url:'http://localhost:8080/user/chatList'
    }).then(function(response){

        // console.log(response);
        returnData = response.data;
        // console.log(returnData);

    }).catch(function(error){

        console.log(error);
    
    })

    return returnData;

    
}


export default ChatList;