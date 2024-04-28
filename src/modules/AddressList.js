import axios from 'axios';


async function AddressList(userId, limit){

    var serverUrl = process.env.REACT_APP_SERVER_ADDRESS_URL;
    var returnData = null;
    var userId = userId;
    var limit = limit;

    await axios({
        method:'post',
        url : serverUrl + 'list',
        data :{
            "userId" : userId,
            "limit" : limit
        }
    }).then(function(response){
        console.log(response);
        returnData = response.data;
    }).catch(function(error){
        console.log(error);
    })

    return returnData;
}

export default AddressList;