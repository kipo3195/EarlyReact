import axios from 'axios';


async function AddressList(props){

    var serverUrl = process.env.REACT_APP_SERVER_A_URL;
    var returnData = null;
    var userId = props;

    await axios({
        method:'post',
        url : serverUrl + '/address/list',
        data :{
            "userId" : userId,
            "limit" : "0"
        }
    }).then(function(response){
        //console.log(response);
        returnData = response.data;
    }).catch(function(error){
        console.log(error);
    })

    return returnData;
}

export default AddressList;