import axios from 'axios';
import { useEffect, useState } from 'react';

axios.defaults.withCredentials = true;

function UserEnv(){

    const [test, setTest] = useState('1');
    
    useEffect(()=>{
        console.log('버튼을 클릭할때마다 실행됨.');
        console.log(test);
        return()=>{
            console.log('컴포넌트가 사용되지 않을때 실행됨');
        }
    },[test]);

    useEffect(()=>{
        console.log('최초에 한번만 실행됨.');
        console.log(test);
        return()=>{
            console.log('해당 컴포넌트가 사용되지 않을때 실행됨 2');
        }
    },[]);

    function clickTest(){
        setTest(test+1);
    }
    return(
        <div>
            <h2>{test}</h2>
            <input type='button' onClick={clickTest}></input>
        </div>
    )

}

export default UserEnv;