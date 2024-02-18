


import { useEffect, useState } from 'react';
import chatLineHeart from '../../../etc/img/chatLineHeart.png'
import chatLineCheck from '../../../etc/img/chatLineCheck.png'
import chatLineGood from '../../../etc/img/chatLineGood.png'

function UserChatLineEventModal(props){

    // console.log(props.x, props.y);
    var _users = JSON.parse(props.lineEventUser);

    //console.log(_users);
    
    const [likeUsers, setLikeUsers] = useState(null);
    const [goodUsers, setGoodUsers] = useState(null);
    const [checkUsers, setCheckUsers] = useState(null);

    // 모달창 메인을 어떤 것으로 보여줄지 관리
    const [mainView, setMainView] = useState(null);
    
    useEffect(()=>{

        // 변경되었음에도 state가 유지되는 것을 방지함.
        setGoodUsers(null);
        setCheckUsers(null);
        setLikeUsers(null);

        if(_users.good !== undefined){
            setGoodUsers(_users.good);
            setMainView('good');
        }
        if(_users.check !== undefined){
            setCheckUsers(_users.check);
            setMainView('check');
        }
        if(_users.like !== undefined){
            setLikeUsers(_users.like);
            setMainView('like');
        }
        

    }, [props.lineEventUser]);

    // 모달창 img 선택 -> 이벤트에 따른 사용자 리스트 변경처리 
    function viewMainChange(e, type){
        setMainView(type);

    }

    return(

        <div id='chatLineModal' style={{
            left : props.x,
            top : props.y
            
        }}>
            <table id='chatLineModalTable'>
                <tbody>
                    <tr id='chatLineModalTr' align ='right'>
                        <td id='chatLineModelComment' align ='left'>공감한 사람</td>
                        <td colSpan='3'> 
                            <button id="lineEventModalCloseBtn" onClick={props.closeModal}>
                                X
                            </button>
                        </td>
                    </tr>

                    {/* 이벤트 표시 */}
                    <tr id='chatLineModalEventTr'>
                        {((likeUsers !== null)?(<td><img className='chatLineModalImg' src={chatLineHeart} width='20' alt='heart' onClick={(e) => {viewMainChange(e, 'like')}}></img></td>):(''))}
                        {((checkUsers !== null)?(<td><img className='chatLineModalImg' src={chatLineCheck} width='20' alt='heart'onClick={(e) => {viewMainChange(e, 'check')}}></img></td>):(''))}
                        {((goodUsers !== null)?(<td><img className='chatLineModalImg' src={chatLineGood} width='20' alt='heart' onClick={(e) => {viewMainChange(e, 'good')}}></img></td>):(''))}
                    </tr>
                </tbody>
            </table>
            
            <div id='chatLineModalUsers'>
                <table>
                    <tbody >
                        {/* 이벤트에 따른 사용자 리스트 */}
                        {(mainView === 'like')?(likeUsers.map((like)=>(
                            <tr className='userListTr'>{like}</tr>
                        ))):''}
                        {(mainView === 'good')?(goodUsers.map((good)=>(
                            <tr className='userListTr'>{good}</tr>
                        ))):''}
                        {(mainView === 'check')?(checkUsers.map((check)=>(
                            <tr className='userListTr'>{check}</tr>
                        ))):''}
                    </tbody>
                </table>
            </div>
        </div>
    )
}



export default UserChatLineEventModal;