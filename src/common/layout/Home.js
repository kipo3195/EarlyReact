import axios from 'axios';
import AccessToken from '../../modules/AccessToken';

axios.defaults.withCredentials = true;
function Home(){
    
    console.log("dd");
    

    return(
            <h2> home 에 오신 것을 환영 합니다. </h2>
            
    )
 
   // return (
        // <div className='home'>
        
        //     <input type="button" value="async test" onClick={()=>{
        //     axios({
        //         method:'GET',
        //         url : 'http://localhost:8080/user/random'
        //         }).then(function(response){
              
        //         const flag = response.data.flag;
        //         const errorCode = response.data.error_code;

        //         if(errorCode === '403'){
        //             // 바로 로그아웃
        //             props.logout();
        //         }else{
        //             // refresh 토큰 검증용 로직 
        //             const promise = AccessToken(flag, errorCode);
        //             promise.then(result =>{
        //                 if(result ==='logout'){
        //                     props.logout();
        //                 }
        //             }).catch(function(error){
        //                 console.log(error);
        //             }) 

                    
        //         }

        
        //         }).catch(function(error){
        //         console.log(error);
        //         })
        
        //       }}
        //       />

        // </div>
    //)
}

export default Home;