import axios from 'axios';
axios.defaults.withCredentials = true;
const Home = () => {
    return (
        <div className='home'>
            <h2>안녕하세요 Early 오신것을 환영합니다!</h2>
            <input type="button" value="async test" onClick={()=>{
            axios({
                method:'GET',
                url : 'http://localhost:8080/user/random'
                }).then(function(response){
                console.log(response);
                
                const flag = response.data.flag;
                const error_code = response.data.error_code;

                if(flag ==='fail' && error_code === '400'){
                    
                    axios({
                        method:'POST',
                        url:'http://localhost:8080/user/accessToken'
                    }).then(function(response){
                        console.log(response);
                    }).catch(function(response){
                        console.log(response);
                    })
                }
                }).catch(function(error){
                console.log(error);
                })
        
              }}/>

        </div>
    )
}

export default Home;