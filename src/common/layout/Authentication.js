import { useState } from 'react';
import axios from 'axios';

const Authentication = () => {

    const [kakaoId, setKakaoId] = useState('');

    const idChange = (e) =>{
        setKakaoId(e.target.value);
    }

    return (
        <div className='authentication'>
            <h2 id='authenticationTitle' >Early</h2>
            
            <form onSubmit={event=>{
                event.preventDefault();
                if(kakaoId !== ''){
                    if(window.confirm("해당 계정으로 인증 요청 하시겠습니까?")){
                        axios({

                        }).then(function(response){
                            
                        }).catch(function(error){
                            console.log(error);
                        })
                    }else{
                        
                    }
                }else{
                    alert("인증받을 계정을 입력해주세요.")
                }
            }}>
                <table >
                    <tr>
                        <td>카카오톡 계정 : </td>
                        <td><input type="text" onChange={idChange} ></input></td>
                    </tr>
                    <tr>
                        <input type="submit" value="인증하기"></input>
                    </tr>
                </table>
            </form>      

        </div>
    )
}

export default Authentication;