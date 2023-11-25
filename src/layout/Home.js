import axios from 'axios';
import AccessToken from '../modules/AccessToken';

axios.defaults.withCredentials = true;
const Home = (props) => {
    
    return (
        <div className='home'>
            
            <input type="button" value="async test" onClick={()=>{
            axios({
                method:'GET',
                url : 'http://localhost:8080/user/random'
                }).then(function(response){
              
                const flag = response.data.flag;
                const errorCode = response.data.error_code;

                if(errorCode == '403'){
                    // 바로 로그아웃
                    props.logout();
                }else{
                    // refresh 토큰 검증용 로직 
                    const promise = AccessToken(flag, errorCode);
                    promise.then(result =>{
                        if(result ==='logout'){
                            props.logout();
                        }
                    }).catch(function(error){
                        console.log(error);
                    }) 

                    
                }

                // access token 재발급 로직 
                // if(flag ==='fail' && error_code === '400'){
                    
                //     axios({
                //         method:'POST',
                //         url:'http://localhost:8080/user/accessToken'
                //     }).then(function(response){

                //         const flag = response.data.flag;
                //         if(flag === 'success'){
                //             const accesstoken  = response.data.token;
                //             axios.defaults.headers.common['Authorization'] = `Bearer ${accesstoken}`;
                //         }else if(flag === 'fail'){
                //             const resultCode = response.data.result_code;
                //             alert('로그인 시간이 만료되어 로그인 페이지로 이동합니다.');
                //             axios.defaults.headers.common['Authorization'] = null;
                //             props.logout();
                //         }
                //     }).catch(function(response){
                //         console.log(response);
                //     })
                // }else{
                //     // 정상
                // }
                }).catch(function(error){
                console.log(error);
                })
        
              }}
              />

        </div>
    )
}

export default Home;