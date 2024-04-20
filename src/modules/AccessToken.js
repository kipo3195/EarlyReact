import axios from 'axios';


async function AccessToken (errorCode){
    const serverUrl = process.env.REACT_APP_SERVER_A_URL;
    var result = null;
    console.log('AccessToken.js errorCode', errorCode)
    // access token 재발급 로직 
    // axios는 기본적으로 비동기 처리 라이브러리.
    // 비동기 처리이기 때문에 accessToken 수행 후 result에 값을 할당 하기도 전에 return해 버리는 것이 문제.
    // 그래서 동기 처리를 가능하게 하는 await 를 사용하기 위해 async를 사용(await는 async함수 안에 존재 해야하는 것이 규칙)
    // 단 await를 사용하면 자동으로 Promise 객체를 만드는 것 처럼 보임. 
    // 그래서 AccessToken을 호출 하는 곳에서 return 데이터를 확인해 보면 Promise 객체가 반환 되는 것을 확인함. 
    // Promise 객체의 PromiseResult에 접근해서 데이터를 사용하면 된다. .then으로 접근 할 수 있다.
    // console.log(_flag, _errorCode);
    if(errorCode === '400'){
        await axios({
            method:'POST',
            url:serverUrl +'/user/accessToken'
        }).then(function(response){
            const flag = response.data.flag;
            
            if(flag === 'success'){
            
                console.log('엑세스 토큰 갱신시 여기 호출')
                result = 'success';
                const accesstoken  = response.data.token;
                axios.defaults.headers.common['Authorization'] = `Bearer ${accesstoken}`;
            }else if(flag === 'fail'){
                
                result = 'logout';
                axios.defaults.headers.common['Authorization'] = null;
                
            }
        }).catch(function(error){
            console.log(error);
        })

    }else{
        // 만료안됨
    }

    return result;

}

export default AccessToken;