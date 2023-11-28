import '../css/find.css';

const FindPw = (props) => {
    return (
        <div className='findPw'>
            <div>
                <table id ='findTitle'>
                    <tr>
                        <td id='findTitleSide'></td>
                        <td id='findTitleSide'></td>
                        <td id='findEarly'>Early !</td>
                        <td id='findTitleSide'></td>
                        <td id='findTitleSide'></td>
                    </tr>
                    <tr>
                        <td id='findIdTitle' colSpan='5'>비밀번호를 찾으시려는 계정을 입력해주세요.</td>
                    </tr>
                </table>
            </div>
            <div>
                <table id = 'findTable'>
                    <tr className='findTableTr'> 
                        <td className='findTableSideTd'></td>
                        <td className='findTableMainTd'>계정 : <input type='email' size='26' placeholder=" e-mail 정보 입력" name='username'></input></td> 
                        <td className='findTableSideTd'></td>
                    </tr>
                 
                    <tr className='findTableTr'> 
                        <td className='findTableSideTd'></td>
                        <td className='findTableMainTd'>phone : <input type="text" size='26' name='phoneNumber' placeholder=" 휴대폰 입력 '-' 생략" ></input></td>    
                        <td className='findTableSideTd'></td>
                    </tr>

                    <tr>
                        <td className='findTableSideTd'></td>
                        <td id='findTableSubmit'><input id='findSubmit' type="submit" value='찾기'></input></td>
                        <td className='findTableSideTd'></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td id='findTableFindIdALinkTd'>
                         찾으시려는 계정이 생각 나지 않는다면? &ensp;
                        <a id ='findTableFindIdALink' href='' onClick={event=>{
                            event.preventDefault();
                            
                            if(window.confirm('아이디 찾기로 이동하시겠습니까?')){
                                props.findId();
                            }

                        }}>아이디 찾기</a>
                        </td>
                        <td></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td id='findTableALinkTd'>
                        <a id ='findTableALink' href='' onClick={event=>{
                            event.preventDefault();
                            props.back();
                        }}>뒤로가기</a>
                        </td>
                        <td></td>
                    </tr>
                </table>
            </div>

        </div>
    )
}

export default FindPw;