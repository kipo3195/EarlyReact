import '../css/find.css';

const FindId = (props) => {
    return (
        <div className='findId'>
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
                        <td id='findIdTitle' colSpan='5'>찾으시려는 계정의 사용자 정보를 입력해 주세요.</td>
                    </tr>
                </table>
            </div>
            <div>
                <table id = 'findTable'>
                    <tr className='findTableTr'> 
                        <td className='findTableSideTd'></td>
                        <td className='findTableMainTd'>이름 : <input type='text' size='26' placeholder=" 이름" name='name'></input></td> 
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

export default FindId;