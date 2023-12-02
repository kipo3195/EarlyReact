import '../css/UserHeader.css'
import address from '../../etc/img/address.png'
import chat from '../../etc/img/chat.png'
import message from '../../etc/img/message.png'
import email from '../../etc/img/email.png'
import calendar from '../../etc/img/calendar.png'
import env from '../../etc/img/env.png'


function UserHeader(){

    return(
            <header id ='userHeader'>
                <table id ='userHeaderTable'>
                    <tbody>
                        <tr>
                            <th id='userHeaderTitle'>Early!</th>
                            <td id='address' className='userHeaderTd'><img className='userHeaderTdImg' src={address} width='45' alt='address'></img></td>
                            <td id='chat' className='userHeaderTd'><img className='userHeaderTdImg' src={chat} width='45' alt='chat'></img></td>
                            <td id='message' className='userHeaderTd'><img className='userHeaderTdImg' src={message} width='45' alt='message'></img></td>
                            <td id='email' className='userHeaderTd'><img className='userHeaderTdImg' src={email} width='45' alt='email'></img></td>
                            <td id='calendar' className='userHeaderTd'><img className='userHeaderTdImg' src={calendar} alt='calendar'></img></td>
                            <td id='env' className='userHeaderTd'><img className='userHeaderTdImg' src={env} width='45' alt='env'></img></td>
                        </tr>
                    </tbody>
                </table>                

            </header>
    
    )


}

export default UserHeader;

