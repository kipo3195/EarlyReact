import { useState } from 'react';
import axios from 'axios';
import '../css/join.css'

const Join = (props) => {

    const serverUrl = process.env.REACT_APP_SERVER_JOIN_URL;
    
    const [username, setUsername] = useState('');
    const [dupFlag, setDupFlag] = useState('');
    // react의 onChange는 상태가 변경될때마다 호출됨. 
    const idChange = (e) =>{
        setUsername(e.target.value);
    }
    // get방식일때 쿼리 스트링 params
    const idDupCheck =() =>{

        if(username === ''){
            alert("id를 입력해 주세요.");
            return;
        }
        //email 정규식 체크
        var emailRex = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i; 
        if(username.match(emailRex) === null){
            alert("계정은 email 형식으로 사용해야합니다.");
            setUsername('');
            return;
        }

        axios({
            method:'GET',
            url : serverUrl+'idDupCheck',
            params:{
                "username":username
              }
        }).then(function(response){        
            const result = response.data.result;
            //console.log(response);
            if(result === 'true'){
                alert("중복된 계정이 존재합니다. 다시 입력하세요");
                setDupFlag(null);
            }else{
                alert("가입 가능한 계정입니다.");
                setDupFlag('false');
                // 문자열로 만듦
            }
            
        }).catch(function(error){
          console.log(error);
        })
    }
    return (
        <div className='join'>
            <div>
                <table id ='joinTitle'>
                    <tr>
                        <td id='joinTitleSide'></td>
                        <td id='joinTitleSide'></td>
                        <td id='joinEarly'>Early !</td>
                        <td id='joinTitleSide'></td>
                        <td id='joinTitleSide'></td>

                    </tr>
                </table>
            </div>
            
            <div id ='joinTableDiv'>
                <form onSubmit={event=>{
                    event.preventDefault();
                    if(dupFlag !== 'false'){
                        alert("중복체크 후 회원가입해 주세요.");
                        setDupFlag(null);
                        return;
                    }
                    const userId = username;
                    const password = event.target.password.value;
                    const passwordCheck = event.target.passwordCheck.value;
                    const name = event.target.name.value;
                    const phoneNumber = event.target.phoneNumber.value;
                    const birth = event.target.birth.value;
                    if(password !== '' && passwordCheck !== ''){
                        if(password !== passwordCheck){
                            alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
                            event.target.password.value = '';
                            event.target.passwordCheck.value = '';
                        }else{
                            if(name !== '' && phoneNumber !== '' ){
                                axios({
                                    method:'POST',
                                    url : serverUrl,
                                    // data를 json 형태로 보내기 때문에 서버쪽에서 requestBouy어노테이션 + 객체 형태로 받아야함.
                                    data:{
                                        username:userId,
                                        password:password,
                                        name:name,
                                        phoneNumber:phoneNumber,
                                        birthDay:birth
                                    }
                                }).then(function(response){
                                    const result = response.data.flag;
                                    //console.log(response);
                                    if(result === "success"){
                                        alert("회원가입 완료!");
                                        // 최초 페이지로 이동
                                        props.successJoin();
                                    }else{
                                        alert("회원가입 실패. 다시 시도해 주세요.");
                                    }
                                }).catch(function(error){
                                    console.log(error);
                                    alert("회원가입 실패. 다시 시도해 주세요.");
                                })
                            }else{
                                alert("입력 데이터를 확인하세요 !");					
                            } 

                        }
                    }

                }}>
                    
                    <table id='joinTable'>
                        <tr> 
                            <td className='joinTableSideTd'></td>
                            <td className='joinTableMainTd'>id : <input type='email' size='26' placeholder=" e-mail 정보입력" name='username' onChange={idChange}></input></td> 
                            <td className='joinTableSideTd'></td>
                        </tr>
                        <tr>
                            <td className='joinTableSideTd'></td>
                            <td id='joinTableDupTd'><input type='button' id="joinDupBtn" value=' ID 중복체크' onClick={idDupCheck} ></input></td>
                            <td className='joinTableSideTd'></td>
                        </tr>
                        <tr> 
                            <td className='joinTableSideTd'></td>
                            <td className='joinTableMainTd'>pw : <input type='password' size='26' placeholder=" 비밀번호 입력" name='password'></input></td>
                            <td className='joinTableSideTd'></td>
                        </tr>
                        <tr> 
                            <td className='joinTableSideTd'></td>
                            <td className='joinTableMainTd'>pwCheck : <input type='password' size='26' placeholder=" 비밀번호 입력" name='passwordCheck'></input></td>
                            <td className='joinTableSideTd'></td>
                        </tr>
                        <tr> 
                            <td className='joinTableSideTd'></td>
                            <td className='joinTableMainTd'>name : <input type="text" size='26' placeholder=" 이름" name='name'/></td>
                            <td className='joinTableSideTd'></td>
                        </tr>
                        <tr> 
                            <td className='joinTableSideTd'></td>
                            <td className='joinTableMainTd'>phone : <input type="text" size='26' name='phoneNumber' placeholder=" 휴대폰 입력 '-' 생략" ></input></td>    
                            <td className='joinTableSideTd'></td>
                        </tr>
                        <tr> 
                            <td className='joinTableSideTd'></td>
                            <td className='joinTableMainTd'>birth : <input type="text" size='26' name='birth' placeholder=" 생년월일 8자리 ex) 20201030"></input></td>
                            <td className='joinTableSideTd'></td>
                        </tr>
                        <br></br>
                        <tr>
                            <td className='joinTableSideTd'></td>
                            <td id='joinTableSubmit'><input id='joinSubmit' type="submit" value='Join'></input></td>
                            <td className='joinTableSideTd'></td>
                        </tr>
                        <br/>
                        <tr>
                            <td className='joinTableSideTd'></td>
                            <td>
                                <a id ='joinTableALink' href='' onClick={event=>{
                                    event.preventDefault();
                                    props.back();
                                }}>뒤로가기</a>
                            </td>
                            <td className='joinTableSideTd'></td>
                        </tr>    
                    </table>
                </form>
            </div>
           
           
        </div>
    )
}

export default Join;