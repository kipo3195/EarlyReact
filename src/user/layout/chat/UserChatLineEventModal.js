import chatLineHeart from '../../../etc/img/chatLineHeart.png'
import chatLineCheck from '../../../etc/img/chatLineCheck.png'
import chatLineGood from '../../../etc/img/chatLineGood.png'
import { Client } from '@stomp/stompjs';

function UserChatLineEventModal(props){

    var users = props.lineEventUser;
    var like = null;
    var good = null;
    var check = null;
    console.log(props.x, props.y);
    var top = props.x/10;
    var left = 50;
    if(users != null){
        like = users.like;
        good = users.good;
        check = users.check;
    }

    return(

        <div id='chatLineModal' style={{
            top : top,
            left : left
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
                    <tr id='chatLineModalEventTr'>
                        <td><img className='chatLineModalImg' src={chatLineHeart} width='20' alt='heart'></img></td>
                        <td><img className='chatLineModalImg' src={chatLineCheck} width='20' alt='heart'></img></td>
                        <td><img className='chatLineModalImg' src={chatLineGood} width='20' alt='heart'></img></td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}



export default UserChatLineEventModal;