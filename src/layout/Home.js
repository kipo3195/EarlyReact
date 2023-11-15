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
                }).catch(function(error){
                console.log(error);
                })
        
              }}/>

        </div>
    )
}

export default Home;