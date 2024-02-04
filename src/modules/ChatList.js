import axios from 'axios';
import UserChat from '../user/layout/UserChat';



async function ChatList(props){

    var userId = props;
    var returnData = null;

    await axios({
        method:'post',
        url:'http://localhost:8080/user/chatList',
        data : {
            "username" : userId 
        }
    }).then(function(response){

        //console.log('ChatList', response);
        returnData = response.data;
        //console.log(returnData);
        

    }).catch(function(error){

        console.log(error);
    
    })

    return returnData;

    
}


export default ChatList;