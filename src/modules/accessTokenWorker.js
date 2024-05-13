import axios from 'axios';

// 서버로 refreshtoken을 전달하기 위함.
axios.defaults.withCredentials = true;
/*eslint-disable no-restricted-globals*/
self.addEventListener('message', e =>{

    const user = e.data.userId;  
    const accesstoken = e.data.accesstoken;

    // 서버로 accesstoken을 전달하기 위함.
    axios.defaults.headers.common['Authorization'] = `Bearer ${accesstoken}`;
    
    // 15초 후 accesstoken 갱신 호출 
    setTimeout(()=> tokenVerificationken(user, accesstoken), 15000);
    
  });
  
  function tokenVerificationken(user, accesstoken){

    const serverUrl = process.env.REACT_APP_SERVER_A_URL;
    console.log('여기를 호출하는가 ? ', accesstoken);
    var _accesstoken = null;

    axios({
        method:'POST',
        url: serverUrl+'/user/accessToken'
    }).then(function(response){
        const flag = response.data.flag;
        
        if(flag === 'success'){
        
            //console.log('엑세스 토큰 갱신시 여기 호출');
            _accesstoken  = response.data.token;

        }else if(flag === 'fail'){
            
            console.log('엑세스 토큰 갱신에러시 여기호출');
            
        }

        // App.js의 accessTokenRefresh()의 postMessage
        postMessage({
            _accesstoken
        });

    }).catch(function(error){
        console.log(error);
    })
  }